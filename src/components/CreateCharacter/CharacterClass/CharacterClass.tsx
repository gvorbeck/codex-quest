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
import { Spell } from "../../definitions";
import spellsData from "../../../data/spells.json";
import { getClassType, getDisabledClasses } from "../../../support/helpers";
import HomebrewWarning from "../../HomebrewWarning/HomebrewWarning";
import DescriptionBubble from "../DescriptionBubble/DescriptionBubble";
import { marked } from "marked";
import { InfoCircleOutlined } from "@ant-design/icons";
import CloseIcon from "../../CloseIcon/CloseIcon";
import { RaceNamesTwo, races } from "../../../data/races";
import { ClassNamesTwo, classes } from "../../../data/classes";

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
      setCharacterData({
        ...characterData,
        class: checkedClasses.join(" "),
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

  const showModal = (name: string, text: string) => {
    setModalName(name);
    setModalDescription(text);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const raceKey = characterData.race as keyof typeof races;
  const allowedCombinationClasses = races[raceKey]?.allowedCombinationClasses;
  const disabledClasses = getDisabledClasses(
    characterData.race as RaceNamesTwo,
    characterData.abilities
  );

  return (
    <>
      {allowedCombinationClasses && allowedCombinationClasses.length > 1 && (
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
          <div className="grid gap-2 pl-4">
            {Object.values(classes).map(
              (choice) =>
                choice.name !== ClassNamesTwo.CUSTOM && (
                  <Checkbox
                    key={choice.name}
                    onChange={onCheckboxChange}
                    value={choice.name}
                    checked={checkedClasses.includes(choice.name)}
                    disabled={
                      !races[raceKey]?.allowedCombinationClasses?.find(
                        (comboClassName) => choice.name === comboClassName
                      )
                    }
                  >
                    {choice.name}
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
            Object.values(ClassNamesTwo).includes(part as ClassNamesTwo)
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
        {characterData.class
          .split(" ")
          .some(
            (className) =>
              classes[className as ClassNamesTwo]?.spellBudget?.length
          ) && (
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
