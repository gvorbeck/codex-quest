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
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

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

  const itemsRef = useRef<Record<string, Item[]>>({});
  const weaponsRef = useRef<Record<string, Weapon[]>>({});
  const armorShieldsRef = useRef<Record<string, ArmorShields[]>>({});
  const beastsRef = useRef<Record<string, Beast[]>>({});

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

  useEffect(() => {
    const fetchItems = Object.entries(itemsCollectionMap).map(
      async ([collectionName, setStateFunc]) => {
        const coll = collection(db, collectionName);
        const snapshot = await getDocs(coll);
        const dataArray = snapshot.docs.map((doc) => doc.data() as Item);
        setStateFunc(dataArray);
        itemsRef.current[collectionName] = dataArray;
      }
    );

    const fetchWeapons = Object.entries(weaponsCollectionMap).map(
      async ([collectionName, setStateFunc]) => {
        const coll = collection(db, collectionName);
        const snapshot = await getDocs(coll);
        const dataArray = snapshot.docs.map((doc) => doc.data() as Weapon);
        setStateFunc(dataArray);
        weaponsRef.current[collectionName] = dataArray;
      }
    );

    const fetchArmorShields = Object.entries(armorShieldsCollectionMap).map(
      async ([collectionName, setStateFunc]) => {
        const coll = collection(db, collectionName);
        const snapshot = await getDocs(coll);
        const dataArray = snapshot.docs.map(
          (doc) => doc.data() as ArmorShields
        );
        setStateFunc(dataArray);
        armorShieldsRef.current[collectionName] = dataArray;
      }
    );

    const fetchBeasts = Object.entries(beastsCollectionMap).map(
      async ([collectionName, setStateFunc]) => {
        const coll = collection(db, collectionName);
        const snapshot = await getDocs(coll);
        const dataArray = snapshot.docs.map((doc) => doc.data() as Beast);
        setStateFunc(dataArray);
        beastsRef.current[collectionName] = dataArray;
      }
    );

    Promise.all([
      ...fetchWeapons,
      ...fetchItems,
      ...fetchArmorShields,
      ...fetchBeasts,
    ])
      .then(() => setIsLoading(false))
      .catch((error) =>
        console.error("Error fetching data from collections", error)
      );

    console.log(
      weaponsRef.current,
      itemsRef.current,
      armorShieldsRef.current,
      beastsRef.current
    );

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
        <Title level={2}>Items</Title>
        <Collapse accordion defaultActiveKey={["1"]}>
          {Object.entries(itemsRef.current).map(([key, value]) => (
            <Panel
              header={key.charAt(0).toUpperCase() + key.slice(1)}
              key={key}
            >
              {value.map((item: Item) => {
                let weight;
                item.weight === 0
                  ? (weight = "**")
                  : item.weight === 0.1
                  ? (weight = "*")
                  : (weight = item.weight);
                return (
                  <Paragraph>
                    <Checkbox>
                      <Space direction="vertical">
                        <Text strong>{item.name}</Text>
                        <Text type="secondary">{`Cost: ${item.costValue} ${item.costCurrency} / Weight: ${weight}`}</Text>
                      </Space>
                    </Checkbox>
                  </Paragraph>
                );
              })}
            </Panel>
          ))}
        </Collapse>
        <Title level={2}>Weapons</Title>
        <Collapse accordion>
          {Object.entries(weaponsRef.current).map(([key, value]) => (
            <Panel
              header={key.charAt(0).toUpperCase() + key.slice(1)}
              key={key}
            >
              <Paragraph>
                {value.map((item: Weapon) => `${item.name}, `)}
              </Paragraph>
            </Panel>
          ))}
        </Collapse>
        <Title level={2}>Armor and Shields</Title>
        <Collapse accordion>
          {Object.entries(armorShieldsRef.current).map(([key, value]) => (
            <Panel
              header={key.charAt(0).toUpperCase() + key.slice(1)}
              key={key}
            >
              <Paragraph>
                {value.map((item: ArmorShields) => `${item.name}, `)}
              </Paragraph>
            </Panel>
          ))}
        </Collapse>
        <Title level={2}>Beasts of Burden</Title>
        <Collapse accordion>
          {Object.entries(beastsRef.current).map(([key, value]) => (
            <Panel
              header={key.charAt(0).toUpperCase() + key.slice(1)}
              key={key}
            >
              <Paragraph>
                {value.map((item: Beast) => `${item.name}, `)}
              </Paragraph>
            </Panel>
          ))}
        </Collapse>
      </div>
    </>
  );
}
