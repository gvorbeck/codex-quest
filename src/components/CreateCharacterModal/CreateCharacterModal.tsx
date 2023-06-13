import { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Steps, Typography } from "antd";
import CharAbilityScoreStep from "./CharAbilityScoreStep";
import CharRaceStep from "./CharRaceStep";
import CharClassStep from "./CharClassStep";
import CharHitPointsStep from "./CharHitPointsStep";
import CharEquipmentStep from "./CharEquipmentStep";
import {
  AbilityTypes,
  CharacterData,
  CreateCharacterModalProps,
  SpellType,
} from "../types";
import CharNameStep from "./CharNameStep";
import equipmentItems from "../../data/equipment-items.json";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

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
  "You're almost done! Personalize your newly minted character by giving them a name. Optionally, upload a portrait image if you'd like. IMAGE REQUIREMENTS!!!";

const emptyCharacter = {
  abilities: {
    scores: {
      strength: 0,
      intelligence: 0,
      wisdom: 0,
      constitution: 0,
      dexterity: 0,
      charisma: 0,
    },
    modifiers: {
      strength: "",
      intelligence: "",
      wisdom: "",
      constitution: "",
      dexterity: "",
      charisma: "",
    },
  },
  class: "",
  race: "",
  hp: {
    dice: "",
    points: 0,
    max: 0,
    desc: "",
  },
  spells: [],
  gold: 0,
  equipment: [],
  weight: 0,
  name: "",
  avatar: "",
  level: 1,
  specials: { race: [], class: [] },
  restrictions: { race: [], class: [] },
  savingThrows: {
    deathRayOrPoison: 0,
    magicWands: 0,
    paralysisOrPetrify: 0,
    dragonBreath: 0,
    spells: 0,
  },
  xp: 0,
  desc: "",
};

export default function CreateCharacterModal({
  isModalOpen,
  setIsModalOpen,
  onCharacterAdded,
}: CreateCharacterModalProps) {
  const [current, setCurrent] = useState(0);
  const [comboClass, setComboClass] = useState(false);
  const [checkedClasses, setCheckedClasses] = useState<string[]>([]);
  const [characterData, setCharacterData] =
    useState<CharacterData>(emptyCharacter);
  const [selectedSpell, setSelectedSpell] = useState<SpellType | null>(null);

  const steps = [
    {
      title: "Ability Scores",
      fullTitle: "Roll for Ability Scores",
      description: abilityDescription,
      content: (
        <CharAbilityScoreStep
          characterData={characterData}
          setCharacterData={setCharacterData}
          setComboClass={setComboClass}
          setCheckedClasses={setCheckedClasses}
        />
      ),
    },
    {
      title: "Race",
      fullTitle: "Choose a Race",
      description: raceDescription,
      content: (
        <CharRaceStep
          setComboClass={setComboClass}
          setCheckedClasses={setCheckedClasses}
          characterData={characterData}
          setCharacterData={setCharacterData}
        />
      ),
    },
    {
      title: "Class",
      fullTitle: "Choose a Class",
      description: classDescription,
      content: (
        <CharClassStep
          comboClass={comboClass}
          setComboClass={setComboClass}
          checkedClasses={checkedClasses}
          setCheckedClasses={setCheckedClasses}
          characterData={characterData}
          setCharacterData={setCharacterData}
          selectedSpell={selectedSpell}
          setSelectedSpell={setSelectedSpell}
        />
      ),
    },
    {
      title: "Hit Points",
      fullTitle: "Roll for Hit Points",
      description: hitPointsDescription,
      content: (
        <CharHitPointsStep
          characterData={characterData}
          setCharacterData={setCharacterData}
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
          characterData={characterData}
          setCharacterData={setCharacterData}
          equipmentItems={equipmentItems}
          rollGold
        />
      ),
    },
    {
      title: "Name",
      fullTitle: "Name your character",
      description: nameDescription,
      content: (
        <CharNameStep
          characterData={characterData}
          setCharacterData={setCharacterData}
        />
      ),
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
    setIsModalOpen(false);
    setCharacterData(emptyCharacter);
    setCurrent(0);
  };

  function areAllAbilitiesSet(abilities: AbilityTypes) {
    for (let key in abilities) {
      const value = +abilities[key as keyof typeof abilities];
      if (value <= 0 || isNaN(value)) {
        return false;
      }
    }
    return true;
  }

  function isNextButtonEnabled(currentStep: number) {
    switch (currentStep) {
      case 0:
        return areAllAbilitiesSet(characterData.abilities.scores);
      case 1:
        return characterData.race !== "";
      case 2:
        return characterData.class !== "" &&
          characterData.class.includes("Magic-User")
          ? characterData.spells.length > 1
          : true;
      case 3:
        return characterData.hp.points !== 0;
      case 4:
        return characterData.equipment.length !== 0;
      case 5:
        return characterData.name;
      default:
        return true;
    }
  }

  async function addCharacterData(characterData: CharacterData) {
    // Check if a user is currently logged in
    if (auth.currentUser) {
      // Get the current user's UID
      const uid = auth.currentUser.uid;

      // Get a reference to the Firestore document
      const docRef = doc(collection(db, `users/${uid}/characters`));

      // Set the character data for the current user
      try {
        await setDoc(docRef, characterData);
        console.log(`${characterData.name} successfully saved!`);
        setIsModalOpen(false);
        // Refresh Character List
        onCharacterAdded();
        // Reset characterData
        setCharacterData(emptyCharacter);
        // Reset modal step
        setCurrent(0);
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    } else {
      console.error("No user is currently logged in.");
    }
  }

  useEffect(() => {
    console.log(characterData);
  }, [characterData]);

  return (
    <Modal
      title="Create BFRPG Character"
      open={isModalOpen}
      onCancel={handleCancel}
      width={1200}
      footer={null}
      className="m-0 max-w-full top-0"
    >
      <Row className="flex-col">
        <Col span={5} className="hidden md:block">
          <Steps current={current} items={items} direction="vertical" />
        </Col>
        <Col xs={24} sm={19}>
          <section>
            <Typography.Title level={1} className="mt-0">
              {steps[current].fullTitle}
            </Typography.Title>
            <Typography.Paragraph>
              {steps[current].description}
            </Typography.Paragraph>
            {steps[current].content}
          </section>
        </Col>
      </Row>
      <div className="mt-4">
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
            onClick={() => addCharacterData(characterData)}
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
