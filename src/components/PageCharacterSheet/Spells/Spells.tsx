import { CharacterDataContext } from "@/contexts/CharacterContext";
import { Button, Collapse, CollapseProps, Flex } from "antd";
import React from "react";
import SpellDescriptions from "./SpellDescriptions/SpellDescriptions";
import ModalCustomSpell from "@/components/ModalCustomSpell/ModalCustomSpell";
import classNames from "classnames";
import { useDeviceType } from "@/hooks/useDeviceType";
import AllSpellsSelection from "@/components/PageNewCharacter/StepClass/AllSpellsSelection/AllSpellsSelection";

interface SpellsProps {
  setModalIsOpen: (modalIsOpen: boolean) => void;
  setModalTitle: (modalTitle: string) => void;
  setModalContent: (modalContent: React.ReactNode) => void;
}

const Spells: React.FC<SpellsProps & React.ComponentPropsWithRef<"div">> = ({
  className,
  setModalIsOpen,
  setModalTitle,
  setModalContent,
}) => {
  const { character, setCharacter, userIsOwner } =
    React.useContext(CharacterDataContext);
  const { isMobile } = useDeviceType();
  const items: CollapseProps["items"] = character?.spells
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((spell) => ({
      key: spell.name,
      label: spell.name,
      children: (
        <SpellDescriptions
          spell={spell}
          character={character}
          setCharacter={setCharacter}
        />
      ),
    }));
  const handleCustomSpellClick = () => {
    setModalIsOpen(true);
    setModalTitle("Add Custom Spell");
    setModalContent(
      <ModalCustomSpell
        character={character}
        setCharacter={setCharacter}
        setModalIsOpen={setModalIsOpen}
      />,
    );
  };
  const handleAddEditSpellClick = () => {
    setModalIsOpen(true);
    setModalTitle("Add/Edit Spells");
    setModalContent(
      <AllSpellsSelection
        character={character}
        setCharacter={setCharacter}
        hideStartingText
        className=""
      />,
    );
  };
  const addSpellClassNames = classNames({ "w-1/2": !isMobile }, "flex-grow");
  return (
    <Flex vertical gap={16}>
      <Flex gap={16} vertical={isMobile}>
        <Button
          disabled={!userIsOwner}
          onClick={handleAddEditSpellClick}
          className={addSpellClassNames}
        >
          Add/Edit Spells
        </Button>
        <Button
          disabled={!userIsOwner}
          onClick={handleCustomSpellClick}
          className={addSpellClassNames}
        >
          Add Custom Spell
        </Button>
      </Flex>
      <Collapse items={items} className={className} />
    </Flex>
  );
};

export default Spells;
