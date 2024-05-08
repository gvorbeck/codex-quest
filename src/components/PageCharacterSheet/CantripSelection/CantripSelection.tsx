import React from "react";
import cantrips from "@/data/cantrips.json";
import { Card, Checkbox, Flex, Typography } from "antd";
import { ZeroLevelSpell } from "@/data/definitions";
import { CharacterDataContext } from "@/store/CharacterContext";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { classSplit } from "@/support/classSupport";

interface CantripSelectionProps {}

const CantripSelection: React.FC<
  CantripSelectionProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
  const { character, setCharacter } = React.useContext(CharacterDataContext);

  const characterClasses = classSplit(character.class);

  const [selectedCantrips, setSelectedCantrips] = React.useState<
    ZeroLevelSpell[]
  >(character.cantrips ?? []);

  const handleCheckboxClick = (
    change: CheckboxChangeEvent,
    cantrip: ZeroLevelSpell,
  ) => {
    setSelectedCantrips((prev) => {
      if (change.target.checked) {
        return [...prev, cantrip];
      }
      return prev.filter((spell) => spell.name !== cantrip.name);
    });
  };

  React.useEffect(() => {
    setCharacter({ ...character, cantrips: selectedCantrips });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCantrips]);

  return (
    <Flex vertical className={className} gap={16}>
      <Typography.Title level={5} className="mt-0">
        Cantrip/Osiron Selection
      </Typography.Title>
      {cantrips.map((cantrip: ZeroLevelSpell) => {
        //character.class is a string array and cantrip.classes is a string array, only show cantrips that contains a class name that matches at least one of the classes in the character.class array
        if (
          cantrip.classes.some((spellClass) =>
            characterClasses.includes(spellClass),
          )
        ) {
          return (
            <Card
              key={cantrip.name}
              size="small"
              title={
                <Checkbox
                  checked={selectedCantrips.some(
                    (spell) => spell.name === cantrip.name,
                  )}
                  onChange={(e) => handleCheckboxClick(e, cantrip)}
                >
                  <span>{cantrip.name}</span>
                </Checkbox>
              }
            >
              <Typography className="text-justify">
                {cantrip.description}
              </Typography>
            </Card>
          );
        }
      })}
    </Flex>
  );
};

export default CantripSelection;
