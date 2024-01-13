import { Button, Form, Input } from "antd";
import React from "react";

interface SignupFormProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SignupForm: React.FC<
  SignupFormProps & React.ComponentPropsWithRef<"div">
> = ({ email, setEmail, password, setPassword, onSubmit, className }) => {
  return (
    <Form
      name="signup"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ email, password }}
      onSubmitCapture={onSubmit}
      autoComplete="off"
      layout="vertical"
      className={className}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input
          id="email-address-input"
          name="email-address-input"
          type="email"
          value={email}
          required
          placeholder="Email address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password
          id="password-input"
          name="password-input"
          type="password"
          value={password}
          required
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Item>

      <Form.Item wrapperCol={{ span: 16 }}>
        <Button type="primary" htmlType="submit">
          Sign up
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignupForm;
