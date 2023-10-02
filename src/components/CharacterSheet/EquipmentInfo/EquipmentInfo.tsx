import { Button, Collapse, CollapseProps, Typography } from "antd";
import HelpTooltip from "../../HelpTooltip/HelpTooltip";
import { ExperimentOutlined, ToolOutlined } from "@ant-design/icons";
import { CharacterData } from "../../../data/definitions";

type EquipmentInfoProps = {
  userIsOwner: boolean;
  showAddEquipmentModal: () => void;
  showAddCustomEquipmentModal: () => void;
  characterData: CharacterData;
  collapseItems: CollapseProps["items"];
};

export default function EquipmentInfo({
  userIsOwner,
  showAddEquipmentModal,
  showAddCustomEquipmentModal,
  characterData,
  className,
  collapseItems,
}: EquipmentInfoProps & React.ComponentPropsWithRef<"div">) {
  return (
    <div className={className}>
      <div className="flex items-baseline gap-4">
        <Typography.Title level={3} className="mt-0 text-shipGray">
          Equipment
        </Typography.Title>
        <HelpTooltip text="Adding & removing equipment will automatically modify your gold balance." />
      </div>
      <div className="print:hidden flex flex-wrap gap-4">
        <Button
          type="primary"
          disabled={!userIsOwner}
          onClick={showAddEquipmentModal}
          icon={<ToolOutlined />}
        >
          Add/Edit Equipment
        </Button>
        <Button
          type="primary"
          disabled={!userIsOwner}
          onClick={showAddCustomEquipmentModal}
          icon={<ExperimentOutlined />}
        >
          Add Custom Equipment
        </Button>
      </div>
      <div className="hidden print:block">
        {characterData.equipment.map((item) => (
          <div key={item.name}>{item.name}</div>
        ))}
      </div>
      <Collapse
        items={collapseItems}
        className="bg-seaBuckthorn mt-4 print:hidden"
      />
    </div>
  );
}
