import React from "react";
import cantrips from "@/data/cantrips.json";
import { Card, Checkbox, Flex, Typography } from "antd";
import { ZeroLevelSpell } from "@/data/definitions";
import { CharacterDataContext } from "@/store/CharacterContext";
import { CheckboxChangeEvent } from "antd/es/checkbox";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CantripSelectionProps {}

const CantripSelection: React.FC<
  CantripSelectionProps & React.ComponentPropsWithRef<"div">
> = ({ className }) => {
  const { character, characterDispatch } =
    React.useContext(CharacterDataContext);

  const selectedCantrips: ZeroLevelSpell[] = character.cantrips ?? [];

  function handleCheckboxClick(
    change: CheckboxChangeEvent,
    cantrip: ZeroLevelSpell,
  ) {
    characterDispatch({
      type: "UPDATE",
      payload: {
        cantrips: change.target.checked
          ? [...selectedCantrips, cantrip]
          : selectedCantrips.filter((spell) => spell.name !== cantrip.name),
      },
    });
  }

  const cantripCards = cantrips.map((cantrip: ZeroLevelSpell) => {
    const checked = selectedCantrips.some(
      (spell) => spell.name === cantrip.name,
    );
    //character.class is a string array and cantrip.classes is a string array, only show cantrips that contains a class name that matches at least one of the classes in the character.class array
    if (
      cantrip.classes.some((spellClass) => character.class.includes(spellClass))
    ) {
      return (
        <Card
          key={cantrip.name}
          size="small"
          title={
            <Checkbox
              checked={checked}
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
  });

  return (
    <Flex vertical className={className} gap={16}>
      <Typography.Title level={5} className="mt-0">
        Cantrip/Osiron Selection
      </Typography.Title>
      {cantripCards}
    </Flex>
  );
};

export default CantripSelection;
