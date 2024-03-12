import React from "react";

interface CustomCantripFormProps {}

const CustomCantripForm: React.FC<
  CustomCantripFormProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
  return <div className={className}>CustomCantripForm</div>;
};

export default CustomCantripForm;
