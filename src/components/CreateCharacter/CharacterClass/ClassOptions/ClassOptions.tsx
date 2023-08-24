import { Radio, RadioChangeEvent, Space } from "antd";
import { ClassNamesTwo, classes } from "../../../../data/classes";
import { ClassOptionsProps } from "./definitions";
import DescriptionBubble from "../../DescriptionBubble/DescriptionBubble";
import { getClassType, getDisabledClasses } from "../../../../support/helpers";
import { RaceNamesTwo } from "../../../../data/races";
import spellsData from "../../../../data/spells.json";
import { Spell } from "../../../definitions";

export default function ClassOptions({
  characterData,
  setCharacterData,
  customClassInput,
  setShowCustomClassInput,
  setSelectedSpell,
}: ClassOptionsProps) {
  const disabledClasses = getDisabledClasses(
    characterData.race as RaceNamesTwo,
    characterData.abilities
  );

  const onClassRadioChange = (e: RadioChangeEvent) => {
    if (e.target.value === "Custom") setShowCustomClassInput(true);
    else setShowCustomClassInput(false);

    const classValue =
      e.target.value !== "Custom" ? e.target.value : customClassInput;
    setSelectedSpell(null);
    const spells: Spell[] = (classes[
      classValue as ClassNamesTwo
    ]?.startingSpells?.flatMap((spell) =>
      spellsData.find((s) => s.name === spell)
        ? [spellsData.find((s) => s.name === spell)]
        : []
    ) || []) as Spell[];

    setCharacterData({
      ...characterData,
      class: classValue,
      hp: { dice: "", points: 0, max: 0, desc: "" },
      spells,
      equipment: [],
    });
  };
  return (
    <div className="grid gap-8 sm:grid-cols-[auto_auto] items-start">
      <Radio.Group
        value={characterData.class}
        onChange={onClassRadioChange}
        buttonStyle="solid"
        className="block"
        size="small"
      >
        <Space direction="vertical">
          {Object.keys(classes).map((classKey) => {
            const choice = classes[classKey as keyof typeof classes];
            if (!choice) return null; // Skip rendering if choice is undefined

            return (
              <Radio
                key={choice.name}
                value={choice.name}
                className="ps-2 pe-2 md:ps-4 md:pe-4 text-shipGray"
                disabled={disabledClasses.includes(
                  choice.name as ClassNamesTwo
                )}
              >
                {choice.name}
              </Radio>
            );
          })}
        </Space>
      </Radio.Group>
      {characterData.class &&
        Object.values(ClassNamesTwo).includes(
          characterData.class as ClassNamesTwo
        ) &&
        getClassType(characterData.class) !== "custom" && (
          <DescriptionBubble
            description={
              classes[characterData.class as ClassNamesTwo].details
                ?.description || ""
            }
          />
        )}
    </div>
  );
}
