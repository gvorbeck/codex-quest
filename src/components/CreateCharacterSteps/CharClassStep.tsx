import { Checkbox, Radio, Space, Switch } from "antd";
import type { RadioChangeEvent } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useEffect, useState } from "react";
import { CharClassStepProps, SpellType } from "../types";
import spellsData from "../../data/spells.json";

const classChoices = ["Cleric", "Fighter", "Magic-User", "Thief"];
const readMagic = spellsData.filter((spell) => spell.name === "Read Magic");

export default function CharClassStep({
  characterData,
  setCharacterData,
  comboClass,
  setComboClass,
  checkedClasses,
  setCheckedClasses,
}: CharClassStepProps) {
  const [firstSpell, setFirstSpell] = useState<SpellType | null>(null);

  useEffect(() => {
    if (comboClass) {
      setCharacterData({ ...characterData, class: checkedClasses.join(" ") });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedClasses, comboClass]);

  const onCheckboxChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setCheckedClasses([...checkedClasses, e.target.value]);
    } else {
      setCheckedClasses(
        checkedClasses.filter((item) => item !== e.target.value)
      );
    }
    setCharacterData({ ...characterData, hp: { dice: "", points: 0 } });
  };

  const onClassRadioChange = (e: RadioChangeEvent) => {
    const classValue = e.target.value;
    const spells = classValue === "Magic-User" ? readMagic : [];

    setCharacterData({
      ...characterData,
      class: classValue,
      hp: { dice: "", points: 0 },
      spells,
    });
  };

  const onSpellRadioChange = (e: RadioChangeEvent) => {
    const foundSpell = spellsData.find(
      (spell) => spell.name === e.target.value
    );
    if (foundSpell) {
      setFirstSpell(foundSpell);
      setCharacterData({
        ...characterData,
        spells: [...readMagic, foundSpell],
      });
    }
  };

  const onSwitchChange = (checked: boolean) => {
    if (checked !== comboClass) {
      // Only update the playerClass if the switch has actually been toggled
      // Clear whenever the switch is clicked
      setCheckedClasses([]);
      setCharacterData({
        ...characterData,
        class: "",
        hp: { dice: "", points: 0 },
      });
    }
    setComboClass(checked);
  };

  return (
    <>
      {characterData.race === "Elf" && (
        <div>
          <Switch
            checked={comboClass}
            onChange={onSwitchChange}
            unCheckedChildren="Single Class"
            checkedChildren="Combination Class"
          />
        </div>
      )}
      {comboClass ? (
        <Space direction="vertical">
          {classChoices.map((choice) => (
            <Checkbox
              key={choice}
              onChange={onCheckboxChange}
              value={choice}
              checked={checkedClasses.includes(choice)}
              disabled={
                choice === "Cleric" ||
                (choice === "Fighter" && checkedClasses.includes("Thief")) ||
                (choice === "Thief" && checkedClasses.includes("Fighter")) ||
                (choice === "Fighter" &&
                  +characterData.abilities.scores.strength < 9) ||
                (choice === "Magic-User" &&
                  +characterData.abilities.scores.intelligence < 9) ||
                (choice === "Thief" &&
                  +characterData.abilities.scores.dexterity < 9)
              }
            >
              {choice}
            </Checkbox>
          ))}
        </Space>
      ) : (
        <Radio.Group value={characterData.class} onChange={onClassRadioChange}>
          <Space direction="vertical">
            {classChoices.map((choice) => (
              <Radio
                key={choice}
                value={choice}
                disabled={
                  (characterData.race === "Dwarf" && choice === "Magic-User") ||
                  (characterData.race === "Halfling" &&
                    choice === "Magic-User") ||
                  (choice === "Cleric" &&
                    +characterData.abilities.scores.wisdom < 9) ||
                  (choice === "Fighter" &&
                    +characterData.abilities.scores.strength < 9) ||
                  (choice === "Magic-User" &&
                    +characterData.abilities.scores.intelligence < 9) ||
                  (choice === "Thief" &&
                    +characterData.abilities.scores.dexterity < 9)
                }
              >
                {choice}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      )}
      {characterData.class.includes("Magic-User") && (
        <Radio.Group
          onChange={onSpellRadioChange}
          value={firstSpell ? firstSpell.name : null}
        >
          <Space direction="vertical">
            {spellsData
              .filter(
                (spell) =>
                  spell.level["magic-user"] === 1 && spell.name !== "Read Magic"
              )
              .map((spell) => (
                <Radio key={spell.name} value={spell.name}>
                  {spell.name}
                </Radio>
              ))}
          </Space>
        </Radio.Group>
      )}
    </>
  );
}
