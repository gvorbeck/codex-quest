import { Auth, User } from "firebase/auth";

type HeaderProps = {
  user: User | null;
  handleLogin: () => Promise<void>;
  auth: Auth;
};

export default function Header(props: HeaderProps) {
  return (
    <header>
      {props.user ? (
        <div>
          <p>{props.user.displayName}</p>
          <button onClick={() => props.auth.signOut()}>Log out</button>
        </div>
      ) : (
        <button onClick={props.handleLogin}>Log in with Google</button>
      )}
    </header>
  );
}
