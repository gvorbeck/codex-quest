import { Button, Input, Modal } from "antd";
import CloseIcon from "../components/CloseIcon/CloseIcon";
import {
  LoginFormProps,
  LoginSignupModalProps,
  SignupFormProps,
} from "./definitions";
import { useNavigate } from "react-router-dom";
import { FC, FormEvent, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import classNames from "classnames";

const formClassNames = classNames("my-4", "[&>div+div]:mt-4");

const LoginForm: FC<LoginFormProps> = ({ setEmail, setPassword, onLogin }) => {
  return (
    <div className={formClassNames}>
      <div>
        <label htmlFor="email-address">Email address</label>
        <Input
          id="email-address"
          name="email"
          type="email"
          required
          placeholder="Email address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <Input.Password
          id="password"
          name="password"
          type="password"
          required
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <Button type="primary" onClick={onLogin}>
          Log in
        </Button>
      </div>
    </div>
  );
};

const SignupForm: FC<SignupFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
}) => {
  return (
    <div className={formClassNames}>
      <div>
        <label htmlFor="email-address">Email address</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email address"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <Input.Password
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
        />
      </div>
      <div>
        <Button type="primary" onClick={onSubmit}>
          Sign up
        </Button>
      </div>
    </div>
  );
};

export default function LoginSignupModal({
  handleCancel,
  isLoginSignupModalOpen,
  handleLogin,
}: LoginSignupModalProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInForm, setSignInForm] = useState(true);

  const onLogin = (e: FormEvent) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate("/");
        console.log(user);
        handleCancel();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // Here, you can also show a message to the user about the failed login
        // but the modal will remain open
      });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        navigate("/");
        console.log(user);
        handleCancel();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
      });
  };
  return (
    <Modal
      title="Log in / Sign up"
      open={isLoginSignupModalOpen}
      onCancel={handleCancel}
      footer={false}
      width={600}
      closeIcon={<CloseIcon />}
    >
      {signInForm ? (
        <div>
          <Button type="primary" onClick={handleLogin}>
            Log in with Google
          </Button>
          <LoginForm
            setEmail={setEmail}
            setPassword={setPassword}
            onLogin={onLogin}
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
}
