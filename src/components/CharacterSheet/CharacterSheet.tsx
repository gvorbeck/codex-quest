import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { CharacterData, CharacterSheetProps } from "../types";
import BaseStats from "./BaseStats";
import { Breadcrumb, Col, Row } from "antd";
import SecondaryStats from "./SecondaryStats";
import Abilities from "./Abilities";
import AttackBonus from "./AttackBonus";
import Movement from "./Movement";
import ArmorClass from "./ArmorClass";
import HitPoints from "./HitPoints";
import SpecialsRestrictions from "./SpecialsRestrictions";
import SavingThrows from "./SavingThrows";
import ExperiencePoints from "./ExperiencePoints";
import Weight from "./Weight";
import Money from "./Money";
import EquipmentList from "./EquipmentList";
import Spells from "./Spells";
import InitiativeRoller from "./InitiativeRoller";
import HitDice from "./HitDice";

export default function CharacterSheet({ user }: CharacterSheetProps) {
  const { uid, id } = useParams();
  const [character, setCharacter] = useState<CharacterData | null>(null);

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
          <BaseStats character={character} />
          <div className="flex justify-between">
            <ExperiencePoints
              character={character}
              setCharacter={setCharacter}
            />
            <InitiativeRoller character={character} />
          </div>
          <Row gutter={32}>
            <Col span={8}>
              <Abilities character={character} />
            </Col>
            <Col span={16}>
              <AttackBonus character={character} setCharacter={setCharacter} />
            </Col>
          </Row>
          <SecondaryStats character={character} setCharacter={setCharacter} />
          <Movement character={character} setCharacter={setCharacter} />
          <ArmorClass character={character} setCharacter={setCharacter} />
          <HitPoints character={character} setCharacter={setCharacter} />
          <SpecialsRestrictions
            character={character}
            setCharacter={setCharacter}
          />
          <SavingThrows character={character} setCharacter={setCharacter} />
          <Weight character={character} setCharacter={setCharacter} />
          <Money character={character} setCharacter={setCharacter} />
          <EquipmentList
            character={character}
            setCharacter={setCharacter}
            header={"Weapons"}
            categories={[
              "axes",
              "bows",
              "daggers",
              "swords",
              "hammers-and-maces",
            ]}
          />
          <EquipmentList
            character={character}
            setCharacter={setCharacter}
            header={"Misc Items"}
            categories={"items"}
          />
          <EquipmentList
            character={character}
            setCharacter={setCharacter}
            header={"Beasts of Burden"}
            categories={"beasts-of-burden"}
          />
          {character.class.includes("Magic-User") && (
            <Spells character={character} setCharacter={setCharacter} />
          )}
          <HitDice character={character} />
        </div>
      ) : (
        <div>Loading character...</div>
      )}
    </div>
  );
}
