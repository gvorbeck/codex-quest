import { Auth, User } from "firebase/auth";

export interface PageLayoutProps {
  user: User | null;
  handleLogin: () => Promise<void>;
  auth: Auth;
}
