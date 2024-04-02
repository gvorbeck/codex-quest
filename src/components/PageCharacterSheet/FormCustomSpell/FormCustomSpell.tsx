import { CharacterDataContext } from "@/contexts/CharacterContext";
import { Spell } from "@/data/definitions";
import { Button, Form, Input } from "antd";
import classNames from "classnames";
import React from "react";

interface FormCustomSpellProps {
  handleResetFormDisplay: () => void;
}

const FormCustomSpell: React.FC<
  FormCustomSpellProps & React.ComponentPropsWithRef<"div">
> = ({ className, handleResetFormDisplay }) => {
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);
  const { character, setCharacter } = React.useContext(CharacterDataContext);

  const [submittable, setSubmittable] = React.useState(false);

  const customSpellClassNames = classNames("flex", "flex-col", className);
  const onFinish = (values: object) => {
    setCharacter({
      ...character,
      spells: [...character.spells, values as Spell],
    });
    handleResetFormDisplay();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]);

  return (
    <Form
      className={customSpellClassNames}
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

export default FormCustomSpell;
