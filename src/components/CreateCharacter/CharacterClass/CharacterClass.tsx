import { useEffect, useState } from "react";
import { Switch } from "antd";
import { CharacterClassProps } from "./definitions";
import { getClassType } from "../../../support/helpers";
import { races } from "../../../data/races";
import { ClassNamesTwo, classes } from "../../../data/classes";
import SpellDescriptionModal from "./SpellDescriptionModal/SpellDescriptionModal";
import StartingSpells from "./StartingSpells/StartingSpells";
import CustomClassInput from "./CustomClassInput/CustomClassInput";
import CustomClassStartingSpells from "./CustomClassStartingSpells/CustomClassStartingSpells";
import ClassOptions from "./ClassOptions/ClassOptions";
import CombinationClassOptions from "./CombinationClassOptions/CombinationClassOptions";

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
  const [customClassInput, setCustomClassInput] = useState<string>("");
  const [showCustomClassInput, setShowCustomClassInput] =
    useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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

  const raceKey = characterData.race as keyof typeof races;
  const allowedCombinationClasses = races[raceKey]?.allowedCombinationClasses;

  return (
    <>
      {allowedCombinationClasses && allowedCombinationClasses.length > 1 && (
        <Switch
          checked={comboClass}
          onChange={onSwitchChange}
          unCheckedChildren="Single Class"
          checkedChildren="Combination Class"
        />
      )}
      <div className="mt-6">
        {/* COMBO CLASS */}
        {comboClass ? (
          <CombinationClassOptions
            characterData={characterData}
            setCharacterData={setCharacterData}
            checkedClasses={checkedClasses}
            setCheckedClasses={setCheckedClasses}
            raceKey={raceKey}
          />
        ) : (
          <ClassOptions
            characterData={characterData}
            setCharacterData={setCharacterData}
            customClassInput={customClassInput}
            setShowCustomClassInput={setShowCustomClassInput}
            setSelectedSpell={setSelectedSpell}
          />
        )}
        {showCustomClassInput && (
          <CustomClassInput
            characterData={characterData}
            customClassInput={customClassInput}
            setCharacterData={setCharacterData}
            setCustomClassInput={setCustomClassInput}
          />
        )}
        {!characterData.class
          .split(" ")
          .some((part) =>
            Object.values(ClassNamesTwo).includes(part as ClassNamesTwo)
          ) &&
          characterData.class !== "" && (
            <CustomClassStartingSpells
              characterData={characterData}
              setCharacterData={setCharacterData}
            />
          )}
        {characterData.class
          .split(" ")
          .some(
            (className) =>
              classes[className as ClassNamesTwo]?.spellBudget?.length
          ) && (
          <StartingSpells
            characterData={characterData}
            setCharacterData={setCharacterData}
            selectedSpell={selectedSpell}
            setSelectedSpell={setSelectedSpell}
            setModalName={setModalName}
            setModalDescription={setModalDescription}
            setIsModalOpen={setIsModalOpen}
          />
        )}
        <SpellDescriptionModal
          title={modalName || ""}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          description={modalDescription}
        />
      </div>
    </>
  );
}
