import { Button, Checkbox, Form, Input, message } from "antd";
import React from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

interface LoginFormProps {
  setEmail: (email: string) => void;
  email: string;
  setPassword: (password: string) => void;
  onLogin: (e: React.FormEvent) => void;
  errors: string[];
  handleCancel: () => void;
}

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

const LoginForm: React.FC<
  LoginFormProps & React.ComponentPropsWithRef<"div">
> = ({
  email,
  setEmail,
  setPassword,
  onLogin,
  errors,
  handleCancel,
  className,
}) => {
  const auth = getAuth();

  const onFinishFailed = (errorInfo: unknown) => {
    console.error("Failed:", errorInfo);
  };

  const onFinish = (e: React.FormEvent<HTMLElement>) => {
    handleCancel();
    onLogin(e);
  };

  const handleForgotPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        message.success("Password reset email sent!");
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      layout="vertical"
      className={className}
    >
      <Form.Item<FieldType>
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input
          id="email-address-input"
          name="email-address-input"
          type="email"
          required
          placeholder="Email address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password
          id="password-input"
          name="password-input"
          type="password"
          required
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Item>

      <Form.Item<FieldType>
        name="remember"
        valuePropName="checked"
        wrapperCol={{ span: 16 }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      {errors.length > 0 &&
        errors.map((error) => (
          <div key={error} className="text-pomegranite">
            {error}
          </div>
        ))}

      <Form.Item wrapperCol={{ span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <a onClick={handleForgotPassword} style={{ marginLeft: 10 }}>
          Forgot password?
        </a>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
