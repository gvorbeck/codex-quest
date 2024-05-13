import { Statistic } from "antd";
import React from "react";

interface CharacterStatProps {
  value: number | string;
  altValue?: number | string;
}

const CharacterStat: React.FC<
  CharacterStatProps & React.ComponentPropsWithRef<"div">
> = ({ className, value, altValue }) => {
  return (
    <Statistic
      className={"text-center font-bold leading-none " + className}
      value={value}
      suffix={altValue && <div className="text-base">/ {altValue}</div>}
    />
  );
};

export default CharacterStat;
