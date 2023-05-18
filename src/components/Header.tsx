import { Button, Space, Typography } from "antd";
import { Auth, User } from "firebase/auth";

const { Paragraph } = Typography;

type HeaderProps = {
  user: User | null;
  handleLogin: () => Promise<void>;
  auth: Auth;
};

export default function Header(props: HeaderProps) {
  return (
    <header>
      {props.user ? (
        <Space align="center">
          <Button type="primary" onClick={() => console.log("foop")}>
            Create
          </Button>
          <Paragraph>{props.user.displayName}</Paragraph>
          <Button type="link" onClick={() => props.auth.signOut()}>
            Log out
          </Button>
        </Space>
      ) : (
        <Button type="primary" onClick={props.handleLogin}>
          Log in with Google
        </Button>
      )}
    </header>
  );
}
