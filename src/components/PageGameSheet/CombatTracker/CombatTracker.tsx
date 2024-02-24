import { ColorScheme } from "@/support/colorSupport";
import {
  Drawer,
  Flex,
  List,
  Typography,
  Button,
  Tooltip,
  InputNumber,
} from "antd";
import classNames from "classnames";
import React from "react";
import Icon, {
  CustomIconComponentProps,
} from "@ant-design/icons/lib/components/Icon";

const PerspectiveDiceSvg = () => (
  <svg
    width={24}
    height={24}
    fill={ColorScheme.SHIPGRAY}
    opacity={0.75}
    viewBox="0 0 64 64"
  >
    <path d="M31.969 5.594c-.77 0-1.543.176-2.14.52L10.733 17.16c-1.195.692-1.195 1.785 0 2.477l19.094 11.047c1.195.691 3.086.691 4.285 0l19.094-11.047c1.195-.692 1.195-1.785 0-2.477L34.113 6.113c-.597-.343-1.37-.52-2.144-.52Zm.234 1.554c.996.028 1.942.274 2.649.692 1.535.93 1.523 2.418-.028 3.336-1.547.922-4.058.926-5.62.015-1.165-.691-1.497-1.734-.833-2.629.664-.894 2.188-1.457 3.832-1.414Zm7.305 4.403c1.601.011 3.039.594 3.64 1.476.606.883.258 1.895-.875 2.567-1.562.926-4.09.926-5.648 0-1.563-.926-1.563-2.426 0-3.352.762-.453 1.8-.703 2.883-.691Zm-22.203 4.37c1 .028 1.945.274 2.652.692 1.559.926 1.559 2.426 0 3.352-1.562.926-4.09.926-5.648 0-1.168-.692-1.496-1.735-.832-2.63.664-.894 2.183-1.456 3.828-1.413Zm29.738.032c1 .027 1.945.274 2.652.692 1.547.93 1.54 2.421-.015 3.347-1.555.922-4.075.926-5.637.004-1.164-.691-1.492-1.734-.828-2.629.664-.894 2.183-1.457 3.828-1.414Zm-22.379 4.402c1.606.016 3.04.598 3.645 1.48.601.88.257 1.892-.88 2.567-1.003.606-2.484.848-3.87.63-1.387-.22-2.473-.86-2.84-1.684-.367-.825.039-1.703 1.062-2.297.766-.453 1.805-.703 2.883-.696ZM9.457 21.73c-.719-.02-1.207.543-1.207 1.536v19.71c0 1.383.945 3.02 2.145 3.712l18.363 10.605c1.199.691 2.144.145 2.144-1.234V36.344c0-1.38-.945-3.02-2.144-3.711L10.395 22.027c-.336-.195-.657-.289-.938-.297Zm45.098 0c-.282.008-.598.106-.934.297L35.254 32.633c-1.195.691-2.14 2.332-2.14 3.71V56.06c0 1.379.945 1.925 2.14 1.234L53.62 46.688c1.195-.692 2.14-2.329 2.14-3.711V23.266c0-.993-.488-1.555-1.206-1.536Zm-43.39 2.743c.866-.063 1.944.554 2.815 1.62.875 1.063 1.41 2.407 1.41 3.524 0 1.121-.535 1.844-1.406 1.899-.87.058-1.945-.563-2.816-1.625-.867-1.059-1.406-2.403-1.402-3.52-.004-1.117.53-1.84 1.398-1.898Zm41.687 0c.867.058 1.402.78 1.398 1.898 0 1.727-1.262 3.848-2.813 4.746-1.55.895-2.812.227-2.812-1.5-.004-1.117.535-2.46 1.406-3.523.875-1.067 1.95-1.684 2.82-1.621Zm-20.649.289c.996.023 1.942.273 2.649.691 1.535.926 1.523 2.414-.028 3.336-1.547.918-4.058.926-5.62.016-1.165-.692-1.497-1.739-.833-2.633.664-.895 2.184-1.453 3.832-1.41Zm-7.043 7.793c.871-.063 1.95.558 2.82 1.62.875 1.063 1.41 2.407 1.41 3.528 0 1.117-.535 1.84-1.406 1.899-.87.054-1.945-.567-2.816-1.625-.871-1.063-1.406-2.407-1.402-3.524-.004-1.113.527-1.84 1.394-1.898Zm13.692 0c.867.058 1.402.785 1.398 1.898 0 1.727-1.262 3.852-2.813 4.746-1.55.895-2.812.227-2.812-1.496-.004-1.121.535-2.465 1.406-3.527.875-1.063 1.95-1.684 2.82-1.621ZM18.16 36.137c.871-.059 1.95.558 2.82 1.62.875 1.063 1.41 2.411 1.41 3.528-.003 1.723-1.261 2.395-2.812 1.496-1.555-.894-2.812-3.02-2.812-4.742-.004-1.117.527-1.84 1.394-1.902Zm-6.996 3.672c.867-.059 1.945.558 2.816 1.62.875 1.067 1.41 2.41 1.41 3.528 0 1.117-.535 1.844-1.406 1.898-.87.06-1.945-.562-2.816-1.625-.867-1.062-1.406-2.402-1.402-3.52-.004-1.116.53-1.839 1.398-1.901Zm41.688 0c.867.062 1.402.785 1.398 1.902 0 1.727-1.262 3.848-2.813 4.746-1.55.895-2.812.223-2.812-1.5-.004-1.117.535-2.46 1.406-3.527.875-1.063 1.95-1.68 2.82-1.621Zm-27.688 8.086c.867-.063 1.945.554 2.816 1.62.875 1.063 1.41 2.407 1.41 3.524 0 1.121-.535 1.844-1.406 1.898-.87.06-1.945-.562-2.816-1.624-.867-1.06-1.406-2.403-1.402-3.52-.004-1.117.53-1.84 1.398-1.898Zm13.688 0c.867.058 1.402.78 1.398 1.898 0 1.727-1.262 3.848-2.813 4.746-1.55.895-2.812.227-2.812-1.5-.004-1.117.535-2.46 1.406-3.523.875-1.067 1.95-1.684 2.82-1.621Zm0 0" />
  </svg>
);
const PerspectiveDiceIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={PerspectiveDiceSvg} {...props} />
);

interface CombatTrackerProps {
  combatTrackerExpanded: boolean;
  setCombatTrackerExpanded: (expanded: boolean) => void;
}

const CombatTracker: React.FC<
  CombatTrackerProps & React.ComponentPropsWithRef<"div">
> = ({ className, combatTrackerExpanded, setCombatTrackerExpanded }) => {
  const combatTrackerClassNames = classNames(className);
  const onClose = () => {
    setCombatTrackerExpanded(false);
  };
  const data = [
    { name: "Amanda", avatar: "foo" },
    { name: "George", avatar: "foo" },
    { name: "Goblin" },
  ];
  return (
    <Drawer
      className={combatTrackerClassNames}
      open={combatTrackerExpanded}
      onClose={onClose}
      title="Combat / Turn Tracker"
      styles={{ header: { background: ColorScheme.SEABUCKTHORN } }}
    >
      <List
        header={
          <Flex justify="space-between" gap={16} align="center">
            <Typography.Text>Combatants</Typography.Text>
            <Flex gap={16}>
              <Tooltip title="Roll Monster Initiative">
                <Button icon={<PerspectiveDiceIcon />} type="primary" />
              </Tooltip>
              <Tooltip title="Clear combatants">
                <Button></Button>
              </Tooltip>
            </Flex>
          </Flex>
        }
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Flex
              gap={16}
              align="center"
              justify="space-between"
              className="w-full"
            >
              <Flex gap={16} align="center">
                {item.avatar && (
                  <span className="rounded-full bg-rust w-8 h-8 block"></span>
                )}
                <Typography.Text>{item.name}</Typography.Text>
              </Flex>
              <Tooltip title="Initiative">
                <InputNumber
                  className="w-[60px] box-content"
                  min={0}
                  defaultValue={0}
                />
              </Tooltip>
            </Flex>
          </List.Item>
        )}
      ></List>
    </Drawer>
  );
};

export default CombatTracker;
