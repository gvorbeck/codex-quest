import { Radio, RadioChangeEvent, Space } from "antd";
import { classes } from "../../../../data/classes";
import { ClassOptionsProps } from "./definitions";
import DescriptionBubble from "../../DescriptionBubble/DescriptionBubble";
import { getClassType, getDisabledClasses } from "../../../../support/helpers";
import spellsData from "../../../../data/spells.json";
import { ClassNames, RaceNames, Spell } from "../../../../data/definitions";
import classNames from "classnames";

export default function ClassOptions({
  characterData,
  setCharacterData,
  customClassInput,
  setShowCustomClassInput,
  setSelectedSpell,
}: ClassOptionsProps) {
  const disabledClasses = getDisabledClasses(
    characterData.race as RaceNames,
    characterData.abilities
  );
  const baseClasses = [
    ClassNames.FIGHTER,
    ClassNames.CLERIC,
    ClassNames.THIEF,
    ClassNames.MAGICUSER,
  ];

  const onRadioButtonChange = (e: RadioChangeEvent) => {
    if (e.target.value === "Custom") {
      setShowCustomClassInput(true);
    } else {
      setShowCustomClassInput(false);
    }

    const classValue =
      e.target.value !== "Custom" ? e.target.value : customClassInput;
    setSelectedSpell(null);
    const spells: Spell[] = (classes[
      classValue as ClassNames
    ]?.startingSpells?.flatMap((spell) =>
      spellsData.find((s) => s.name === spell)
        ? [spellsData.find((s) => s.name === spell)]
        : []
    ) || []) as Spell[];

    setCharacterData({
      ...characterData,
      class: [classValue],
      hp: { dice: "", points: 0, max: 0, desc: "" },
      spells,
      equipment: [],
    });
  };
  return (
    <div className="grid gap-8 sm:grid-cols-[auto_auto] items-start">
      <Radio.Group
        value={
          characterData.class.length === 0
            ? null
            : Object.values(ClassNames).includes(
                characterData.class[0] as ClassNames
              )
            ? characterData.class[0]
            : "Custom"
        }
        onChange={onRadioButtonChange}
        buttonStyle="solid"
        className="block"
        size="small"
      >
        <Space direction="vertical">
          {Object.keys(classes)
            .sort((a, b) =>
              classes[a as keyof typeof classes].name >
              classes[b as keyof typeof classes].name
                ? 1
                : -1
            )
            .map((classKey) => {
              const choice = classes[classKey as keyof typeof classes];
              if (!choice) return null; // Skip rendering if choice is undefined
              const radioClassNames = classNames(
                "ps-2",
                "pe-2",
                "md:ps-4",
                "md:pe-4",
                "text-shipGray",
                { "font-bold": baseClasses.includes(choice.name as ClassNames) }
              );

              return (
                <Radio
                  key={choice.name}
                  value={choice.name}
                  className={radioClassNames}
                  disabled={disabledClasses.includes(choice.name as ClassNames)}
                >
                  {choice.name}
                </Radio>
              );
            })}
        </Space>
      </Radio.Group>
      {getClassType(characterData.class) !== "custom" &&
        getClassType(characterData.class) !== "none" && (
          <DescriptionBubble
            title={characterData.class[0]}
            description={
              classes[characterData.class[0] as ClassNames].details
                ?.description || ""
            }
          />
        )}
    </div>
  );
}
