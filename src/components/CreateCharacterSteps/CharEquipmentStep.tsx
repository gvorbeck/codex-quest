import React, { useEffect, useState } from "react";
import {
  CharEquipmentStepProps,
  EquipmentItem,
  EquipmentCheckboxProps,
} from "../types";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import {
  Button,
  Checkbox,
  Collapse,
  Divider,
  InputNumber,
  Radio,
  Space,
  Spin,
  Typography,
} from "antd";
import { toTitleCase } from "../formatters";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import calculateCarryingCapacity from "../calculateCarryingCapacity";

const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
  event.target.select();
};

const roller = new DiceRoller();

function EquipmentRadio({ item }: { item: EquipmentItem }) {
  return (
    <Radio value={item.name}>
      <Space direction="vertical">
        <Typography.Text strong>{item.name}</Typography.Text>
        <Typography.Text>{`Cost: ${item.costValue}${item.costCurrency}`}</Typography.Text>
        <Typography.Text>{`AC: ${item.AC}`}</Typography.Text>
        <Typography.Text>{`Weight: ${item.weight}`}</Typography.Text>
      </Space>
    </Radio>
  );
}

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
  const [equipmentItems, setEquipmentItems] = useState<EquipmentItem[]>([]);
  const [equipmentCategories, setEquipmentCategories] = useState<
    string[] | null
  >(null);
  const [armorSelection, setArmorSelection] = useState<EquipmentItem | null>(
    null
  );

  const weightRestrictions = calculateCarryingCapacity(strength, race);

  const rollStartingGold = () => {
    const result = roller.roll("3d6*10");
    if (!(result instanceof Array) && result.total !== null)
      updateStartingGold(result.total);
  };

  const getCategories = () => {
    let categoriesSet = new Set<string>();
    if (equipmentItems.length > 0) {
      equipmentItems.forEach((item) => categoriesSet.add(item.category));
    } else return null;
    return [...categoriesSet];
  };

  const updateStartingGold = (startingGold: number | null) =>
    startingGold !== null && setGold(startingGold);

  const updateArmorSelection = (itemName: string) => {
    const item = equipmentItems.find((item) => item.name === itemName);
    if (item) {
      const updatedEquipment = equipment.filter(
        (notArmor: EquipmentItem) => notArmor.category !== "armor-and-shields"
      );
      setEquipment([...updatedEquipment, item]);
      setArmorSelection(item);
    }
  };

  /**
   * Side-effect for when component mounts
   * Fetches "equipment" collection from Firestore and adds "amount" property to each element
   * Sets the equipmentItems state array
   */
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const coll = collection(db, "equipment");
        const snapshot = await getDocs(coll);
        const dataArray = snapshot.docs.map((doc) => ({
          ...(doc.data() as EquipmentItem),
          amount: 1,
        }));
        setEquipmentItems(dataArray);
      } catch (error) {
        console.error("Error fetching equipment: ", error);
      }
    };
    fetchEquipment();

    console.log(race, strength, weightRestrictions);
  }, []);

  /**
   * Side-effect for when equipmentItems are retrieved from Firestore.
   * Sets equipmentCategories state array
   * Sets armorSelection state object
   * Adds "No Armor" object to equipment state array
   */
  useEffect(() => {
    setEquipmentCategories(getCategories());
    const noArmorItem = equipmentItems.find(
      (noArmor: EquipmentItem) => noArmor.name === "No Armor"
    );

    if (noArmorItem) {
      setArmorSelection(noArmorItem);

      // Add the "No Armor" item to the equipment array if it doesn't exist yet
      if (!equipment.find((item) => item.name === noArmorItem.name)) {
        setEquipment([...equipment, noArmorItem]);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipmentItems]);

  useEffect(() => {
    console.log(equipment);
  }, [equipment]);

  const EquipmentCheckbox: React.FC<EquipmentCheckboxProps> = ({
    itemName,
  }) => {
    const item = equipmentItems.find((item) => item.name === itemName);

    if (!item) return null;

    const realCost =
      item.costCurrency === "gp"
        ? item.costValue
        : item.costCurrency === "sp"
        ? item.costValue / 10
        : item.costValue / 100;

    const updatedEquipmentSelections =
      (item: EquipmentItem) => (event: CheckboxChangeEvent) => {
        if (event.target.checked) {
          setEquipment([...equipment, item]);
          setGold(gold - realCost * item.amount);
        } else {
          setEquipment(
            [...equipment].filter(
              (equipmentItem) => equipmentItem.name !== item.name
            )
          );
          setGold(gold + realCost * item.amount);
          item.amount = 1;
        }
      };

    const handleAmountChange = (value: number | null) => {
      if (value !== null) {
        const prevAmount = item.amount;
        const delta = value - prevAmount; // calculate the change in amount
        setGold(gold - realCost * delta); // update the gold
        item.amount = value; // update the item amount
      }
    };

    const isChecked = equipment.some(
      (equipmentItem) => equipmentItem.name === item.name
    );

    return (
      <Space direction="vertical">
        <Checkbox
          onChange={updatedEquipmentSelections(item)}
          checked={isChecked}
          disabled={!isChecked && gold <= 0 && realCost >= gold}
        >
          <Space direction="vertical">
            <Typography.Text strong>{item.name}</Typography.Text>
            <Typography.Text>{`Cost: ${item.costValue}${item.costCurrency}`}</Typography.Text>
            {item.weight && (
              <Typography.Text>{`Weight: ${item.weight}`}</Typography.Text>
            )}
            {item.damage && (
              <Typography.Text>{`Damage: ${item.damage}`}</Typography.Text>
            )}
            {item.size && (
              <Typography.Text>{`Size: ${item.size}`}</Typography.Text>
            )}
          </Space>
        </Checkbox>
        {isChecked && (
          <InputNumber
            min={1}
            defaultValue={1}
            max={Math.floor(gold / realCost)}
            onChange={handleAmountChange}
            value={item.amount}
          />
        )}
      </Space>
    );
  };

  if (!equipmentCategories) return <Spin />;

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
          value={+gold.toFixed(2)}
        />
        <Button type="primary" onClick={rollStartingGold}>
          Roll 3d6x10
        </Button>
      </Space.Compact>
      <Divider orientation="left">Equipment Lists</Divider>
      <Collapse accordion>
        {equipmentCategories
          .sort((a, b) => a.localeCompare(b))
          .map((cat) => (
            <Collapse.Panel
              header={toTitleCase(cat.replaceAll("-", " "))}
              key={cat}
            >
              {cat !== "armor-and-shields" ? (
                <Space direction="vertical">
                  {equipmentItems
                    .filter((catItem) => catItem.category === cat)
                    .map((item) => (
                      <EquipmentCheckbox key={item.name} itemName={item.name} />
                    ))}
                </Space>
              ) : (
                <Radio.Group
                  value={armorSelection ? armorSelection.name : null}
                  onChange={(e) => updateArmorSelection(e.target.value)}
                >
                  <Space direction="vertical">
                    {equipmentItems
                      .filter((catItem) => catItem.category === cat)
                      .map((item) => (
                        <React.Fragment key={item.name}>
                          <EquipmentRadio item={item} />
                          <Divider />
                        </React.Fragment>
                      ))}
                  </Space>
                </Radio.Group>
              )}
            </Collapse.Panel>
          ))}
      </Collapse>
    </>
  );
}
// import React, { useEffect, useRef, useState } from "react";
// import {
//   Button,
//   Collapse,
//   Divider,
//   InputNumber,
//   Space,
//   Spin,
//   Typography,
// } from "antd";
// import { ArmorShields, CharEquipmentStepProps, Item, Weapon } from "../types";
// import CategoryCollapse from "./CategoryCollapse";
// import calculateCarryingCapacity from "../calculateCarryingCapacity";
// import { toTitleCase } from "../formatters";

// export default function CharEquipmentStep({
//   gold,
//   setGold,
//   equipment,
//   setEquipment,
//   race,
//   weight,
//   setWeight,
//   strength,
// }: CharEquipmentStepProps) {
//   const [items, setItems] = useState<Item[]>([]);
//   const [axes, setAxes] = useState<Weapon[]>([]);
//   const [bows, setBows] = useState<Weapon[]>([]);
//   const [daggers, setDaggers] = useState<Weapon[]>([]);
//   const [swords, setSwords] = useState<Weapon[]>([]);
//   const [hammersMaces, setHammersMaces] = useState<Weapon[]>([]);
//   const [otherWeapons, setOtherWeapons] = useState<Weapon[]>([]);
//   const [ammunition, setAmmunition] = useState<Weapon[]>([]);
//   const [armorShields, setArmorShields] = useState<ArmorShields[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const itemsRef = useRef<Record<string, Item[]>>({});
//   const axesRef = useRef<Record<string, Weapon[]>>({});
//   const bowsRef = useRef<Record<string, Weapon[]>>({});
//   const daggersRef = useRef<Record<string, Weapon[]>>({});
//   const swordsRef = useRef<Record<string, Weapon[]>>({});
//   const hammersMacesRef = useRef<Record<string, Weapon[]>>({});
//   const otherWeaponsRef = useRef<Record<string, Weapon[]>>({});
//   const ammunitionRef = useRef<Record<string, Weapon[]>>({});
//   const armorShieldsRef = useRef<Record<string, ArmorShields[]>>({});

//   const weightLevel = calculateCarryingCapacity(strength, race);

//   const roller = new DiceRoller();
//   const rollStartingGold = () => {
//     const result = roller.roll("3d6*10");
//     if (!(result instanceof Array) && result.total !== null)
//       updateStartingGold(result.total);
//   };
//   const updateStartingGold = (startingGold: number | null) =>
//     startingGold !== null && setGold(startingGold);

//   const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
//     event.target.select();
//   };

//   const fetchData = async (
//     collectionName: string,
//     setStateFunc: (data: any[]) => void,
//     dataRef: React.MutableRefObject<Record<string, any[]>>
//   ) => {
//     const coll = collection(db, collectionName);
//     const snapshot = await getDocs(coll);
//     const dataArray = snapshot.docs.map((doc) => ({
//       ...doc.data(),
//       category: collectionName,
//     }));
//     setStateFunc(dataArray);
//     dataRef.current[collectionName] = dataArray;
//   };

//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         await Promise.all([
//           fetchData("items", setItems, itemsRef),
//           fetchData("axes", setAxes, axesRef),
//           fetchData("bows", setBows, bowsRef),
//           fetchData("daggers", setDaggers, daggersRef),
//           fetchData("swords", setSwords, swordsRef),
//           fetchData("hammers-maces", setHammersMaces, hammersMacesRef),
//           fetchData("other-weapons", setOtherWeapons, otherWeaponsRef),
//           fetchData("ammunition", setAmmunition, ammunitionRef),
//           fetchData("armor-and-shields", setArmorShields, armorShieldsRef),
//         ]);
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching data from collections", error);
//       }

//       const noArmor = armorShieldsRef.current["armor-and-shields"].find(
//         (item: ArmorShields) => item.name === "No Armor"
//       );
//       if (noArmor) setEquipment([...equipment, { ...noArmor, quantity: 1 }]);
//     };
//     fetchAllData();
//   }, []);

//   const groupByCategory = (array: any[]) => {
//     return array.reduce((result: any, item: any) => {
//       (result[item.category] = result[item.category] || []).push(item);
//       return result;
//     }, {});
//   };
//   const equipmentByCategory = groupByCategory(equipment);

//   if (isLoading) {
//     return <Spin />;
//   }

//   return (
//     <>
//       <Space.Compact>
//         <InputNumber
//           max={180}
//           min={30}
//           defaultValue={0}
//           onChange={(value: number | null) => setGold(value || 0)}
//           onFocus={handleFocus}
//           type="number"
//           value={gold}
//         />
//         <Button type="primary" onClick={rollStartingGold}>
//           Roll 3d6x10
//         </Button>
//       </Space.Compact>
//       <Divider orientation="left">Equipment Lists</Divider>
//       <Collapse>
//         {[
//           { title: "Items", ref: itemsRef },
//           { title: "Axes", ref: axesRef },
//           { title: "Bows", ref: bowsRef },
//           { title: "Daggers", ref: daggersRef },
//           { title: "Swords", ref: swordsRef },
//           { title: "Hammers-Maces", ref: hammersMacesRef },
//           { title: "Other Weapons", ref: otherWeaponsRef },
//           { title: "Ammunition", ref: ammunitionRef },
//           { title: "Armor and Shields", ref: armorShieldsRef },
//         ].map((cat) => {
//           return (
//             <Collapse.Panel header={cat.title} key={cat.title}>
//               <CategoryCollapse
//                 title={cat.title}
//                 dataRef={cat.ref}
//                 gold={gold}
//                 setGold={setGold}
//                 equipment={equipment}
//                 setEquipment={setEquipment}
//                 race={race}
//                 weight={weight}
//                 setWeight={setWeight}
//                 strength={strength}
//                 radioGroup
//               />
//             </Collapse.Panel>
//           );
//         })}
//       </Collapse>
//       <div>
//         <Space>
//           <Typography.Title level={2}>Gold: {gold}</Typography.Title>
//           <Typography.Title level={2}>Weight: {weight}</Typography.Title>
//           {weight < weightLevel.light ? (
//             <Typography.Text type="success">Lightly Loaded</Typography.Text>
//           ) : weight < weightLevel.heavy ? (
//             <Typography.Text type="warning">Heavily Loaded</Typography.Text>
//           ) : (
//             <Typography.Text type="danger">At Capacity!</Typography.Text>
//           )}
//         </Space>
//         <Typography.Title level={3}>Purchased Equipment</Typography.Title>
//         {Object.keys(equipmentByCategory).map((category) => (
//           <div key={category}>
//             <Typography.Title level={4}>
//               {toTitleCase(category)}
//             </Typography.Title>
//             {equipmentByCategory[category].map((item: any) => (
//               <Typography.Paragraph key={item.name}>
//                 {item.name} x {item.quantity}
//               </Typography.Paragraph>
//             ))}
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }
