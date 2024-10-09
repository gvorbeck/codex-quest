import { Button, Flex, Form, Input } from "antd";
import classNames from "classnames";
import React from "react";
// import Cost from "./Cost/Cost";
// import Purchased from "./Purchased/Purchased";
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
import { CharacterDataContext } from "@/store/CharacterContext";
import Notes from "./Notes/Notes";
// import { getItemCost } from "@/support/equipmentSupport";

interface FormCustomEquipmentProps {
  handleResetFormDisplay: () => void;
  editItem?: EquipmentItem;
}

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
> = ({ className, handleResetFormDisplay, editItem }) => {
  const { character, characterDispatch } =
    React.useContext(CharacterDataContext);
  const [form] = Form.useForm();
  const [formValues, setFormValues] = React.useState<EquipmentItem>(
    editItem || {
      name: "",
      amount: 1,
      category: "",
      costCurrency: "gp",
      costValue: 0,
      missileAC: "0",
      range: undefined,
      ammo: undefined,
      notes: "",
    },
  );

  // Synchronize form values with editItem when it's available
  React.useEffect(() => {
    if (editItem) {
      form.setFieldsValue(editItem); // This will populate the form fields
      setFormValues(editItem); // Keep state in sync if needed elsewhere
    }
  }, [editItem, form]);

  React.useEffect(() => {
    console.log("formValues", formValues);
  }, [formValues]);
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
      setFormValues({ ...formValues, category: value as EquipmentCategories });
    } else {
      // Handle the case where the value is not part of the EquipmentCategories,
      setFormValues({ ...formValues, category: "" });
    }
  };

  const handleMissileAcChange = (value: number) => {
    setFormValues({ ...formValues, missileAC: value.toString() });
  };

  const handleRangeChange = (value: [number, number, number]) => {
    setFormValues({ ...formValues, range: value });
  };

  const handleAmmoChange = (value: string) => {
    setFormValues({ ...formValues, ammo: [value] });
  };

  const onFinish = (values: object) => {
    // const newGold = purchasedCheckbox
    //   ? getItemCost(values as EquipmentItem)
    //   : 0;
    characterDispatch({
      type: "UPDATE",
      payload: {
        equipment: [...character.equipment, values as EquipmentItem],
        // gold: parseFloat((character.gold - newGold).toFixed(2)),
      },
    });
    handleResetFormDisplay();
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
      categoryFieldMapping[formValues.category as EquipmentCategories] || [];
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
                rangeArray={
                  (formValues.range as [number, number, number]) ?? [0, 0, 0]
                }
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
              ammoSelect={formValues.ammo ? formValues.ammo[0] : undefined}
              handleAmmoChange={handleAmmoChange}
              key={index}
            />
          );
        case "MissileAc":
          return (
            <MissileAc
              handleMissileAcChange={handleMissileAcChange}
              missileAcInputNumber={
                formValues.missileAC ? +formValues.missileAC : 0
              }
              key={index}
            />
          );
        // ... other cases for different fields
        default:
          return null;
      }
    });
  };

  // const showFieldCost = purchasedCheckbox;

  // const costClassNames = classNames({ hidden: !showFieldCost });

  React.useEffect(() => {
    if (formValues.category === EquipmentCategories.BOWS) {
      form.setFieldsValue({ attack: "Missile" });
      form.setFieldsValue({ type: "missile" });
      setShowRange(true);
      setAttackTypeDisabled(true);
    } else {
      setAttackTypeDisabled(false);
    }
  }, [formValues, form]);

  // React.useEffect(() => {
  //   if (!showFieldCost) {
  //     form.setFieldsValue({ costValue: 0 });
  //     form.setFieldsValue({ costCurrency: "gp" });
  //   }
  // }, [showFieldCost, form]);

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
        notes: "",
        type: "",
      }}
      name="custom-equipment"
      onValuesChange={handleFormValuesChange}
    >
      <Form.Item name="type" hidden>
        <Input />
      </Form.Item>
      <Name />
      <Category handleCategoryChange={handleCategoryChange} />
      <Flex gap={16} wrap="wrap">
        {renderFieldsForCategory()}
      </Flex>
      <Flex gap={16} wrap="wrap">
        <Weight />
        <Amount />
      </Flex>
      <Notes />
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!formValues.category}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormCustomEquipment;
