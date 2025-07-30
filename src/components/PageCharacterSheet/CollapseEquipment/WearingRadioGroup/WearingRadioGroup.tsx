import { Alert, Radio, RadioChangeEvent, Typography } from "antd";
import React from "react";
import { EquipmentCategories } from "@/data/definitions";
import { slugToTitleCase } from "@/support/stringSupport";
import { clsx } from "clsx";

interface WearingRadioGroupProps {
  category: EquipmentCategories;
  value: string | undefined;
  onChangeWearing: (e: RadioChangeEvent) => void;
}

const WearingRadioGroup: React.FC<
  WearingRadioGroupProps & React.ComponentPropsWithRef<"div">
> = ({ className, children, category, value, onChangeWearing }) => {
  const radioGroupClassNames = clsx("flex", "flex-col", "gap-4", className);

  // DELETE THIS ALL AFTER JULY '24
  // Define the start date and calculate the end date (30 days from the start date)
  const startDate = new Date("2024-06-18"); // Replace with your actual start date
  const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  const currentDate = new Date();

  // Check if the current date is within the 30-day period
  const showAlert = currentDate >= startDate && currentDate <= endDate;
  // DELETE ABOVE AFTER JULY '24
  return (
    <>
      {/* only show for next 30 days */}
      {category === "armor" && showAlert && (
        <Alert
          message="I have changed how armor affects movement. You may need to recreate your custom armor to work properly. Sorry."
          type="info"
          closable
        />
      )}
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
