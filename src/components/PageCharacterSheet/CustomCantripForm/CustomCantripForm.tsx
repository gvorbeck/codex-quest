import { CharacterDataContext } from "@/store/CharacterContext";
import { Button, Form, Input, message } from "antd";
import React, { useEffect } from "react";

interface CustomCantripFormProps {
  handleResetFormDisplay: () => void;
}

const CustomCantripForm: React.FC<
  CustomCantripFormProps & React.ComponentPropsWithRef<"div">
> = ({ className, handleResetFormDisplay }) => {
  const [form] = Form.useForm();
  const [, contextHolder] = message.useMessage();
  const { character, setCharacter } = React.useContext(CharacterDataContext);

  const onFinish = (values: {
    name: string;
    classes: string[];
    description: string;
  }) => {
    const cantrips = [...(character.cantrips ?? []), values];
    setCharacter({ ...character, cantrips });
    message.success(`${values.name} added`);
    handleResetFormDisplay();
    form.resetFields();
  };

  useEffect(() => {
    // This will set the `classes` field whenever `character.class` changes
    form.setFieldsValue({ classes: character.class });
  }, [character.class, form]);

  return (
    <>
      {contextHolder}
      <Form
        layout="vertical"
        onFinish={onFinish}
        form={form}
        name="custom-cantrip-form"
        className={className}
      >
        {/* Hidden Form.Item for classes */}
        <Form.Item name="classes" hidden>
          <Input hidden />
        </Form.Item>

        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={5} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default CustomCantripForm;
