import { Button, Modal } from "antd";
import { useLocation } from "wouter";
import React from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase";
import LoginForm from "./LoginForm/LoginForm";
import SignupForm from "./SignupForm/SignupForm";

interface ModalLoginSignupProps {
  handleCancel: () => void;
  isLoginSignupModalOpen: boolean;
  handleLogin: () => Promise<void>;
}

const ModalLoginSignup: React.FC<ModalLoginSignupProps> = ({
  handleCancel,
  isLoginSignupModalOpen,
  handleLogin,
}) => {
  const [, navigate] = useLocation();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [signInForm, setSignInForm] = React.useState<boolean>(true);
  const [errors, setErrors] = React.useState<string[]>([]);

  const onLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.info(user);
        navigate("/");
        handleCancel();
      })
      .catch((error) => {
        setErrors((prevErrors) => [
          ...prevErrors,
          `${error.code}: ${error.message}`,
        ]);
      });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.info(user);
        navigate("/");
        handleCancel();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
        setErrors;
      });
  };
  return (
    <Modal
      title="Log in / Sign up"
      open={isLoginSignupModalOpen}
      onCancel={handleCancel}
      footer={false}
      width={600}
    >
      {signInForm ? (
        <div>
          <Button
            type="primary"
            onClick={() => {
              handleLogin();
              handleCancel();
            }}
            className="mb-4"
          >
            Log in with Google
          </Button>
          <LoginForm
            email={email}
            setEmail={setEmail}
            setPassword={setPassword}
            onLogin={onLogin}
            errors={errors}
            handleCancel={handleCancel}
          />
          <Button type="default" onClick={() => setSignInForm(false)}>
            Go to Sign Up form
          </Button>
        </div>
      ) : (
        <div>
          <SignupForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            onSubmit={onSubmit}
          />
          <Button type="default" onClick={() => setSignInForm(true)}>
            Go to Log In form
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default ModalLoginSignup;
