import { Loot } from "@/data/definitions";
import { useDeviceType } from "@/hooks/useDeviceType";
import {
  emptyLoot,
  generateGems,
  generateJewels,
  generateLoot,
  generateMagicItems,
} from "@/support/diceSupport";
import {
  Button,
  Descriptions,
  DescriptionsProps,
  Flex,
  Form,
  FormProps,
  InputNumber,
  Radio,
  RadioChangeEvent,
  Typography,
} from "antd";
import React from "react";
import TreasureForm from "../TreasureForm/TreasureForm";
import TreasureResults from "../TreasureResults/TreasureResults";

interface OptionProps {
  button?: boolean;
  value: number;
  title: string;
}

interface TreasureSectionProps {
  children: React.ReactNode;
  title: string;
}

type FieldType = {
  type: string | number | undefined;
  name: string;
};

const Option: React.FC<OptionProps> = ({ value, title }) => {
  const { isMobile } = useDeviceType();
  if (!isMobile) {
    return <Radio.Button value={value}>{title}</Radio.Button>;
  }
  return <Radio value={value}>{title}</Radio>;
};

// const TreasureForm: React.FC<TreasureFormProps> = ({ form, setResults }) => {
// function onFinish(values: FieldType): FormProps<FieldType>["onFinish"] {
//   let result = { ...emptyLoot };
//   if (
//     values.name === "unguarded-treasure" &&
//     values.type &&
//     typeof values.type === "number" &&
//     values.type > 0
//   ) {
//     result = generateLoot(values.type);
//   }
//   setResults(result);
//   console.log(result);
//   return;
// }
// if (form === 0) {
//   return <div>0</div>;
// }
// if (form === 1) {
//   return <div>1</div>;
// }
// if (form === 2) {
//   return (
//     <Form
//       name="unguarded-treasure"
//       initialValues={{ type: 1, name: "unguarded-treasure" }}
//       onFinish={onFinish}
//     >
//       <Form.Item name="name" hidden>
//         <input type="hidden" />
//       </Form.Item>
//       <Form.Item<FieldType> label="Level" name="type" valuePropName="value">
//         <InputNumber min={1} />
//       </Form.Item>
//       <Form.Item>
//         <Button type="primary" htmlType="submit">
//           Generate
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// }
// };

// const TreasureSection: React.FC<TreasureSectionProps> = ({
//   children,
//   title,
// }) => {
//   return (
//     <Flex vertical gap={8}>
//       <Typography.Title level={5}>{title}</Typography.Title>
//       {children}
//     </Flex>
//   );
// };

const TreasureGenerator: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  const [treasureType, setTreasureType] = React.useState<0 | 1 | 2>(0);
  const [results, setResults] = React.useState<Loot | undefined>(undefined);

  const { isMobile } = useDeviceType();

  function handleTreasureFormChange(e: RadioChangeEvent) {
    setTreasureType(e.target.value);
  }

  // const items: DescriptionsProps["items"] = [
  //   { key: "copper", label: "Copper", children: results?.copper },
  //   { key: "silver", label: "Silver", children: results?.silver },
  //   { key: "electrum", label: "Electrum", children: results?.electrum },
  //   { key: "gold", label: "Gold", children: results?.gold },
  //   { key: "platinum", label: "Platinum", children: results?.platinum },
  //   {
  //     key: "gems",
  //     label: "Gems",
  //     children: results?.gems ? `${results?.gems} kind(s)` : 0,
  //   },
  //   { key: "jewels", label: "Jewels", children: results?.jewels },
  //   { key: "magicItems", label: "Magic Items", children: results?.magicItems },
  // ];

  // const resultsData = results ? (
  //   <Descriptions items={items} bordered column={1} size="small" />
  // ) : null;

  // let gemResults;
  // if (results?.gems) gemResults = generateGems(results);
  // const gemsData = results?.gems ? (
  //   <TreasureSection title="Gems">
  //     {gemResults?.map((gem) => {
  //       const items: DescriptionsProps["items"] = [
  //         { key: "amount", label: "Amount", children: gem.amount },
  //         { key: "quality", label: "Quality", children: gem.quality },
  //         { key: "type", label: "Type", children: gem.type },
  //         { key: "value", label: "Value", children: gem.value },
  //       ];
  //       return <Descriptions items={items} bordered column={1} size="small" />;
  //     })}
  //   </TreasureSection>
  // ) : null;

  // let jewelsResults;
  // if (results?.jewels) jewelsResults = generateJewels(results);
  // const jewelsData = results?.jewels ? (
  //   <TreasureSection title="Jewels">
  //     {jewelsResults?.map((jewel: { type: string; value: number }) => {
  //       const items: DescriptionsProps["items"] = [
  //         { key: "type", label: "Type", children: jewel.type },
  //         { key: "value", label: "Value", children: jewel.value },
  //       ];
  //       return <Descriptions items={items} bordered column={1} size="small" />;
  //     })}
  //   </TreasureSection>
  // ) : null;

  // let magicItemResults;
  // if (results?.magicItems) magicItemResults = generateMagicItems();
  // console.log(magicItemResults);
  // const magicItemData = results?.magicItems ? (
  //   <TreasureSection title="Magic Items">magic</TreasureSection>
  // ) : null;

  console.log("results", results);

  return (
    <Flex className={className} vertical gap={16}>
      <Radio.Group
        value={treasureType}
        onChange={handleTreasureFormChange}
        buttonStyle="solid"
      >
        <Option value={0} title="Lair Treasure" />
        <Option value={1} title="Individual Treasures" />
        <Option value={2} title="Unguarded Treasure" />
      </Radio.Group>
      <Flex className="[&>*]:flex-1">
        <TreasureForm type={treasureType} setResults={setResults} />
        <TreasureResults results={results} />
      </Flex>
    </Flex>
  );
};

export default TreasureGenerator;
