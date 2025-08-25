import { createContext } from "react";
import type { NotificationSystem } from "@/hooks/useNotifications";

const NotificationContext = createContext<NotificationSystem | null>(null);

export default NotificationContext;
