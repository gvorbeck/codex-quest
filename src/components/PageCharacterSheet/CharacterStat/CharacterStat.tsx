import { Statistic } from "antd";
import classNames from "classnames";
import React from "react";

interface CharacterStatProps {
  value: number | string;
  altValue?: number | string;
}

const CharacterStat: React.FC<
  CharacterStatProps & React.ComponentPropsWithRef<"div">
> = ({ className, value, altValue }) => {
  const characterStatClassNames = classNames(
    "text-center",
    "font-bold",
    "leading-none",
    className,
  );
  return (
    <Statistic
      className={characterStatClassNames}
      value={value}
      suffix={altValue && <div className="text-base">/ {altValue}</div>}
    />
  );
};

export default CharacterStat;
