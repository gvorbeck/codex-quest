/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
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

interface CategoryCollapseProps {
  title: string;
  dataRef: React.MutableRefObject<Record<string, any[]>>;
}

const CategoryCollapse: React.FC<CategoryCollapseProps> = ({
  title,
  dataRef,
}) => (
  <>
    <Title level={2}>{title}</Title>
    <Collapse accordion>
      {Object.entries(dataRef.current).map(([key, value], index) => (
        <Panel header={key.charAt(0).toUpperCase() + key.slice(1)} key={index}>
          {value.map((item: any, index) => (
            <EquipmentItemSelector item={item} key={index} />
          ))}
        </Panel>
      ))}
    </Collapse>
  </>
);

interface EquipmentItemSelectorProps {
  item: Item | Beast | Weapon | ArmorShields;
}

const EquipmentItemSelector: React.FC<EquipmentItemSelectorProps> = ({
  item,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    setIsChecked(e.target.checked);
  };

  let weight;
  let weightElement = null;

  if ("weight" in item) {
    if (item.weight === 0) weight = "**";
    else if (item.weight === 0.1) weight = "*";
    else weight = item.weight;
    weightElement = <Text type="secondary">{`Weight: ${weight}`}</Text>;
  }

  return (
    <Paragraph>
      <Space direction="vertical">
        <Checkbox onChange={handleCheckboxChange}>
          <Space direction="vertical">
            <Text strong>{item.name}</Text>
            <Text type="secondary">{`Cost: ${item.costValue} ${item.costCurrency}`}</Text>
            {weightElement}
          </Space>
        </Checkbox>
        {isChecked && <InputNumber min={1} defaultValue={1} />}
      </Space>
    </Paragraph>
  );
};

interface Beast {
  costCurrency: string;
  costValue: number;
  name: string;
}

interface Item extends Beast {
  weight: number;
}

interface Weapon extends Item {
  size?: string;
  damage?: string;
}

interface ArmorShields extends Item {
  AC: number | string;
}

type CharEquipmentStepProps = {
  gold: number;
  equipment: {};
  setGold: (gold: number) => void;
  setEquipment: (equipment: {}) => void;
};

const { Panel } = Collapse;
const { Paragraph, Text, Title } = Typography;

export default function CharEquipmentStep({
  gold,
  equipment,
  setGold,
  setEquipment,
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
  const [beasts, setBeasts] = useState<Beast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const itemsCollectionMap = { items: setItems };
  const weaponsCollectionMap = {
    axes: setAxes,
    bows: setBows,
    daggers: setDaggers,
    swords: setSwords,
    "hammers-maces": setHammersMaces,
    "other-weapons": setOtherWeapons,
    ammunition: setAmmunition,
  };
  const armorShieldsCollectionMap = { "armor-and-shields": setArmorShields };
  const beastsCollectionMap = { "beasts-of-burden": setBeasts };
  const ammunitionCollectionMap = { ammunition: setAmmunition };

  const itemsRef = useRef<Record<string, Item[]>>({});
  const weaponsRef = useRef<Record<string, Weapon[]>>({});
  const armorShieldsRef = useRef<Record<string, ArmorShields[]>>({});
  const beastsRef = useRef<Record<string, Beast[]>>({});
  const ammunitionRef = useRef<Record<string, Weapon[]>>({});

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
    collectionsMap: Record<string, (data: any[]) => void>,
    dataRef: React.MutableRefObject<Record<string, any[]>>
  ) => {
    return Promise.all(
      Object.entries(collectionsMap).map(
        async ([collectionName, setStateFunc]) => {
          const coll = collection(db, collectionName);
          const snapshot = await getDocs(coll);
          const dataArray = snapshot.docs.map((doc) => doc.data());
          setStateFunc(dataArray);
          dataRef.current[collectionName] = dataArray;
        }
      )
    );
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchData(itemsCollectionMap, itemsRef),
          fetchData(weaponsCollectionMap, weaponsRef),
          fetchData(armorShieldsCollectionMap, armorShieldsRef),
          fetchData(beastsCollectionMap, beastsRef),
          fetchData(ammunitionCollectionMap, ammunitionRef),
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data from collections", error);
      }

      console.log(
        weaponsRef.current,
        itemsRef.current,
        armorShieldsRef.current,
        beastsRef.current,
        ammunitionRef.current
      );
    };

    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          onChange={updateStartingGold}
          onFocus={handleFocus}
          type="number"
          value={gold}
        />
        <Button
          type="primary"
          onClick={rollStartingGold}
        >{`Roll 3d6x10`}</Button>
      </Space.Compact>
      <Divider orientation="left">Equipment Lists</Divider>
      <div>
        <CategoryCollapse title="Items" dataRef={itemsRef} />
        <CategoryCollapse title="Weapons" dataRef={weaponsRef} />
        <CategoryCollapse title="Armor and Shields" dataRef={armorShieldsRef} />
        <CategoryCollapse title="Beasts of Burden" dataRef={beastsRef} />
        <CategoryCollapse title="Ammunition" dataRef={ammunitionRef} />
      </div>
    </>
  );
}
