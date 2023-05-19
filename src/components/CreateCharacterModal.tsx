import { useEffect, useState } from "react";
import { Button, Modal, Steps, Typography } from "antd";
import CharAbilityScoreStep from "./CreateCharacterSteps/CharAbilityScoreStep";

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
};

const { Title, Paragraph } = Typography;

const abilityDescription =
  "Roll for your character's Abilities. You can click the Roll button or use your own dice and record your scores below. Each character will have a score ranging from 3 to 18 in each of the Abilities below. A bonus or penalty Modifier is associated with each score as well. Each Class has a Prime Requisite Ability score, which must be at least 9 in order for the character to become a member of that Class; also, there are required minimum and maximum scores for each character Race other than Humans.";

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

  useEffect(() => {
    console.log(abilities);
    console.log(abilityModifiers);
  }, [abilities, abilityModifiers]);

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
      description: "Select an available Race",
      content: "bar",
    },
    {
      title: "Class",
      fullTitle: "Choose a Class",
      description: "Select an available Class",
      content: "goo",
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
            disabled={!areAllAbilitiesSet(abilities)}
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
