import { CharData, Spell } from "@/data/definitions";
import { Button, Form, Input } from "antd";
import classNames from "classnames";
import React from "react";

interface ModalCustomSpellProps {
  character: CharData;
  setCharacter: (character: CharData) => void;
  setModalIsOpen: (modalIsOpen: boolean) => void;
}

const ModalCustomSpell: React.FC<
  ModalCustomSpellProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter, setModalIsOpen }) => {
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);
  const [submittable, setSubmittable] = React.useState(false);

  const customEquipmentClassNames = classNames(
    "flex",
    "flex-col",
    "gap-4",
    className,
  );
  const onFinish = (values: object) => {
    setCharacter({
      ...character,
      spells: [...character.spells, values as Spell],
    });
    setModalIsOpen(false);
  };

  const onFinishFailed = (errorInfo: object) => {
    console.error("Failed:", errorInfo);
  };

  React.useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      },
    );
  }, [formValues]);

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
    >
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Range" name="range" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Duration" name="duration" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true }]}
      >
        <Input.TextArea rows={10} maxLength={10000} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={!submittable}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ModalCustomSpell;
