import { Button, Form } from "antd";
import React from "react";

interface AttackFormProps {
  onFinish: (values: any) => void;
  submitDisabled?: boolean;
  name: string;
  initialValues?: any;
}

const AttackForm: React.FC<
  AttackFormProps & React.ComponentPropsWithRef<"div">
> = ({ className, onFinish, children, submitDisabled, name }) => {
  const [form] = Form.useForm();
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      form={form}
      initialValues={{}}
      name={name}
      className={className}
    >
      {children}
      <Form.Item className="mt-4">
        <Button type="primary" htmlType="submit" disabled={submitDisabled}>
          Attack
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AttackForm;
