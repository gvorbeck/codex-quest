import { Button, Modal } from "antd";
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

const LoginForm: FC<LoginFormProps> = ({ setEmail, setPassword, onLogin }) => {
  return (
    <div>
      <div>
        <label htmlFor="email-address">Email address</label>
        <input
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
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button onClick={onLogin}>Login</button>
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
    <div>
      <div>
        <label htmlFor="email-address">Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email address"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
        />
      </div>
      <button type="submit" onClick={onSubmit}>
        Sign up
      </button>
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
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        navigate("/login");
        // ...
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
          <Button type="link" onClick={() => setSignInForm(false)}>
            Sign up
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
          <Button type="link" onClick={() => setSignInForm(true)}>
            Sign in
          </Button>
        </div>
      )}
    </Modal>
  );
}
