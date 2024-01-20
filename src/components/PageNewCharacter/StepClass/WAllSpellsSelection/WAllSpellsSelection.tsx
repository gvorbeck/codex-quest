import React from "react";
import spells from "@/data/spells.json";
import { Checkbox, Divider, Typography } from "antd";
import classNames from "classnames";
import { useDeviceType } from "@/hooks/useDeviceType";
import { CharData, Spell } from "@/data/definitions";

interface WAllSpellsSelectionProps {
  character: CharData;
}

const WAllSpellsSelection: React.FC<
  WAllSpellsSelectionProps & React.ComponentPropsWithRef<"div">
> = ({ className, character }) => {
  const { isDesktop, isMobile, isTablet } = useDeviceType();
  const checkboxGroupClassNames = classNames(
    "grid",
    { "grid-cols-1": isMobile },
    { "grid-cols-3": isTablet },
    { "grid-cols-3": isDesktop },
    className,
  );
  const options = spells.map((spell) => ({
    label: spell.name,
    value: spell.name,
  }));
  const [startingSpells, setStartingSpells] = React.useState<Spell[]>(
    character.spells || [],
  );
  return (
    <>
      <Divider plain className="font-enchant text-2xl">
        Starting Spells
      </Divider>
      <Typography.Text>
        Choose the spells your custom class starts level 1 with, if any.
      </Typography.Text>
      <Checkbox.Group className={checkboxGroupClassNames} options={options} />
    </>
  );
};

export default WAllSpellsSelection;
