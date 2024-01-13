import { notification } from "antd";

export function useNotification() {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    title: string,
    description: string,
    duration: number = 0,
  ) => {
    api.open({
      message: title,
      description,
      duration,
    });
  };
  return { contextHolder, openNotification };
}
