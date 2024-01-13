import { Radio, RadioChangeEvent, Typography } from "antd";
import React from "react";
import { EquipmentCategories } from "@/data/definitions";
import { slugToTitleCase } from "@/support/stringSupport";
import classNames from "classnames";

interface WearingRadioGroupProps {
  category: EquipmentCategories;
  value: string | undefined;
  onChangeWearing: (e: RadioChangeEvent) => void;
}

const WearingRadioGroup: React.FC<
  WearingRadioGroupProps & React.ComponentPropsWithRef<"div">
> = ({ className, children, category, value, onChangeWearing }) => {
  const radioGroupClassNames = classNames(
    "flex",
    "flex-col",
    "gap-4",
    className,
  );
  return (
    <>
      <Typography.Title level={5} className="leading-none m-0">
        Wearing:
      </Typography.Title>
      <Radio.Group
        size="small"
        className={radioGroupClassNames}
        value={value}
        onChange={onChangeWearing}
      >
        <Radio value="">
          <Typography.Text strong className="ml-6">
            {`No ${slugToTitleCase(category)}`}
          </Typography.Text>
        </Radio>
        {children}
      </Radio.Group>
    </>
  );
};

export default WearingRadioGroup;
