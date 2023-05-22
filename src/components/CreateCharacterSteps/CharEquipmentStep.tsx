import { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Button, Collapse, InputNumber, Space, Spin, Typography } from "antd";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

interface Item {
  costCurrency: string;
  costValue: number;
  name: string;
  weight: number;
}

interface Weapon extends Item {
  size?: string;
  damage?: string;
}

type CharEquipmentStepProps = {
  gold: number;
  equipment: {};
  setGold: (gold: number) => void;
  setEquipment: (equipment: {}) => void;
};

const { Panel } = Collapse;
const { Paragraph, Title } = Typography;

export default function CharEquipmentStep({
  gold,
  equipment,
  setGold,
  setEquipment,
}: CharEquipmentStepProps) {
  const [axes, setAxes] = useState<Weapon[]>([]);
  const [bows, setBows] = useState<Weapon[]>([]);
  const [daggers, setDaggers] = useState<Weapon[]>([]);
  const [swords, setSwords] = useState<Weapon[]>([]);
  const [hammersMaces, setHammersMaces] = useState<Weapon[]>([]);
  const [otherWeapons, setOtherWeapons] = useState<Weapon[]>([]);
  const [ammunition, setAmmunition] = useState<Weapon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const weaponsCollectionMap = {
    axes: setAxes,
    bows: setBows,
    daggers: setDaggers,
    swords: setSwords,
    hammersMaces: setHammersMaces,
    otherWeapons: setOtherWeapons,
    ammunition: setAmmunition,
  };

  const weaponsRef = useRef<Record<string, Weapon[]>>({});

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
    const fetchCollections = Object.entries(weaponsCollectionMap).map(
      async ([collectionName, setStateFunc]) => {
        const coll = collection(db, collectionName);
        const snapshot = await getDocs(coll);
        const dataArray = snapshot.docs.map((doc) => doc.data() as Weapon);
        setStateFunc(dataArray);
        weaponsRef.current[collectionName] = dataArray; // Adding data to weapons object
      }
    );

    Promise.all(fetchCollections)
      .then(() => setIsLoading(false))
      .catch((error) =>
        console.error("Error fetching data from collections", error)
      );

    console.log(weaponsRef.current);

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
      <Title level={2}>Weapons</Title>
      <Collapse accordion>
        {Object.entries(weaponsRef.current).map(([key, value]) => (
          <Panel header={key.charAt(0).toUpperCase() + key.slice(1)} key={key}>
            <Paragraph>bar</Paragraph>
          </Panel>
        ))}
      </Collapse>
    </>
  );
}
