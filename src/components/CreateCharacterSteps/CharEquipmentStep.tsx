import React, { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Button,
  Collapse,
  Divider,
  InputNumber,
  Space,
  Spin,
  Typography,
} from "antd";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { ArmorShields, CharEquipmentStepProps, Item, Weapon } from "../types";
import CategoryCollapse from "./CategoryCollapse";
import calculateCarryingCapacity from "../calculateCarryingCapacity";
import { toTitleCase } from "../formatters";

export default function CharEquipmentStep({
  gold,
  setGold,
  equipment,
  setEquipment,
  race,
  weight,
  setWeight,
  strength,
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

  const weightLevel = calculateCarryingCapacity(strength, race);

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
    const dataArray = snapshot.docs.map((doc) => ({
      ...doc.data(),
      category: collectionName,
    }));
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

  const groupByCategory = (array: any[]) => {
    return array.reduce((result: any, item: any) => {
      (result[item.category] = result[item.category] || []).push(item);
      return result;
    }, {});
  };
  const equipmentByCategory = groupByCategory(equipment);

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
              weight={weight}
              setWeight={setWeight}
              strength={strength}
            />
          </Collapse.Panel>
        ))}
      </Collapse>
      <div>
        <Space>
          <Typography.Title level={2}>Gold: {gold}</Typography.Title>
          <Typography.Title level={2}>Weight: {weight}</Typography.Title>
          {weight < weightLevel.light ? (
            <Typography.Text type="success">Lightly Loaded</Typography.Text>
          ) : weight < weightLevel.heavy ? (
            <Typography.Text type="warning">Heavily Loaded</Typography.Text>
          ) : (
            <Typography.Text type="danger">At Capacity!</Typography.Text>
          )}
        </Space>
        <Typography.Title level={3}>Purchased Equipment</Typography.Title>
        {Object.keys(equipmentByCategory).map((category) => (
          <div key={category}>
            <Typography.Title level={4}>
              {toTitleCase(category)}
            </Typography.Title>
            {equipmentByCategory[category].map((item: any) => (
              <Typography.Paragraph>
                {item.name} x {item.quantity}
              </Typography.Paragraph>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
