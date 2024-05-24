import { useDeviceType } from "@/hooks/useDeviceType";
import { generateUnguardedTreasure } from "@/support/diceSupport";
import {
  Button,
  Flex,
  Form,
  FormProps,
  InputNumber,
  Radio,
  RadioChangeEvent,
} from "antd";
import React from "react";

interface TreasureGeneratorProps {}

interface OptionProps {
  button?: boolean;
  value: number;
  title: string;
}

interface TreasureFormProps {
  form: number;
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

const TreasureForm: React.FC<TreasureFormProps> = ({ form }) => {
  console.log("treasureForm");
  function onFinish(values: FieldType): FormProps<FieldType>["onFinish"] {
    let result;
    if (
      values.name === "unguarded-treasure" &&
      values.type &&
      typeof values.type === "number" &&
      values.type > 0
    ) {
      result = generateUnguardedTreasure(values.type);
    }
    console.log(result);
    return;
  }

  if (form === 0) {
    return <div>0</div>;
  }
  if (form === 1) {
    return <div>1</div>;
  }
  if (form === 2) {
    return (
      <Form
        name="unguarded-treasure"
        initialValues={{ type: 1, name: "unguarded-treasure" }}
        onFinish={onFinish}
      >
        <Form.Item name="name" hidden>
          <input type="hidden" />
        </Form.Item>
        <Form.Item<FieldType> label="Level" name="type" valuePropName="value">
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Generate
          </Button>
        </Form.Item>
      </Form>
    );
  }
};

const TreasureGenerator: React.FC<
  TreasureGeneratorProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
  const [treasureForm, setTreasureForm] = React.useState(0);
  const { isMobile } = useDeviceType();

  function handleTreasureFormChange(e: RadioChangeEvent) {
    setTreasureForm(e.target.value);
  }

  return (
    <Flex className={className} vertical gap={16}>
      <Radio.Group
        value={treasureForm}
        onChange={handleTreasureFormChange}
        buttonStyle="solid"
      >
        <Option value={0} title="Lair Treasure" />
        <Option value={1} title="Individual Treasures" />
        <Option value={2} title="Ungaurded Treasure" />
      </Radio.Group>
      <Flex vertical={isMobile} gap={16} className="[&>*]:flex-1">
        <TreasureForm form={treasureForm} />
        <div>results</div>
      </Flex>
    </Flex>
  );
};

export default TreasureGenerator;
