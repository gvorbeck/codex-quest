import { Checkbox, Form } from "antd";
import React from "react";

interface PurchasedProps {
  purchasedCheckbox: boolean;
  handlePurchasedChange: (checked: boolean) => void;
}

const Purchased: React.FC<
  PurchasedProps & React.ComponentPropsWithRef<"div">
> = ({ className, purchasedCheckbox, handlePurchasedChange }) => {
  return (
    <Form.Item label="Purchased?" className={className}>
      <Checkbox
        checked={purchasedCheckbox}
        onChange={(e) => handlePurchasedChange(e.target.checked)}
      />
    </Form.Item>
  );
};

export default Purchased;
