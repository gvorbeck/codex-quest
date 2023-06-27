import { useParams, Link, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
  CharacterData,
  CharacterSheetProps,
  EquipmentItem,
} from "../../components/types";
import BaseStats from "../../components/BaseStats/BaseStats";
import {
  Breadcrumb,
  Button,
  Col,
  Collapse,
  Divider,
  Row,
  Skeleton,
  Typography,
} from "antd";
import Description from "../../components/CharacterSheet/Description";
import Abilities from "../../components/CharacterSheet/Abilities";
import AttackBonus from "../../components/CharacterSheet/AttackBonus";
import HitPoints from "../../components/CharacterSheet/HitPoints";
import SpecialsRestrictions from "../../components/CharacterSheet/SpecialsRestrictions";
import SavingThrows from "../../components/CharacterSheet/SavingThrows";
import MoneyStats from "../../components/MoneyStats/MoneyStats";
import EquipmentList from "../../components/CharacterSheet/EquipmentList";
import Spells from "../../components/CharacterSheet/Spells";
import InitiativeRoller from "../../components/CharacterSheet/InitiativeRoller";
import calculateCarryingCapacity from "../../components/calculateCarryingCapacity";
import SimpleNumberStat from "../../components/CharacterSheet/SimpleNumberStat";
import { User } from "firebase/auth";
import AttackModal from "../../components/CharacterSheet/AttackModal";
import LevelUpModal from "../../components/CharacterSheet/LevelUpModal";
import AddEquipmentModal from "../../components/CharacterSheet/AddEquipmentModal";
import { hitDiceModifiers } from "../../data/hitDiceModifiers";
import { attackBonusTable } from "../../data/attackBonusTable";
import ThiefAbilities from "../../components/CharacterSheet/ThiefAbilities";
import WeightStats from "../../components/WeightStats/WeightStats";
import HelpTooltip from "../../components/HelpTooltip/HelpTooltip";

const attackBonus = function (character: CharacterData) {
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
  const userLoggedIn: User | null = user;
  const outletContext = useOutletContext() as { className: string };
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
    const diceParts = character.hp.dice.split("d")[1].split("+");
    if (character.level < 10) {
      hitDice =
        character.level.toString() +
        "d" +
        diceParts[0] +
        (modifier !== 0 ? "+" + modifier : "");
    } else {
      hitDice = "9d" + diceParts[0] + "+" + modifier;
    }
  }

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const characterDocRef = doc(db, `users/${uid}/characters/${id}`);
        const characterSnapshot = await getDoc(characterDocRef);

        if (characterSnapshot.exists()) {
          const characterData = characterSnapshot.data() as CharacterData;
          setCharacter(characterData);
          document.title = `${characterData.name} | CODEX.QUEST`;
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
    <div className={`${outletContext.className}`}>
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
        <div className="!text-shipGray [&>*]:mt-4 [&>div:first-child]:mt-0">
          {/* NAME / RACE / CLASS / LEVEL / XP */}
          <BaseStats
            character={character}
            setCharacter={setCharacter}
            userIsOwner={userIsOwner}
            showLevelUpModal={showLevelUpModal}
          />
          <InitiativeRoller character={character} />
          <Row gutter={32} className="gap-4 md:gap-0">
            <Col xs={24} md={8}>
              {/* ABILITY SCORES */}
              <Abilities character={character} />
            </Col>
            <Col xs={24} md={10} className="flex flex-col justify-between">
              {/* ATTACK BONUSES */}
              <AttackBonus
                character={character}
                attackBonus={attackBonus(character)}
              />
              {/* HIT POINTS */}
              <HitPoints
                character={character}
                setCharacter={setCharacter}
                userIsOwner={userIsOwner}
                className="mt-2"
              />
            </Col>
            <Col
              xs={24}
              md={6}
              className="flex items-center justify-between flex-wrap flex-col gap-4 sm:flex-row md:flex-col"
            >
              {/* ARMOR CLASS */}
              <SimpleNumberStat title="Armor Class" value={armorClass} />
              {/* MOVEMENT */}
              <SimpleNumberStat title="Movement" value={`${movement}'`} />
              {/* HIT DICE */}
              <SimpleNumberStat title="Hit Dice" value={hitDice} />
            </Col>
          </Row>
          <Divider />
          <Row gutter={32} className="gap-4 md:gap-0">
            <Col xs={24} md={12}>
              {/* SPECIALS / RESTRICTIONS */}
              <SpecialsRestrictions character={character} />
              {/* THIEF'S ABILITIES */}
              {character.class.includes("Thief") && (
                <ThiefAbilities characterLevel={character.level.toString()} />
              )}
            </Col>
            <Col xs={24} md={12}>
              {/* SAVING THROWS */}
              <SavingThrows character={character} setCharacter={setCharacter} />
            </Col>
          </Row>
          <Divider />
          <Row gutter={32} className="gap-4 md:gap-0">
            <Col xs={24} sm={11} md={6}>
              {/* MONEY */}
              <MoneyStats
                character={character}
                setCharacter={setCharacter}
                userIsOwner={userIsOwner}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              {/* WEIGHT */}
              <WeightStats character={character} setCharacter={setCharacter} />
            </Col>
            <Col xs={24} md={12}>
              {/* EQUIPMENT */}
              <Typography.Title level={3} className="mt-0 text-shipGray">
                Equipment
              </Typography.Title>
              <Button
                type="primary"
                disabled={!userIsOwner}
                onClick={showAddEquipmentModal}
              >
                Add Equipment
              </Button>
              <HelpTooltip
                className="ml-2"
                text="Selecting items will automatically be deducted from your gold."
              />
              <Collapse className="bg-seaBuckthorn mt-4">
                {/* SPELLS */}
                {character.spells.length > 0 && (
                  <Collapse.Panel
                    header="Spells"
                    key="1"
                    className="[&>div:not(:first)]:bg-springWood"
                  >
                    <Spells character={character} />
                  </Collapse.Panel>
                )}
                {/* WEAPONS */}
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
                {/* MISC ITEMS */}
                <Collapse.Panel
                  header="Miscellaneous Items"
                  key="3"
                  className="[&>div:not:first-child]:bg-springWood"
                >
                  <EquipmentList character={character} categories={"items"} />
                </Collapse.Panel>
                {/* ARMOR AND SHIELDS */}
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
                {/* BEAST OF BURDEN */}
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
                {/* Ammunition */}
                <Collapse.Panel
                  header="Ammunition"
                  key="6"
                  className="[&>div:not:first-child]:bg-springWood"
                >
                  <EquipmentList
                    character={character}
                    categories={"ammunition"}
                  />
                </Collapse.Panel>
              </Collapse>
            </Col>
          </Row>
          <Divider />
          {/* BIO & NOTES */}
          <Description
            character={character}
            setCharacter={setCharacter}
            userIsOwner={userIsOwner}
          />
          {/* MODALS */}
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
        <Skeleton avatar paragraph={{ rows: 4 }} />
      )}
    </div>
  );
}
