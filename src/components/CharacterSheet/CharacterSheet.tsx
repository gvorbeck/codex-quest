import { useParams, Link, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { CharacterData, CharacterSheetProps } from "../types";
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

export default function CharacterSheet({ user }: CharacterSheetProps) {
  const userLoggedIn: User = useOutletContext();
  const { uid, id } = useParams();
  const [character, setCharacter] = useState<CharacterData | null>(null);

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

  // HIT DICE
  const hitDiceModifiers = {
    single: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
    ],
    double: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      2,
      4,
      6,
      8,
      10,
      12,
      14,
      16,
      18,
      20,
      22,
    ],
  };
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
    if (character.level < 10) {
      hitDice =
        character.level + hitDice + (modifier !== 0 ? "+" + modifier : "");
    } else {
      hitDice = 9 + hitDice + "+" + modifier;
    }
  }

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const characterDocRef = doc(db, `users/${uid}/characters/${id}`);
        const characterSnapshot = await getDoc(characterDocRef);

        if (characterSnapshot.exists()) {
          const characterData = characterSnapshot.data() as CharacterData;
          console.log(characterData);
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
          />
          <InitiativeRoller character={character} />
          <Row gutter={32}>
            <Col span={8}>
              <Abilities character={character} />
            </Col>
            <Col span={8} className="flex flex-col justify-between">
              <AttackBonus character={character} />
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
              <Button type="primary" disabled={!userIsOwner}>
                Add Equipment
              </Button>
              <Collapse className="bg-seaBuckthorn mt-4">
                {character.class.includes("Magic-User") && (
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
        </div>
      ) : (
        <div>Loading character...</div>
      )}
    </div>
  );
}
