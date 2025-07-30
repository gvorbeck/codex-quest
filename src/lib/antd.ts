// Optimized Ant Design imports to reduce bundle size
// This file re-exports only the components we actually use

// Core layout components
export { Layout } from "antd/es/layout";
export { Flex } from "antd/es/flex";
export { Divider } from "antd/es/divider";

// Form components
export { Button } from "antd/es/button";
export { Input } from "antd/es/input";
export { InputNumber } from "antd/es/input-number";
export { Form } from "antd/es/form";
export { Select } from "antd/es/select";
export { Radio } from "antd/es/radio";
export { Checkbox } from "antd/es/checkbox";
export { Switch } from "antd/es/switch";
export { Upload } from "antd/es/upload";

// Display components
export { Card } from "antd/es/card";
export { Table } from "antd/es/table";
export { List } from "antd/es/list";
export { Descriptions } from "antd/es/descriptions";
export { Typography } from "antd/es/typography";
export { Image } from "antd/es/image";
export { Avatar } from "antd/es/avatar";
export { Collapse } from "antd/es/collapse";
export { Tabs } from "antd/es/tabs";
export { Steps } from "antd/es/steps";

// Feedback components
export { Modal } from "antd/es/modal";
export { Drawer } from "antd/es/drawer";
export { Alert } from "antd/es/alert";
export { Spin } from "antd/es/spin";
export { Skeleton } from "antd/es/skeleton";
export { Empty } from "antd/es/empty";
export { Tooltip } from "antd/es/tooltip";
export { Popconfirm } from "antd/es/popconfirm";
export { FloatButton } from "antd/es/float-button";
export { Breadcrumb } from "antd/es/breadcrumb";
export { message } from "antd/es/message";
export { notification } from "antd/es/notification";

// Navigation components
export { Space } from "antd/es/space";

// Types
export type {
  ButtonProps,
  InputProps,
  FormProps,
  SelectProps,
  RadioChangeEvent,
  CollapseProps,
  TabsProps,
  StepsProps,
  DescriptionsProps,
  TableProps,
  UploadFile,
  GetProp,
  InputRef,
} from "antd";

export type { RcFile } from "antd/es/upload";
export type { MessageInstance } from "antd/es/message/interface";
