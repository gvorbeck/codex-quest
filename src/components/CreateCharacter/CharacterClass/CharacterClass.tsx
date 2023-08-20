import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  Radio,
  Space,
  Switch,
  Typography,
} from "antd";
import type { RadioChangeEvent } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import DOMPurify from "dompurify";
import { CharacterClassProps } from "./definitions";
import { ClassNames, RaceNames, Spell } from "../../definitions";
import spellsData from "../../../data/spells.json";
import { classDetails } from "../../../data/classDetails";
import { getClassType } from "../../../support/helpers";
import HomebrewWarning from "../../HomebrewWarning/HomebrewWarning";
import DescriptionBubble from "../DescriptionBubble/DescriptionBubble";
import { marked } from "marked";
import { InfoCircleOutlined } from "@ant-design/icons";
import CloseIcon from "../../CloseIcon/CloseIcon";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalName, setModalName] = useState<string | undefined>(undefined);
  const [modalDescription, setModalDescription] = useState<string>("");

  useEffect(() => {
    if (
      getClassType(characterData.class) === "custom" &&
      characterData.class !== ""
    ) {
      setShowCustomClassInput(true);
      setCustomClassInput(characterData.class);
    } else {
      setShowCustomClassInput(false);
      setCustomClassInput("");
    }
  }, []);

  useEffect(() => {
    if (comboClass) {
      const firstClass = checkedClasses[0] as keyof typeof classDetails;
      const secondClass = checkedClasses[1] as keyof typeof classDetails;
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
          e.target.value !== "Custom" && classDetails[thisClass]
            ? [...classDetails[thisClass]?.restrictions]
            : [],
      },
      specials: {
        ...characterData.specials,
        class:
          e.target.value !== "Custom" && classDetails[thisClass]
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
    characterData.race !== RaceNames.ELF &&
    characterData.race !== RaceNames.HUMAN;
  const clericAbilityRestriction = (choice: string) =>
    choice === ClassNames.CLERIC && +characterData.abilities.scores.wisdom < 9;
  const druidAbilityRestriction = (choice: string) =>
    choice === ClassNames.DRUID && +characterData.abilities.scores.wisdom < 9;
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
    choice === ClassNames.ASSASSIN && characterData.race !== RaceNames.HUMAN;
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
    characterData.race !== RaceNames.DWARF &&
    characterData.race !== RaceNames.HUMAN;
  const illusionistAbilityRestriction = (choice: string) =>
    choice === ClassNames.ILLUSIONIST &&
    +characterData.abilities.scores.intelligence < 13;
  const illusionistRaceRestriction = (choice: string) =>
    choice === ClassNames.ILLUSIONIST &&
    characterData.race !== RaceNames.ELF &&
    characterData.race !== RaceNames.HUMAN;

  // Methods for disabling combo class choices
  const comboClassRestrictedClasses = (choice: string) =>
    choice === ClassNames.ASSASSIN ||
    choice === ClassNames.BARBARIAN ||
    choice === ClassNames.CLERIC ||
    choice === ClassNames.ILLUSIONIST ||
    choice === ClassNames.DRUID;
  const comboClassThiefSelected = (choice: string) =>
    choice === ClassNames.FIGHTER && checkedClasses.includes(ClassNames.THIEF);
  const comboClassFighterSelected = (choice: string) =>
    choice === ClassNames.THIEF && checkedClasses.includes(ClassNames.FIGHTER);

  const showModal = (name: string, text: string) => {
    setModalName(name);
    setModalDescription(text);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {characterData.race === RaceNames.ELF && (
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
          <div className="grid gap-2">
            {Object.values(ClassNames).map(
              (choice) =>
                choice !== ClassNames.CUSTOM && (
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
          <div className="grid gap-8 sm:grid-cols-[auto_auto] items-start">
            <Radio.Group
              value={characterData.class}
              onChange={onClassRadioChange}
              buttonStyle="solid"
              className="block"
              size="small"
            >
              <Space direction="vertical">
                {Object.values(ClassNames).map((choice) => (
                  <Radio
                    key={choice}
                    value={choice}
                    className="ps-2 pe-2 md:ps-4 md:pe-4 text-shipGray"
                    disabled={
                      magicUserRaceRestriction(choice) ||
                      magicUserAbilityRestriction(choice) ||
                      clericAbilityRestriction(choice) ||
                      druidAbilityRestriction(choice) ||
                      fighterAbilityRestriction(choice) ||
                      thiefAbilityRestriction(choice) ||
                      assassinRaceRestriction(choice) ||
                      assassinAbilityRestriction(choice) ||
                      barbarianRaceRestriction(choice) ||
                      barbarianAbilityRestriction(choice) ||
                      illusionistAbilityRestriction(choice) ||
                      illusionistRaceRestriction(choice)
                    }
                  >
                    {choice}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
            {characterData.class &&
              Object.values(ClassNames).includes(
                characterData.class as ClassNames
              ) &&
              characterData.class !== ClassNames.CUSTOM && (
                <DescriptionBubble
                  description={classDetails[characterData.class].description}
                />
              )}
          </div>
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
            <>
              <Typography.Title level={4}>
                Choose your starting spells
              </Typography.Title>
              <div className="mt-4 gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {spellsData.map((spell) => (
                  <Checkbox
                    key={spell.name}
                    onChange={(e) => handleCheckboxChange(e, spell)}
                    checked={characterData.spells.some(
                      (prevSpell) => prevSpell.name === spell.name
                    )}
                    className="text-shipGray"
                  >
                    {spell.name}
                  </Checkbox>
                ))}
              </div>
            </>
          )}
        {(characterData.class.includes(ClassNames.MAGICUSER) ||
          characterData.class === ClassNames.ILLUSIONIST) && (
          <div className="mt-4">
            <Typography.Title level={4} className="text-shipGray">
              Choose your starting spell
            </Typography.Title>
            <Typography.Text type="secondary" className="mb-4 block">
              {characterData.class}s begin with <strong>Read Magic</strong> and
              can choose a second spell to start.
            </Typography.Text>
            <Radio.Group
              onChange={onSpellRadioChange}
              value={selectedSpell ? selectedSpell.name : null}
              className="mt-4 gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {spellsData
                .filter((spell) => {
                  const characterClasses = characterData.class
                    .toLowerCase()
                    .split(" ");
                  return (
                    characterClasses.some(
                      (characterClass) =>
                        (spell.level as Record<string, number | null>)[
                          characterClass
                        ] === 1
                    ) && spell.name !== "Read Magic"
                  );
                })
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((spell) => {
                  const description = marked(spell.description);
                  return (
                    <Radio
                      key={spell.name}
                      value={spell.name}
                      className="flex-[1_1_45%] text-shipGray"
                    >
                      {spell.name}
                      <Button
                        type="ghost"
                        shape="circle"
                        size="small"
                        icon={<InfoCircleOutlined />}
                        onClick={() => showModal(spell.name, description)}
                        aria-label={`${spell.name} description`}
                        title={`${spell.name} description`}
                      />
                    </Radio>
                  );
                })}
            </Radio.Group>
          </div>
        )}
        <Modal
          title={modalName}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={[]}
          closeIcon={<CloseIcon />}
        >
          <div dangerouslySetInnerHTML={{ __html: modalDescription }} />
        </Modal>
      </div>
    </>
  );
}
