import { Checkbox, Input, Radio, Space, Switch } from "antd";
import type { RadioChangeEvent } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { CharacterClassProps } from "./definitions";
import spellsData from "../../../data/spells.json";
import { classDetails, classChoices } from "../../../data/classDetails";
import HomebrewWarning from "../../HomebrewWarning/HomebrewWarning";
import { ClassNames, Spell } from "../../definitions";
import DOMPurify from "dompurify";

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
    const isCustomClass = characterData.class
      .split(" ")
      .some(
        (className) =>
          !Object.values(ClassNames).includes(className as ClassNames)
      );

    if (isCustomClass && characterData.class !== "") {
      setShowCustomClassInput(true);
      setCustomClassInput(characterData.class);
    } else {
      setShowCustomClassInput(false);
      setCustomClassInput("");
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
    const spells = classValue === ClassNames.MAGICUSER ? readMagic : [];
    const thisClass = e.target.value.toString() as keyof typeof classDetails;

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
    const cleanInput = DOMPurify.sanitize(event.target.value);
    setCustomClassInput(cleanInput);
    setCharacterData({ ...characterData, class: cleanInput });
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

  // Methods for disabling class choices
  const magicUserRaceRestriction = (choice: string) =>
    choice === ClassNames.MAGICUSER &&
    characterData.race !== "Elf" &&
    characterData.race !== "Human";
  const clericAbilityRestriction = (choice: string) =>
    choice === ClassNames.CLERIC && +characterData.abilities.scores.wisdom < 9;
  const fighterAbilityRestriction = (choice: string) =>
    choice === ClassNames.FIGHTER &&
    +characterData.abilities.scores.strength < 9;
  const magicUserAbilityRestriction = (choice: string) =>
    choice === ClassNames.MAGICUSER &&
    +characterData.abilities.scores.intelligence < 9;
  const thiefAbilityRestriction = (choice: string) =>
    choice === ClassNames.THIEF &&
    +characterData.abilities.scores.dexterity < 9;
  const assassinRaceRestriction = (choice: string) =>
    choice === ClassNames.ASSASSIN && characterData.race !== "Human";
  const assassinAbilityRestriction = (choice: string) =>
    choice === ClassNames.ASSASSIN &&
    (+characterData.abilities.scores.dexterity < 9 ||
      +characterData.abilities.scores.intelligence < 9);
  const barbarianAbilityRestriction = (choice: string) =>
    choice === ClassNames.BARBARIAN &&
    (+characterData.abilities.scores.strength < 9 ||
      +characterData.abilities.scores.dexterity < 9 ||
      +characterData.abilities.scores.constitution < 9);
  const barbarianRaceRestriction = (choice: string) =>
    choice === ClassNames.BARBARIAN &&
    characterData.race !== "Dwarf" &&
    characterData.race !== "Human";

  // Methods for disabling combo class choices
  const comboClassRestrictedClasses = (choice: string) =>
    choice === ClassNames.CLERIC ||
    choice === ClassNames.ASSASSIN ||
    choice === ClassNames.BARBARIAN;
  const comboClassThiefSelected = (choice: string) =>
    choice === ClassNames.FIGHTER && checkedClasses.includes(ClassNames.THIEF);
  const comboClassFighterSelected = (choice: string) =>
    choice === ClassNames.THIEF && checkedClasses.includes(ClassNames.FIGHTER);

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
        {/* COMBO CLASS */}
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
                      comboClassRestrictedClasses(choice) ||
                      comboClassThiefSelected(choice) ||
                      comboClassFighterSelected(choice) ||
                      fighterAbilityRestriction(choice) ||
                      magicUserAbilityRestriction(choice) ||
                      thiefAbilityRestriction(choice)
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
            size="small"
          >
            <Space direction="vertical">
              {classChoices.map((choice) => (
                <Radio
                  key={choice}
                  value={choice}
                  className="ps-2 pe-2 md:ps-4 md:pe-4"
                  disabled={
                    magicUserRaceRestriction(choice) ||
                    magicUserAbilityRestriction(choice) ||
                    clericAbilityRestriction(choice) ||
                    fighterAbilityRestriction(choice) ||
                    thiefAbilityRestriction(choice) ||
                    assassinRaceRestriction(choice) ||
                    assassinAbilityRestriction(choice) ||
                    barbarianRaceRestriction(choice) ||
                    barbarianAbilityRestriction(choice)
                  }
                >
                  {choice}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        )}
        {showCustomClassInput && (
          <>
            <HomebrewWarning homebrew="Class" className="my-4" />
            <Input
              value={customClassInput}
              onChange={handleChangeCustomClassInput}
              placeholder="Custom Class"
              onClick={handleClickCustomClassInput}
            />
          </>
        )}
        {!characterData.class
          .split(" ")
          .some((part) =>
            Object.values(ClassNames).includes(part as ClassNames)
          ) &&
          characterData.class !== "" && (
            <div className="mt-4 gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
        {characterData.class.includes(ClassNames.MAGICUSER) && (
          <div className="mt-4">
            <Radio.Group
              onChange={onSpellRadioChange}
              value={selectedSpell ? selectedSpell.name : null}
              className="flex flex-wrap gap-4 items-center"
            >
              {spellsData
                .filter(
                  (spell) =>
                    (spell.level as Record<string, number>)[
                      ClassNames.MAGICUSER.toLowerCase()
                    ] === 1 && spell.name !== "Read Magic"
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
