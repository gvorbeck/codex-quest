import { useEffect, useState } from "react";
import { Button, Modal, Steps, Typography } from "antd";
import CharAbilityScoreStep from "./CreateCharacterSteps/CharAbilityScoreStep";
import CharRaceStep from "./CreateCharacterSteps/CharRaceStep";
import CharClassStep from "./CreateCharacterSteps/CharClassStep";

const characterData = {
  abilities: {
    strength: 0,
    intelligence: 0,
    wisdom: 0,
    dexterity: 0,
    constitution: 0,
    charisma: 0,
  },
  abilityModifiers: {
    strength: "-",
    intelligence: "-",
    wisdom: "-",
    dexterity: "-",
    constitution: "-",
    charisma: "-",
  },
  race: "",
  class: "",
};

const { Title, Paragraph } = Typography;

const abilityDescription =
  "Roll for your character's Abilities. You can click the Roll button or use your own dice and record your scores below. Each character will have a score ranging from 3 to 18 in each of the Abilities below. A bonus or penalty Modifier is associated with each score as well. Each Class has a Prime Requisite Ability Score, which must be at least 9 in order for the character to become a member of that Class; also, there are required minimum and maximum scores for each character Race other than Humans.";

const raceDescription =
  "Choose your character's Race. Some options may be unavailable due to your character's Ability Scores. Each Race except Humans has minimum and maximum values for certain Abilities that your character's Ability Scores may not match. A full description of these Race-specific requirements can be found in your copy of the BFRPG rules. Additionally, each Race has specific restrictions, special abilities, and Saving Throws. Choose wisely.";

type CreateCharacterModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

export default function CreateCharacterModal(props: CreateCharacterModalProps) {
  const [current, setCurrent] = useState(0);
  const [abilities, setAbilities] = useState(characterData.abilities);
  const [abilityModifiers, setAbilityModifiers] = useState(
    characterData.abilityModifiers
  );
  const [race, setRace] = useState(characterData.race);
  const [comboClass, setComboClass] = useState(false);
  const [playerClass, setPlayerClass] = useState(characterData.class);
  const [checkedClasses, setCheckedClasses] = useState<string[]>([]);

  useEffect(() => {
    console.log({ abilities, abilityModifiers, race, playerClass });
  }, [abilities, abilityModifiers, race, playerClass]);

  const steps = [
    {
      title: "Ability Scores",
      fullTitle: "Roll for Ability Scores",
      description: abilityDescription,
      content: (
        <CharAbilityScoreStep
          abilities={abilities}
          setAbilities={setAbilities}
          abilityModifiers={abilityModifiers}
          setAbilityModifiers={setAbilityModifiers}
        />
      ),
    },
    {
      title: "Race",
      fullTitle: "Choose a Race",
      description: raceDescription,
      content: (
        <CharRaceStep
          abilities={abilities}
          race={race}
          setRace={setRace}
          setComboClass={setComboClass}
          setPlayerClass={setPlayerClass}
          setCheckedClasses={setCheckedClasses}
        />
      ),
    },
    {
      title: "Class",
      fullTitle: "Choose a Class",
      description: "Select an available Class",
      content: (
        <CharClassStep
          abilities={abilities}
          race={race}
          playerClass={playerClass}
          setPlayerClass={setPlayerClass}
          comboClass={comboClass}
          setComboClass={setComboClass}
          checkedClasses={checkedClasses}
          setCheckedClasses={setCheckedClasses}
        />
      ),
    },
    {
      title: "Hit Points",
      fullTitle: "Roll for Hit Points",
      description: "Roll for your character's Hit Points",
      content: "car",
    },
    {
      title: "Equipment",
      fullTitle: "Buy Equipment",
      description: "Equip your character",
      content: "hoo",
    },
    {
      title: "Name",
      fullTitle: "Name your character",
      description: "Give your character a name",
      content: "dar",
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const handleCancel = () => {
    props.setIsModalOpen(false);
  };

  function areAllAbilitiesSet(abilities: {
    strength: number;
    intelligence: number;
    wisdom: number;
    dexterity: number;
    constitution: number;
    charisma: number;
  }) {
    for (let key in abilities) {
      if (abilities[key as keyof typeof abilities] <= 0) {
        return false;
      }
    }
    return true;
  }

  function isNextButtonEnabled(currentStep: number) {
    switch (currentStep) {
      case 0:
        return areAllAbilitiesSet(abilities);
      case 1:
        return race !== "";
      case 2:
        return playerClass !== "";
      default:
        return true;
    }
  }

  return (
    <Modal
      title="Basic Modal"
      open={props.isModalOpen}
      onCancel={handleCancel}
      width={1200}
      footer={null}
    >
      <Steps current={current} items={items} />
      <section>
        <Title level={1}>{steps[current].fullTitle}</Title>
        <Paragraph>{steps[current].description}</Paragraph>
        {steps[current].content}
      </section>
      <div>
        {current < steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => next()}
            disabled={!isNextButtonEnabled(current)}
          >
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => console.log("foo")}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </Modal>
  );
}
