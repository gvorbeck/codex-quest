/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Button,
  Checkbox,
  Collapse,
  Divider,
  InputNumber,
  Space,
  Spin,
  Typography,
} from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import {
  ArmorShields,
  CategoryCollapseProps,
  CharEquipmentStepProps,
  EquipmentItemSelectorProps,
  Item,
  Weapon,
} from "../types";

const CategoryCollapse: React.FC<CategoryCollapseProps> = ({
  title,
  dataRef,
  gold,
  setGold,
  equipment,
  setEquipment,
  race,
}) => {
  const items = Object.entries(dataRef.current);

  return (
    <>
      <Typography.Title level={2}>{title}</Typography.Title>
      {items.map(([key, value], index) => (
        <React.Fragment key={index}>
          <Typography.Paragraph>
            <Typography.Text strong>{key}</Typography.Text>
          </Typography.Paragraph>
          {value.map((item: any, itemIndex: number) => (
            <EquipmentItemSelector
              item={item}
              key={itemIndex}
              gold={gold}
              setGold={setGold}
              equipment={equipment}
              setEquipment={setEquipment}
              race={race}
            />
          ))}
        </React.Fragment>
      ))}
    </>
  );
};

const EquipmentItemSelector: React.FC<EquipmentItemSelectorProps> = ({
  item,
  gold,
  setGold,
  equipment,
  setEquipment,
  race,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const totalCost = item.costValue * quantity;
  const canAffordItem = totalCost <= gold;
  const isLargeWeapon = "size" in item && item.size === "large";
  const isHalflingOrDwarf = race === "Halfling" || race === "Dwarf";
  const isDisabled = isLargeWeapon && isHalflingOrDwarf;

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    const costInGold =
      item.costCurrency === "gp" ? item.costValue : item.costValue / 10;
    setGold(gold + (checked ? -costInGold * quantity : costInGold * quantity));
    setIsChecked(checked);

    if (checked) {
      setEquipment([...equipment, { ...item, quantity }]);
    } else {
      const updatedEquipment = equipment.filter((eq) => eq.name !== item.name);
      setEquipment(updatedEquipment);
    }
  };

  const handleQuantityChange = (value: number | null) => {
    if (value !== null && value >= 1) {
      const difference = (value - quantity) * item.costValue;
      setQuantity(value);

      if (gold - difference >= 0) {
        setGold(gold + (isChecked ? -difference : difference));
      } else {
        setQuantity(quantity);
      }

      const updatedEquipment = equipment.map((eq) => {
        if (eq.name === item.name) {
          return { ...eq, quantity: value };
        }
        return eq;
      });
      setEquipment(updatedEquipment);
    } else {
      setQuantity(0);
    }
  };

  let weightElement = null;
  let sizeElement = "";

  if ("weight" in item) {
    let weight: string | number = item.weight;
    if (weight === 0) weight = "**";
    else if (weight === 0.1) weight = "*";
    weightElement = `, Weight: ${weight}`;
  }

  if ("size" in item)
    sizeElement = `, Size: ${item.size?.slice(0, 1).toUpperCase()}`;

  return (
    <Typography.Paragraph>
      <Space direction="vertical">
        <Checkbox
          disabled={(!canAffordItem && !isChecked) || isDisabled}
          onChange={handleCheckboxChange}
        >
          <Space direction="vertical">
            <Typography.Text strong>{item.name}</Typography.Text>
            <Typography.Text type="secondary">
              {`Cost: ${item.costValue} ${item.costCurrency}` +
                weightElement +
                sizeElement}
            </Typography.Text>
          </Space>
        </Checkbox>
        {isChecked && (
          <InputNumber
            min={1}
            defaultValue={1}
            value={quantity}
            onChange={handleQuantityChange}
          />
        )}
      </Space>
    </Typography.Paragraph>
  );
};

export default function CharEquipmentStep({
  gold,
  setGold,
  equipment,
  setEquipment,
  race,
}: CharEquipmentStepProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [axes, setAxes] = useState<Weapon[]>([]);
  const [bows, setBows] = useState<Weapon[]>([]);
  const [daggers, setDaggers] = useState<Weapon[]>([]);
  const [swords, setSwords] = useState<Weapon[]>([]);
  const [hammersMaces, setHammersMaces] = useState<Weapon[]>([]);
  const [otherWeapons, setOtherWeapons] = useState<Weapon[]>([]);
  const [ammunition, setAmmunition] = useState<Weapon[]>([]);
  const [armorShields, setArmorShields] = useState<ArmorShields[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const itemsRef = useRef<Record<string, Item[]>>({});
  const axesRef = useRef<Record<string, Weapon[]>>({});
  const bowsRef = useRef<Record<string, Weapon[]>>({});
  const daggersRef = useRef<Record<string, Weapon[]>>({});
  const swordsRef = useRef<Record<string, Weapon[]>>({});
  const hammersMacesRef = useRef<Record<string, Weapon[]>>({});
  const otherWeaponsRef = useRef<Record<string, Weapon[]>>({});
  const ammunitionRef = useRef<Record<string, Weapon[]>>({});
  const armorShieldsRef = useRef<Record<string, ArmorShields[]>>({});

  const roller = new DiceRoller();
  const rollStartingGold = () => {
    const result = roller.roll("3d6*10");
    if (!(result instanceof Array) && result.total !== null)
      updateStartingGold(result.total);
  };
  const updateStartingGold = (startingGold: number | null) =>
    startingGold !== null && setGold(startingGold);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const fetchData = async (
    collectionName: string,
    setStateFunc: (data: any[]) => void,
    dataRef: React.MutableRefObject<Record<string, any[]>>
  ) => {
    const coll = collection(db, collectionName);
    const snapshot = await getDocs(coll);
    const dataArray = snapshot.docs.map((doc) => doc.data());
    setStateFunc(dataArray);
    dataRef.current[collectionName] = dataArray;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchData("items", setItems, itemsRef),
          fetchData("axes", setAxes, axesRef),
          fetchData("bows", setBows, bowsRef),
          fetchData("daggers", setDaggers, daggersRef),
          fetchData("swords", setSwords, swordsRef),
          fetchData("hammers-maces", setHammersMaces, hammersMacesRef),
          fetchData("other-weapons", setOtherWeapons, otherWeaponsRef),
          fetchData("ammunition", setAmmunition, ammunitionRef),
          fetchData("armor-and-shields", setArmorShields, armorShieldsRef),
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data from collections", error);
      }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    console.log(equipment);
  }, [equipment]);

  if (isLoading) {
    return <Spin />;
  }

  return (
    <>
      <Space.Compact>
        <InputNumber
          max={180}
          min={30}
          defaultValue={0}
          onChange={(value: number | null) => setGold(value || 0)}
          onFocus={handleFocus}
          type="number"
          value={gold}
        />
        <Button type="primary" onClick={rollStartingGold}>
          Roll 3d6x10
        </Button>
      </Space.Compact>
      <Divider orientation="left">Equipment Lists</Divider>
      <Collapse>
        {[
          { title: "Items", ref: itemsRef },
          { title: "Axes", ref: axesRef },
          { title: "Bows", ref: bowsRef },
          { title: "Daggers", ref: daggersRef },
          { title: "Swords", ref: swordsRef },
          { title: "Hammers-Maces", ref: hammersMacesRef },
          { title: "Other Weapons", ref: otherWeaponsRef },
          { title: "Ammunition", ref: ammunitionRef },
          { title: "Armor and Shields", ref: armorShieldsRef },
        ].map((cat) => (
          <Collapse.Panel header={cat.title} key={cat.title}>
            <CategoryCollapse
              title={cat.title}
              dataRef={cat.ref}
              gold={gold}
              setGold={setGold}
              equipment={equipment}
              setEquipment={setEquipment}
              race={race}
            />
          </Collapse.Panel>
        ))}
      </Collapse>
    </>
  );
}
