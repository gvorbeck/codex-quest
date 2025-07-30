// Optimized Ant Design imports to reduce bundle size
// This file re-exports only the components we actually use

// Core layout components
import Layout from "antd/es/layout";
import Flex from "antd/es/flex";
import Divider from "antd/es/divider";
import Row from "antd/es/row";
import Col from "antd/es/col";

// Form components
import Button from "antd/es/button";
import Input from "antd/es/input";
import InputNumber from "antd/es/input-number";
import Form from "antd/es/form";
import Select from "antd/es/select";
import Radio from "antd/es/radio";
import Checkbox from "antd/es/checkbox";
import Switch from "antd/es/switch";
import Upload from "antd/es/upload";

// Display components
import Card from "antd/es/card";
import Table from "antd/es/table";
import List from "antd/es/list";
import Descriptions from "antd/es/descriptions";
import Typography from "antd/es/typography";
import Image from "antd/es/image";
import Avatar from "antd/es/avatar";
import Badge from "antd/es/badge";
import Collapse from "antd/es/collapse";
import Tabs from "antd/es/tabs";
import Steps from "antd/es/steps";
import Tag from "antd/es/tag";
import Statistic from "antd/es/statistic";

// Feedback components
import Modal from "antd/es/modal";
import Drawer from "antd/es/drawer";
import Alert from "antd/es/alert";
import Spin from "antd/es/spin";
import Skeleton from "antd/es/skeleton";
import Empty from "antd/es/empty";
import Tooltip from "antd/es/tooltip";
import Popconfirm from "antd/es/popconfirm";
import FloatButton from "antd/es/float-button";
import Breadcrumb from "antd/es/breadcrumb";
import message from "antd/es/message";
import notification from "antd/es/notification";
import ConfigProvider from "antd/es/config-provider";

// Theme
import { theme } from "antd";

// Navigation components
import Space from "antd/es/space";

// Export all components
export {
  // Layout
  Layout,
  Flex,
  Divider,
  Row,
  Col,

  // Form
  Button,
  Input,
  InputNumber,
  Form,
  Select,
  Radio,
  Checkbox,
  Switch,
  Upload,

  // Display
  Card,
  Table,
  List,
  Descriptions,
  Typography,
  Image,
  Avatar,
  Badge,
  Collapse,
  Tabs,
  Steps,
  Tag,
  Statistic,

  // Feedback
  Modal,
  Drawer,
  Alert,
  Spin,
  Skeleton,
  Empty,
  Tooltip,
  Popconfirm,
  FloatButton,
  Breadcrumb,
  message,
  notification,
  ConfigProvider,

  // Theme
  theme,

  // Navigation
  Space,
};

// Re-export types directly from antd to avoid circular imports
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
  BreadcrumbProps,
} from "antd";
export type { RcFile } from "antd/es/upload";
export type { MessageInstance } from "antd/es/message/interface";
