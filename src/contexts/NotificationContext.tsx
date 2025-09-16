import type { NotificationSystem } from "@/types";
import { createContext } from "react";

const NotificationContext = createContext<NotificationSystem | null>(null);

export default NotificationContext;
