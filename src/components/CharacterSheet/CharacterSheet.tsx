import { useParams, Link, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { CharacterData, CharacterSheetProps, EquipmentItem } from "../types";
import BaseStats from "./BaseStats";
import {
  Breadcrumb,
  Button,
  Col,
  Collapse,
  Divider,
  Row,
  Typography,
} from "antd";
import Description from "./Description";
import Abilities from "./Abilities";
import AttackBonus from "./AttackBonus";
import HitPoints from "./HitPoints";
import SpecialsRestrictions from "./SpecialsRestrictions";
import SavingThrows from "./SavingThrows";
import Weight from "./Weight";
import Money from "./Money";
import EquipmentList from "./EquipmentList";
import Spells from "./Spells";
import InitiativeRoller from "./InitiativeRoller";
import calculateCarryingCapacity from "../calculateCarryingCapacity";
import SimpleNumberStat from "./SimpleNumberStat";
import { User } from "firebase/auth";
import AttackModal from "./AttackModal";
import LevelUpModal from "./LevelUpModal";
import AddEquipmentModal from "./AddEquipmentModal";
import { hitDiceModifiers } from "../../data/hitDiceModifiers";

const attackBonus = function (character: CharacterData) {
  const attackBonusTable: Record<string, number[]> = {
    Fighter: [0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 6, 7, 7, 8, 8, 8, 9, 9, 10, 10, 10],
    Cleric: [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
    "Magic-User": [
      0, 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7,
    ],
    Thief: [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
  };

  let classes = Object.keys(attackBonusTable);
  let maxAttackBonus = 0;

  for (let i = 0; i < classes.length; i++) {
    if (character && character.class.includes(classes[i])) {
      let attackBonus = attackBonusTable[classes[i]][character.level];
      if (attackBonus > maxAttackBonus) {
        maxAttackBonus = attackBonus;
      }
    }
  }

  return maxAttackBonus;
};

export default function CharacterSheet({ user }: CharacterSheetProps) {
  const userLoggedIn: User = useOutletContext();
  const { uid, id } = useParams();
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [isAttackModalOpen, setIsAttackModalOpen] = useState(false);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [isAddEquipmentModalOpen, setIsAddEquipmentModalOpen] = useState(false);
  const [weapon, setWeapon] = useState<EquipmentItem | undefined>(undefined);

  const showAttackModal = () => {
    setIsAttackModalOpen(true);
  };

  const showLevelUpModal = () => {
    setIsLevelUpModalOpen(true);
  };

  const showAddEquipmentModal = () => {
    setIsAddEquipmentModalOpen(true);
  };

  const handleCancel = () => {
    setIsAttackModalOpen(false);
    setIsLevelUpModalOpen(false);
    setIsAddEquipmentModalOpen(false);
  };

  const userIsOwner = userLoggedIn?.uid === uid;

  // MOVEMENT
  let movement;
  if (character) {
    const carryingCapacity = calculateCarryingCapacity(
      +character.abilities.scores.strength,
      character.race
    );
    if (
      character.equipment.find((item) => item.name === "No Armor") ||
      character.equipment.find((item) => item.name === "Magic Leather Armor")
    ) {
      movement = character.weight >= carryingCapacity.light ? 40 : 30;
    } else if (
      character.equipment.find((item) => item.name === "Leather Armor") ||
      character.equipment.find((item) => item.name === "Magic Metal Armor")
    ) {
      movement = character.weight >= carryingCapacity.light ? 30 : 20;
    } else if (
      character.equipment.find((item) => item.name === "Metal Armor")
    ) {
      movement = character.weight >= carryingCapacity.light ? 20 : 10;
    }
  }

  // ARMOR CLASS
  let armorClass = 11;
  if (character) {
    if (character.equipment.find((item) => item.name === "Leather Armor")) {
      armorClass = 13;
    } else if (
      character.equipment.find((item) => item.name === "Chain Mail Armor")
    ) {
      armorClass = 15;
    } else if (
      character.equipment.find((item) => item.name === "Plate Mail Armor")
    ) {
      armorClass = 17;
    }
    if (character.equipment.find((item) => item.name === "Shield"))
      armorClass++;
    armorClass += +character.abilities.modifiers.dexterity;
  }

  let hitDice = "";
  if (character) {
    hitDice = character.hp.dice;
    let modifier = 0;
    if (!character.class.includes(" ")) {
      modifier =
        character.class === "Cleric" || character.class === "Magic-User"
          ? hitDiceModifiers.single[character.level - 1] || 0
          : hitDiceModifiers.double[character.level - 1] || 0;
    }
    const diceParts = character.hp.dice.split("d");
    if (character.level < 10) {
      hitDice =
        character.level.toString() +
        "d" +
        diceParts[1] +
        (modifier !== 0 ? "+" + modifier : "");
    } else {
      hitDice = "9d" + diceParts[1] + "+" + modifier;
    }
  }

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const characterDocRef = doc(db, `users/${uid}/characters/${id}`);
        const characterSnapshot = await getDoc(characterDocRef);

        if (characterSnapshot.exists()) {
          const characterData = characterSnapshot.data() as CharacterData;
          console.log("DEV:", characterData);
          setCharacter(characterData);
        } else {
          console.log("Character not found");
        }
      } catch (error) {
        console.error("Error fetching character:", error);
      }
    }

    fetchCharacter();
  }, [uid, id]);

  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: (
              <Link aria-label="Go back Home" to="/">
                Home
              </Link>
            ),
          },
          { title: character?.name || "" },
        ]}
      />
      {character ? (
        <div className="!text-shipGray [&>*]:mt-8 [&>div:first-child]:mt-0">
          <BaseStats
            character={character}
            setCharacter={setCharacter}
            userIsOwner={userIsOwner}
            showLevelUpModal={showLevelUpModal}
          />
          <InitiativeRoller character={character} />
          <Row gutter={32}>
            <Col span={8}>
              <Abilities character={character} />
            </Col>
            <Col span={8} className="flex flex-col justify-between">
              <AttackBonus
                character={character}
                attackBonus={attackBonus(character)}
              />
              <HitPoints
                character={character}
                setCharacter={setCharacter}
                userIsOwner={userIsOwner}
              />
            </Col>
            <Col
              span={8}
              className="flex items-center justify-between flex-col"
            >
              <SimpleNumberStat title="Armor Class" value={armorClass} />
              <SimpleNumberStat title="Movement" value={`${movement}'`} />
              <SimpleNumberStat title="Hit Dice" value={hitDice} />
            </Col>
          </Row>
          <Divider />
          <Row gutter={32}>
            <Col span={12}>
              <SpecialsRestrictions character={character} />
            </Col>
            <Col span={12}>
              <SavingThrows character={character} setCharacter={setCharacter} />
            </Col>
          </Row>
          <Divider />
          <Row gutter={32}>
            <Col span={6}>
              <Money
                character={character}
                setCharacter={setCharacter}
                userIsOwner={userIsOwner}
              />
            </Col>
            <Col span={6}>
              <Weight character={character} setCharacter={setCharacter} />
            </Col>
            <Col span={12}>
              <Typography.Title level={3} className="mt-0 !text-shipGray">
                Equipment
              </Typography.Title>
              <Button
                type="primary"
                disabled={!userIsOwner}
                onClick={showAddEquipmentModal}
              >
                Add Equipment
              </Button>
              <Collapse className="bg-seaBuckthorn mt-4">
                {character.spells.length > 0 && (
                  <Collapse.Panel
                    header="Spells"
                    key="1"
                    className="[&>div:not(:first)]:bg-springWood"
                  >
                    <Spells character={character} setCharacter={setCharacter} />
                  </Collapse.Panel>
                )}
                <Collapse.Panel
                  header="Weapons"
                  key="2"
                  className="[&>div:not:first-child]:bg-springWood"
                >
                  <EquipmentList
                    character={character}
                    handleAttack
                    categories={[
                      "axes",
                      "bows",
                      "daggers",
                      "swords",
                      "hammers-and-maces",
                    ]}
                    attackBonus={attackBonus(character)}
                    setWeapon={setWeapon}
                    showAttackModal={showAttackModal}
                  />
                </Collapse.Panel>
                <Collapse.Panel
                  header="Miscellaneous Items"
                  key="3"
                  className="[&>div:not:first-child]:bg-springWood"
                >
                  <EquipmentList character={character} categories={"items"} />
                </Collapse.Panel>
                <Collapse.Panel
                  header="Armor and Shields"
                  key="4"
                  className="[&>div:not:first-child]:bg-springWood"
                >
                  <EquipmentList
                    character={character}
                    categories={"armor-and-shields"}
                  />
                </Collapse.Panel>
                <Collapse.Panel
                  header="Beasts of Burden"
                  key="5"
                  className="[&>div:not:first-child]:bg-springWood"
                >
                  <EquipmentList
                    character={character}
                    categories={"beasts-of-burden"}
                  />
                </Collapse.Panel>
              </Collapse>
            </Col>
          </Row>
          <Divider />
          <Description
            character={character}
            setCharacter={setCharacter}
            userIsOwner={userIsOwner}
          />
          <AttackModal
            isAttackModalOpen={isAttackModalOpen}
            handleCancel={handleCancel}
            character={character}
            attackBonus={attackBonus(character)}
            weapon={weapon}
          />
          <LevelUpModal
            isLevelUpModalOpen={isLevelUpModalOpen}
            handleCancel={handleCancel}
            character={character}
            hitDice={hitDice}
            setCharacter={setCharacter}
          />
          <AddEquipmentModal
            isAddEquipmentModalOpen={isAddEquipmentModalOpen}
            handleCancel={handleCancel}
            character={character}
            setCharacter={setCharacter}
          />
        </div>
      ) : (
        <div>Loading character...</div>
      )}
    </div>
  );
}
