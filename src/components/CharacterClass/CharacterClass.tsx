import { Checkbox, Input, Radio, Switch } from "antd";
import type { RadioChangeEvent } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { CharacterClassProps } from "./definitions";
import spellsData from "../../data/spells.json";
import { classDetails, classChoices } from "../../data/classDetails";
import HomebrewWarning from "../HomebrewWarning/HomebrewWarning";
import { Spell } from "../types";

const readMagic = spellsData.filter((spell) => spell.name === "Read Magic");

export default function CharacterClass({
  characterData,
  setCharacterData,
  comboClass,
  setComboClass,
  checkedClasses,
  setCheckedClasses,
  selectedSpell,
  setSelectedSpell,
}: CharacterClassProps) {
  const [customClassInput, setCustomClassInput] = useState("");
  const [showCustomClassInput, setShowCustomClassInput] = useState(false);

  useEffect(() => {
    // If the current class is not in the classChoices and it's not an empty string, it's a custom class
    if (
      !classChoices.includes(characterData.class) &&
      characterData.class !== ""
    ) {
      setShowCustomClassInput(true);
      setCustomClassInput(characterData.class);
    }
  }, []);

  useEffect(() => {
    if (comboClass) {
      const firstClass =
        checkedClasses[0]?.toLowerCase() as keyof typeof classDetails;
      const secondClass =
        checkedClasses[1]?.toLowerCase() as keyof typeof classDetails;
      const firstClassRestrictions = firstClass
        ? classDetails[firstClass].restrictions
        : [];
      const firstClassSpecials = firstClass
        ? classDetails[firstClass].specials
        : [];
      const secondClassRestrictions = secondClass
        ? classDetails[secondClass].restrictions
        : [];
      const secondClassSpecials = secondClass
        ? classDetails[secondClass].specials
        : [];

      setCharacterData({
        ...characterData,
        class: checkedClasses.join(" "),
        restrictions: {
          race: characterData.restrictions.race,
          class: [...firstClassRestrictions, ...secondClassRestrictions],
        },
        specials: {
          race: characterData.specials.race,
          class: [...firstClassSpecials, ...secondClassSpecials],
        },
      });
    }
  }, [checkedClasses, comboClass]);

  const onCheckboxChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setCheckedClasses([...checkedClasses, e.target.value]);
    } else {
      setCheckedClasses(
        checkedClasses.filter((item) => item !== e.target.value)
      );
    }
    setCharacterData({
      ...characterData,
      hp: { dice: "", points: 0, max: 0, desc: "" },
    });
  };

  const onClassRadioChange = (e: RadioChangeEvent) => {
    if (e.target.value === "Custom") setShowCustomClassInput(true);
    else setShowCustomClassInput(false);

    const classValue =
      e.target.value !== "Custom" ? e.target.value : customClassInput;
    setSelectedSpell(null);
    const spells = classValue === "Magic-User" ? readMagic : [];
    const thisClass = e.target.value
      .toString()
      .toLowerCase() as keyof typeof classDetails;

    setCharacterData({
      ...characterData,
      class: classValue,
      hp: { dice: "", points: 0, max: 0, desc: "" },
      spells,
      equipment: [],
      restrictions: {
        ...characterData.restrictions,
        class:
          e.target.value !== "Custom"
            ? [...classDetails[thisClass].restrictions]
            : [],
      },
      specials: {
        ...characterData.specials,
        class:
          e.target.value !== "Custom"
            ? [...classDetails[thisClass].specials]
            : [],
      },
    });
  };

  const onSpellRadioChange = (e: RadioChangeEvent) => {
    const foundSpell = spellsData.find(
      (spell) => spell.name === e.target.value
    );
    if (foundSpell) {
      setSelectedSpell(foundSpell);
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
      setCustomClassInput("");
      setShowCustomClassInput(false);
      setCheckedClasses([]);
      setCharacterData({
        ...characterData,
        class: "",
        hp: { dice: "", points: 0, max: 0, desc: "" },
      });
    }
    setComboClass(checked);
  };

  const handleChangeCustomClassInput = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setCustomClassInput(event.target.value);
    setCharacterData({ ...characterData, class: event.target.value });
  };

  const handleClickCustomClassInput = (event: MouseEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  };

  const handleCheckboxChange = (e: CheckboxChangeEvent, spell: Spell) => {
    if (e.target.checked) {
      setCharacterData({
        ...characterData,
        spells: [...characterData.spells, spell],
      });
    } else {
      setCharacterData({
        ...characterData,
        spells: characterData.spells.filter(
          (prevSpell) => prevSpell.name !== spell.name
        ),
      });
    }
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
      <div className="mt-6">
        {comboClass ? (
          <div>
            {classChoices.map(
              (choice) =>
                choice !== "Custom" && (
                  <Checkbox
                    key={choice}
                    onChange={onCheckboxChange}
                    value={choice}
                    checked={checkedClasses.includes(choice)}
                    disabled={
                      choice === "Cleric" ||
                      choice === "Assassin" ||
                      (choice === "Fighter" &&
                        checkedClasses.includes("Thief")) ||
                      (choice === "Thief" &&
                        checkedClasses.includes("Fighter")) ||
                      (choice === "Fighter" &&
                        +characterData.abilities.scores.strength < 9) ||
                      (choice === "Magic-User" &&
                        +characterData.abilities.scores.intelligence < 9) ||
                      (choice === "Thief" &&
                        +characterData.abilities.scores.dexterity < 9)
                      // (choice === "Assassin" &&
                      //   +characterData.abilities.scores.dexterity < 9 &&
                      //   +characterData.abilities.scores.intelligence < 9)
                    }
                  >
                    {choice}
                  </Checkbox>
                )
            )}
          </div>
        ) : (
          <Radio.Group
            value={characterData.class}
            onChange={onClassRadioChange}
            buttonStyle="solid"
            className="block"
          >
            {classChoices.map((choice) => (
              <Radio.Button
                key={choice}
                value={choice}
                className="ps-2 pe-2 md:ps-4 md:pe-4"
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
                    +characterData.abilities.scores.dexterity < 9) ||
                  (characterData.race !== "Human" && choice === "Assassin") ||
                  (choice === "Assassin" &&
                    (+characterData.abilities.scores.dexterity < 9 ||
                      +characterData.abilities.scores.intelligence < 9))
                }
              >
                {choice}
              </Radio.Button>
            ))}
          </Radio.Group>
        )}
        {showCustomClassInput && (
          <>
            <HomebrewWarning homebrew="Class" className="my-4" />
            <Input
              value={customClassInput}
              onChange={handleChangeCustomClassInput}
              placeholder="Custom Race"
              onClick={handleClickCustomClassInput}
            />
          </>
        )}
        {!classChoices.includes(characterData.class) &&
          characterData.class !== "" && (
            <div className="mt-4 flex flex-wrap [&_label]:flex-[1_1_calc(25%-8px)] gap-2">
              {spellsData.map((spell) => (
                <Checkbox
                  key={spell.name}
                  onChange={(e) => handleCheckboxChange(e, spell)}
                  checked={characterData.spells.some(
                    (prevSpell) => prevSpell.name === spell.name
                  )}
                >
                  {spell.name}
                </Checkbox>
              ))}
            </div>
          )}
        {characterData.class.includes("Magic-User") && (
          <div className="mt-4">
            <Radio.Group
              onChange={onSpellRadioChange}
              value={selectedSpell ? selectedSpell.name : null}
              className="flex flex-wrap gap-4 items-center"
            >
              {spellsData
                .filter(
                  (spell) =>
                    spell.level["magic-user"] === 1 &&
                    spell.name !== "Read Magic"
                )
                .map((spell) => (
                  <Radio
                    key={spell.name}
                    value={spell.name}
                    className="flex-[1_1_45%]"
                  >
                    {spell.name}
                  </Radio>
                ))}
            </Radio.Group>
          </div>
        )}
      </div>
    </>
  );
}
