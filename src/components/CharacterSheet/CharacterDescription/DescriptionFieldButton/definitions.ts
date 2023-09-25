import { ReactNode } from "react";

export type DescriptionFieldButtonProps = {
  handler: (event: React.MouseEvent<HTMLElement>) => void;
  icon: ReactNode;
};
