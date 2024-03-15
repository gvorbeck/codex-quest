import { Button, Flex, Form } from "antd";
import classNames from "classnames";
import React from "react";
import Cost from "./Cost/Cost";
import Purchased from "./Purchased/Purchased";
import Name from "./Name/Name";
import Category from "./Category/Category";
import Amount from "./Amount/Amount";
import Weight from "./Weight/Weight";
import Size from "./Size/Size";
import Damage from "./Damage/Damage";
import MissileAc from "./MissileAc/MissileAc";
import ArmorClass from "./ArmorClass/ArmorClass";
import AttackType from "./AttackType/AttackType";
import Range from "./Range/Range";
import Ammo from "./Ammo/Ammo";
import { EquipmentCategories, EquipmentItem } from "@/data/definitions";
import SubCategory from "./SubCategory/SubCategory";
import ArmorType from "./ArmorType/ArmorType";
import { CharacterDataContext } from "@/contexts/CharacterContext";

interface FormCustomEquipmentProps {}

type CategoryFieldMappings = {
  [key in EquipmentCategories]?: string[];
};

const categoryFieldMapping: CategoryFieldMappings = {
  [EquipmentCategories.AMMUNITION]: ["Damage"],
  [EquipmentCategories.ARMOR]: ["ArmorClass", "ArmorType"],
  [EquipmentCategories.AXES]: ["Size", "Damage", "AttackType", "Range"],
  [EquipmentCategories.BARDING]: ["AnimalWeight", "ArmorClass"],
  [EquipmentCategories.BOWS]: ["Size", "Ammo", "AttackType", "Range"],
  [EquipmentCategories.CHAINFLAIL]: ["Size", "Damage", "AttackType"],
  [EquipmentCategories.DAGGERS]: ["Size", "Damage", "AttackType", "Range"],
  [EquipmentCategories.GENERAL]: ["SubCategory"],
  [EquipmentCategories.HAMMERMACE]: ["Size", "Damage", "AttackType", "Range"],
  [EquipmentCategories.IMPROVISED]: ["Size", "Damage", "AttackType", "Range"],
  [EquipmentCategories.OTHERWEAPONS]: ["Size", "Damage", "AttackType", "Range"],
  [EquipmentCategories.SHIELDS]: [
    "ArmorClass",
    "MissileAc",
    "AttackType",
    "Range",
  ],
  [EquipmentCategories.SLINGHURLED]: ["Size", "Ammo", "AttackType", "Range"],
  [EquipmentCategories.SPEARSPOLES]: [
    "Size",
    "Damage",
    "TwoHandedDamage",
    "AttackType",
    "Range",
  ],
  [EquipmentCategories.SWORDS]: ["Size", "Damage", "AttackType"],
};

const onFinishFailed = (errorInfo: object) => {
  console.error("Failed:", errorInfo);
};

const FormCustomEquipment: React.FC<
  FormCustomEquipmentProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
  const { character, setCharacter } = React.useContext(CharacterDataContext);
  const [form] = Form.useForm();
  const [categorySelect, setCategorySelect] = React.useState<
    EquipmentCategories | ""
  >("");
  const [purchasedCheckbox, setPurchasedCheckbox] =
    React.useState<boolean>(false);
  const [missileAcInputNumber, setMissileAcInputNumber] =
    React.useState<number>(0);

  const [rangeArray, setRangeArray] = React.useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const [ammoSelect, setAmmoSelect] = React.useState<string | undefined>(
    undefined,
  );
  const [showRange, setShowRange] = React.useState<boolean>(false);
  const [attackTypeDisabled, setAttackTypeDisabled] =
    React.useState<boolean>(false);

  const customEquipmentClassNames = classNames(
    "flex",
    "flex-col",
    "gap-4",
    className,
  );

  const handleCategoryChange = (value: string) => {
    if (
      Object.values(EquipmentCategories).includes(value as EquipmentCategories)
    ) {
      setCategorySelect(value as EquipmentCategories);
    } else {
      // Handle the case where the value is not part of the EquipmentCategories,
      setCategorySelect("");
    }
  };

  const handlePurchasedChange = (checked: boolean) => {
    setPurchasedCheckbox(checked);
  };

  const handleMissileAcChange = (value: number) => {
    setMissileAcInputNumber(value);
  };

  const handleRangeChange = (value: [number, number, number]) => {
    setRangeArray(value);
  };

  const handleAmmoChange = (value: string) => {
    setAmmoSelect(value);
  };

  const onFinish = (values: object) => {
    setCharacter({
      ...character,
      equipment: [...character.equipment, values as EquipmentItem],
    });
    // setModalIsOpen(false);
  };

  const handleFormValuesChange = (value: object) => {
    if (Object.prototype.hasOwnProperty.call(value, "attack")) {
      if (
        form.getFieldValue("attack") === "missile" ||
        form.getFieldValue("attack") === "both"
      ) {
        setShowRange(true);
      } else {
        setShowRange(false);
      }
    }
  };

  const renderFieldsForCategory = () => {
    const fieldsToRender =
      categoryFieldMapping[categorySelect as EquipmentCategories] || [];
    return fieldsToRender.map((field: string, index) => {
      switch (field) {
        case "SubCategory":
          return <SubCategory key={index} />;
        case "Damage":
          return <Damage key={index} />;
        case "ArmorClass":
          return <ArmorClass key={index} />;
        case "ArmorType":
          return <ArmorType key={index} />;
        case "AttackType":
          return <AttackType key={index} disabled={attackTypeDisabled} />;
        case "Range":
          return (
            showRange && (
              <Range
                rangeArray={rangeArray}
                handleRangeChange={handleRangeChange}
                key={index}
              />
            )
          );
        case "Size":
          return <Size key={index} />;
        case "Ammo":
          return (
            <Ammo
              ammoSelect={ammoSelect}
              handleAmmoChange={handleAmmoChange}
              key={index}
            />
          );
        case "MissileAc":
          return (
            <MissileAc
              handleMissileAcChange={handleMissileAcChange}
              missileAcInputNumber={missileAcInputNumber}
              key={index}
            />
          );
        // ... other cases for different fields
        default:
          return null;
      }
    });
  };

  const showFieldCost = purchasedCheckbox;

  const costClassNames = classNames({ hidden: !showFieldCost });

  React.useEffect(() => {
    if (categorySelect === EquipmentCategories.BOWS) {
      form.setFieldsValue({ attack: "Missile" });
      setAttackTypeDisabled(true);
    } else {
      setAttackTypeDisabled(false);
    }
  }, [categorySelect, form]);

  React.useEffect(() => {
    if (!showFieldCost) {
      form.setFieldsValue({ costValue: 0 });
      form.setFieldsValue({ costCurrency: "gp" });
    }
  }, [showFieldCost, form]);

  return (
    <Form
      className={customEquipmentClassNames}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      form={form}
      initialValues={{
        weight: 0.0,
        amount: 1,
        costValue: 0,
        costCurrency: "gp",
      }}
      name="custom-equipment"
      onValuesChange={handleFormValuesChange}
    >
      <Name />
      <Category handleCategoryChange={handleCategoryChange} />
      <Flex gap={16} wrap="wrap">
        {renderFieldsForCategory()}
      </Flex>
      <Flex gap={16} wrap="wrap">
        <Weight />
        <Amount />
      </Flex>
      <Flex gap={16} wrap="wrap">
        <Purchased
          handlePurchasedChange={handlePurchasedChange}
          purchasedCheckbox={purchasedCheckbox}
        />
        <Cost className={costClassNames} />
      </Flex>
      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={!categorySelect}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormCustomEquipment;
