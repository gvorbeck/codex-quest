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
  gold: number;
  setGold: (gold: number) => void;
}

const CategoryCollapse: React.FC<CategoryCollapseProps> = ({
  title,
  dataRef,
  gold,
  setGold,
}) => (
  <>
    <Typography.Title level={2}>{title}</Typography.Title>
    <Collapse accordion>
      {Object.entries(dataRef.current).map(([key, value], index) => (
        <Collapse.Panel
          header={key.charAt(0).toUpperCase() + key.slice(1)}
          key={index}
        >
          {value.map((item: any, index) => (
            <EquipmentItemSelector
              item={item}
              key={index}
              gold={gold}
              setGold={setGold}
            />
          ))}
        </Collapse.Panel>
      ))}
    </Collapse>
  </>
);

interface EquipmentItemSelectorProps {
  item: Item | Beast | Weapon | ArmorShields;
  gold: number;
  setGold: (value: number) => void;
}

const EquipmentItemSelector: React.FC<EquipmentItemSelectorProps> = ({
  item,
  gold,
  setGold,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const totalCost = item.costValue * quantity;
  const canAffordItem = totalCost <= gold;

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    setGold(gold + (checked ? -totalCost : totalCost));
    setIsChecked(checked);
  };

  const handleQuantityChange = (value: number | null) => {
    if (value !== null && value >= 1) {
      const difference = (value - quantity) * item.costValue;
      setQuantity(value);

      if (gold - difference >= 0) {
        setGold(gold + (isChecked ? -totalCost : totalCost));
      } else {
        setQuantity(quantity);
      }
    } else {
      setQuantity(0);
    }
  };

  let weightElement = null;

  if ("weight" in item) {
    let weight: string | number = item.weight;
    if (weight === 0) weight = "**";
    else if (weight === 0.1) weight = "*";
    weightElement = (
      <Typography.Text type="secondary">{`Weight: ${weight}`}</Typography.Text>
    );
  }

  return (
    <Typography.Paragraph>
      <Space direction="vertical">
        <Checkbox disabled={!canAffordItem} onChange={handleCheckboxChange}>
          <Space direction="vertical">
            <Typography.Text strong>{item.name}</Typography.Text>
            <Typography.Text type="secondary">{`Cost: ${item.costValue} ${item.costCurrency}`}</Typography.Text>
            {weightElement}
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
  setGold: (gold: number) => void;
  equipment: {};
  setEquipment: (equipment: {}) => void;
};

const { Title } = Typography;

export default function CharEquipmentStep({
  gold,
  setGold,
  equipment,
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
  const [isLoading, setIsLoading] = useState(true);

  const itemsRef = useRef<Record<string, Item[]>>({});
  const weaponsRef = useRef<Record<string, Weapon[]>>({});
  const armorShieldsRef = useRef<Record<string, ArmorShields[]>>({});
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
          fetchData("axes", setAxes, weaponsRef),
          fetchData("bows", setBows, weaponsRef),
          fetchData("daggers", setDaggers, weaponsRef),
          fetchData("swords", setSwords, weaponsRef),
          fetchData("hammers-maces", setHammersMaces, weaponsRef),
          fetchData("other-weapons", setOtherWeapons, weaponsRef),
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
      <div>
        {[
          { title: "Items", ref: itemsRef },
          { title: "Axes", ref: weaponsRef },
          { title: "Bows", ref: weaponsRef },
          { title: "Daggers", ref: weaponsRef },
          { title: "Swords", ref: weaponsRef },
          { title: "Hammers-Maces", ref: weaponsRef },
          { title: "Other Weapons", ref: weaponsRef },
          { title: "Ammunition", ref: ammunitionRef },
          { title: "Armor and Shields", ref: armorShieldsRef },
        ].map((cat) => (
          <CategoryCollapse
            title={cat.title}
            dataRef={cat.ref}
            gold={gold}
            setGold={setGold}
            key={cat.title}
          />
        ))}
      </div>
    </>
  );
}
