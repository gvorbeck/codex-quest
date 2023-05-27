import { useState } from "react";
import { Button, Modal, Steps, Typography } from "antd";
import CharAbilityScoreStep from "./CreateCharacterSteps/CharAbilityScoreStep";
import CharRaceStep from "./CreateCharacterSteps/CharRaceStep";
import CharClassStep from "./CreateCharacterSteps/CharClassStep";
import CharHitPointsStep from "./CreateCharacterSteps/CharHitPointsStep";
import CharEquipmentStep from "./CreateCharacterSteps/CharEquipmentStep";
import { EquipmentItem, SpellItem } from "./types";
import CharNameStep from "./CreateCharacterSteps/CharNameStep";

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
  hitPoints: 0,
  hitDice: "",
  gold: 0,
  equipment: [],
};

const { Title, Paragraph } = Typography;

const abilityDescription =
  "Roll for your character's Abilities. You can click the Roll button or use your own dice and record your scores below. Each character will have a score ranging from 3 to 18 in each of the Abilities below. A bonus or penalty Modifier is associated with each score as well. Each Class has a Prime Requisite Ability Score, which must be at least 9 in order for the character to become a member of that Class; also, there are required minimum and maximum scores for each character Race other than Humans.";

const raceDescription =
  "Choose your character's Race. Some options may be unavailable due to your character's Ability Scores. Each Race except Humans has minimum and maximum values for certain Abilities that your character's Ability Scores may not match. A full description of these Race-specific requirements can be found in your copy of the BFRPG rules. Additionally, each Race has specific restrictions, special abilities, and Saving Throws. Choose wisely.";

const classDescription =
  "Choose your character's Class. Your character's Race and Ability Scores will determine their Class options. Dwarves and Halflings cannot be Magic-Users. Elves may choose to have a combination Class. Your Class choice will determine your character's background and how they will progress through the game as they level up. Each Class's Prime Requisite Ability Score will also determine which Class options are available to you.";

const hitPointsDescription =
  "Roll for your character's Hit Points. Your character's Race may place restrictions on the Hit Dice available to them, but generally this is determined by their chosen Class. Additionally your character's Constitution modifier is added/subtracted from this value with a minimum value of 1. The end result is the amount of Hit Points your character will start with and determines how much damage your character can take in battle.";

const equipmentDescription =
  "Roll for your character's starting gold. You can click the Roll button or use your own dice and record your amount below. Next, it's time to purchase your character's starting equipment. Keep in mind that your character's Race may limit types and amounts of equipment they can carry due to size and carrying capacity restrictions.";

const nameDescription =
  "You're almost done. Personalize your newly minted character by giving them a name. Also, upload a portrait image if you'd like. IMAGE REQUIREMENTS!!!";

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
  const [hitPoints, setHitPoints] = useState(0);
  const [hitDice, setHitDice] = useState("");
  const [gold, setGold] = useState(characterData.gold);
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [equipmentItems, setEquipmentItems] = useState<EquipmentItem[]>([]);
  const [weight, setWeight] = useState(0);
  const [name, setName] = useState("");
  const [spells, setSpells] = useState<SpellItem[]>([]);

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
          setComboClass={setComboClass}
          setPlayerClass={setPlayerClass}
          setCheckedClasses={setCheckedClasses}
          setRace={setRace}
          setHitPoints={setHitPoints}
          setHitDice={setHitDice}
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
          setHitPoints={setHitPoints}
          setHitDice={setHitDice}
        />
      ),
    },
    {
      title: "Class",
      fullTitle: "Choose a Class",
      description: classDescription,
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
          setHitPoints={setHitPoints}
          setHitDice={setHitDice}
          spells={spells}
          setSpells={setSpells}
        />
      ),
    },
    {
      title: "Hit Points",
      fullTitle: "Roll for Hit Points",
      description: hitPointsDescription,
      content: (
        <CharHitPointsStep
          hitPoints={hitPoints}
          setHitPoints={setHitPoints}
          race={race}
          playerClass={playerClass}
          constitutionModifier={abilityModifiers.constitution}
          hitDice={hitDice}
          setHitDice={setHitDice}
          comboClass={comboClass}
        />
      ),
    },
    {
      title: "Equipment",
      fullTitle: "Buy Equipment",
      description: equipmentDescription,
      content: (
        <CharEquipmentStep
          gold={gold}
          setGold={setGold}
          equipment={equipment}
          setEquipment={setEquipment}
          race={race}
          weight={weight}
          setWeight={setWeight}
          strength={abilities.strength}
          equipmentItems={equipmentItems}
          setEquipmentItems={setEquipmentItems}
        />
      ),
    },
    {
      title: "Name",
      fullTitle: "Name your character",
      description: nameDescription,
      content: <CharNameStep name={name} setName={setName} />,
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
      case 3:
        return hitPoints !== 0;
      case 4:
        return gold !== 0;
      case 5:
        return name;
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
          <Button
            type="primary"
            onClick={() => console.log("foo")}
            disabled={!isNextButtonEnabled(current)}
          >
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
