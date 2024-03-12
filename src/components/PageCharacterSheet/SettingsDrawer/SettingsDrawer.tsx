import { ColorScheme } from "@/support/colorSupport";
import { Button, Divider, Drawer, Flex } from "antd";
import React from "react";

interface SettingsDrawerProps {
  onClose: () => void;
  open: boolean;
  isSpellCaster: boolean;
}

const SettingsDrawer: React.FC<
  SettingsDrawerProps & React.ComponentPropsWithRef<"div">
> = ({ className, onClose, open, isSpellCaster }) => {
  return (
    <Drawer
      title="Settings"
      onClose={onClose}
      open={open}
      styles={{ header: { background: ColorScheme.SEABUCKTHORN } }}
      className={className}
    >
      <Flex vertical gap={16}>
        <Divider className="font-enchant text-2xl">Equipment</Divider>
        <Button>Add/Edit Equipment</Button>
        <Button>Add Custom Equipment</Button>
        <Divider className="font-enchant text-2xl">Magic</Divider>
        {isSpellCaster && (
          <>
            <Button>Add/Edit Spells</Button>
            <Button>Add Custom Spell</Button>
          </>
        )}
        <Button>Add 0 Level Spells</Button>
      </Flex>
    </Drawer>
  );
};

export default SettingsDrawer;
