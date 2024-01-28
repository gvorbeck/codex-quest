import React from "react";
import spells from "@/data/spells.json";
import { Checkbox, Divider, Typography } from "antd";
import classNames from "classnames";
import { useDeviceType } from "@/hooks/useDeviceType";
import { CharData, Spell } from "@/data/definitions";

interface AllSpellsSelectionProps {
  character: CharData;
  setCharacter: (character: CharData) => void;
}

const AllSpellsSelection: React.FC<
  AllSpellsSelectionProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter }) => {
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
  const onChange = (checkedValues: string[]) => {
    const newStartingSpells = spells.filter((spell) =>
      checkedValues.includes(spell.name),
    );
    setStartingSpells(newStartingSpells);
  };

  React.useEffect(() => {
    setCharacter({ ...character, spells: startingSpells });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startingSpells]);
  return (
    <>
      <Divider plain className="font-enchant text-2xl">
        Starting Spells
      </Divider>
      <Typography.Text>
        Choose the spells your custom class starts level 1 with, if any.
      </Typography.Text>
      <Checkbox.Group
        className={checkboxGroupClassNames}
        options={options}
        onChange={onChange}
      />
    </>
  );
};

export default AllSpellsSelection;
