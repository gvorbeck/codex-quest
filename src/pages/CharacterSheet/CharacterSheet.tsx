// REACT
import { useEffect, useState } from "react";
// REACT ROUTER
import { Link, useOutletContext, useParams } from "react-router-dom";
// FIREBASE
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
// DEFINITIONS
import { User } from "firebase/auth";
import { CharacterSheetProps } from "./definitions";
import { CharacterData, ClassNames } from "../../components/definitions";
// ANTD COMPONENTS
import { Breadcrumb, Col, Divider, Row, Skeleton, Typography } from "antd";
// CHARACTER SHEET COMPONENTS
import BaseStats from "../../components/CharacterSheet/BaseStats/BaseStats";
import InitiativeRoller from "../../components/CharacterSheet/InitiativeRoller/InitiativeRoller";
import DiceRoller from "../../components/DiceRoller/DiceRoller";
import Abilities from "../../components/CharacterSheet/Abilities/Abilities";
import AttackBonus from "../../components/CharacterSheet/AttackBonus/AttackBonus";
import HitPoints from "../../components/CharacterSheet/HitPoints/HitPoints";
import SimpleNumberStat from "../../components/CharacterSheet/SimpleNumberStat/SimpleNumberStat";
import SpecialsRestrictions from "../../components/CharacterSheet/SpecialsRestrictions/SpecialsRestrictions";
import SpecialAbilitiesTable from "../../components/CharacterSheet/SpecialAbilitiesTable/SpecialAbilitiesTable";
import SavingThrows from "../../components/CharacterSheet/SavingThrows/SavingThrows";
import MoneyStats from "../../components/CharacterSheet/MoneyStats/MoneyStats";
import WeightStats from "../../components/CharacterSheet/WeightStats/WeightStats";
import EquipmentInfo from "../../components/CharacterSheet/EquipmentInfo/EquipmentInfo";
import Description from "../../components/CharacterSheet/CharacterDescription/CharacterDescription";
// MODALS
import LevelUpModal from "../../modals/LevelUpModal";
import DiceRollerModal from "../../modals/DiceRollerModal";
import AddEquipmentModal from "../../modals/AddEquipmentModal";
import AddCustomEquipmentModal from "../../modals/AddCustomEquipmentModal";
import AttackModal from "../../modals/AttackModal";
// DATA
import { hitDiceModifiers } from "../../data/hitDiceModifiers";
import { attackBonusTable } from "../../data/attackBonusTable";
import equipmentItems from "../../data/equipment-items.json";
import { classChoices } from "../../data/classDetails";
// SUPPORT
import { calculateCarryingCapacity } from "../../support/formatSupport";
import { EquipmentItem } from "../../components/EquipmentStore/definitions";

export default function CharacterSheet({ user }: CharacterSheetProps) {
  const { uid, id } = useParams();
  const [characterData, setCharacterData] = useState<CharacterData | null>(
    null
  );
  const [weapon, setWeapon] = useState<EquipmentItem | undefined>(undefined);

  const userLoggedIn: User | null = user;
  const userIsOwner = userLoggedIn?.uid === uid;

  const outletContext = useOutletContext() as { className: string };

  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const showLevelUpModal = () => {
    setIsLevelUpModalOpen(true);
  };

  const [isDiceRollerModalOpen, setIsDiceRollerModalOpen] = useState(false);
  const showDiceRollerModal = () => {
    setIsDiceRollerModalOpen(true);
  };

  const [isAddEquipmentModalOpen, setIsAddEquipmentModalOpen] = useState(false);
  const showAddEquipmentModal = () => {
    setIsAddEquipmentModalOpen(true);
  };

  const [isAddCustomEquipmentModalOpen, setIsAddCustomEquipmentModalOpen] =
    useState(false);
  const showAddCustomEquipmentModal = () => {
    setIsAddCustomEquipmentModalOpen(true);
  };

  const [isAttackModalOpen, setIsAttackModalOpen] = useState(false);
  const showAttackModal = () => {
    setIsAttackModalOpen(true);
  };

  const handleCancel = () => {
    setIsLevelUpModalOpen(false);
    setIsDiceRollerModalOpen(false);
    setIsAddEquipmentModalOpen(false);
    setIsAddCustomEquipmentModalOpen(false);
    setIsAttackModalOpen(false);
  };

  const handleCustomDelete = (item: EquipmentItem) => {
    if (!characterData) return;

    const newEquipment = characterData.equipment.filter(
      (e) => e.name !== item.name
    );
    setCharacterData({ ...characterData, equipment: newEquipment });
  };

  // HIT DICE
  let hitDice = "";
  if (characterData) {
    hitDice = characterData.hp.dice;
    let modifier = 0;
    if (!characterData.class.includes(" ")) {
      modifier =
        characterData.class === "Cleric" || characterData.class === "Magic-User"
          ? hitDiceModifiers.single[characterData.level - 1] || 0
          : hitDiceModifiers.double[characterData.level - 1] || 0;
    }
    const diceParts = characterData.hp.dice.split("d")[1].split("+");
    if (characterData.level < 10) {
      hitDice =
        characterData.level.toString() +
        "d" +
        diceParts[0] +
        (modifier !== 0 ? "+" + modifier : "");
    } else {
      hitDice = "9d" + diceParts[0] + "+" + modifier;
    }
  }

  // ATTACK BONUS
  const getAttackBonus = function (characterData: CharacterData) {
    let classes = Object.keys(attackBonusTable);
    let maxAttackBonus = 0;

    for (let i = 0; i < classes.length; i++) {
      if (characterData && characterData.class.includes(classes[i])) {
        let attackBonus = attackBonusTable[classes[i]][characterData.level];
        if (attackBonus > maxAttackBonus) {
          maxAttackBonus = attackBonus;
        }
      }
    }

    return maxAttackBonus;
  };

  // ARMOR CLASS (AC)
  const getArmorClass = (characterData: CharacterData) => {
    if (!characterData) return;

    let armorClass = 11;
    let armorAC = 0;
    let shieldAC = 0;

    if (!characterData.wearing) {
      setCharacterData({
        ...characterData,
        wearing: { armor: "", shield: "" },
      });
    } else {
      armorAC = Number(
        equipmentItems.filter(
          (item) => item.name === characterData.wearing?.armor
        )[0]?.AC ||
          characterData.equipment.filter(
            (item) => item.name === characterData.wearing?.armor
          )[0]?.AC ||
          0
      );
      shieldAC = Number(
        equipmentItems.filter(
          (item) => item.name === characterData.wearing?.shield
        )[0]?.AC ||
          characterData.equipment.filter(
            (item) => item.name === characterData.wearing?.shield
          )[0]?.AC ||
          0
      );
      armorClass =
        armorAC + shieldAC > armorClass + shieldAC
          ? armorAC + shieldAC
          : armorClass + shieldAC;
    }

    return armorClass;
  };

  const updateAC = async () => {
    if (!uid || !id) {
      console.error("User ID or Character ID is undefined");
      return;
    }
    if (!characterData || !characterData.wearing) return;

    const docRef = doc(db, "users", uid, "characters", id);

    const updateData = {
      "wearing.armor": characterData.wearing.armor,
      "wearing.shield": characterData.wearing.shield,
    };

    try {
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("Error updating character AC: ", error);
    }
  };

  useEffect(() => {
    updateAC();
  }, [characterData?.wearing]);

  // MOVEMENT
  const getMovement = (characterData: CharacterData) => {
    if (!characterData) return;

    const carryingCapacity = calculateCarryingCapacity(
      +characterData.abilities.scores.strength,
      characterData.race
    );

    const isWearing = (armorNames: string[]) => {
      return armorNames.includes(characterData?.wearing?.armor || "");
    };

    // This checks if there is armor being worn or not and adjusts movement.
    if (isWearing(["No Armor", "Magic Leather Armor", ""])) {
      return characterData.weight <= carryingCapacity.light ? 40 : 30;
    } else if (
      isWearing([
        "Studded Leather Armor",
        "Hide Armor",
        "Leather Armor",
        "Magic Metal Armor",
        "Hide Armor",
      ])
    ) {
      return characterData.weight <= carryingCapacity.light ? 30 : 20;
    } else if (
      isWearing([
        "Metal Armor",
        "Chain Mail",
        "Ring Mail",
        "Brigandine Armor",
        "Scale Mail",
        "Splint Mail",
        "Banded Mail",
        "Plate Mail",
        "Field Plate Mail",
        "Full Plate Mail",
      ])
    ) {
      return characterData.weight <= carryingCapacity.light ? 20 : 10;
    }
  };

  // MONEY
  function makeChange() {
    if (characterData) {
      let copper = characterData.gold * 100;
      let goldPieces = Math.floor(copper / 100);
      copper %= 100;
      let silverPieces = Math.floor(copper / 10);
      copper %= 10;
      let copperPieces = copper;

      return {
        gp: Math.round(goldPieces),
        sp: Math.round(silverPieces),
        cp: Math.round(copperPieces),
      };
    } else {
      // default object when characterData is null/undefined
      return { gp: 0, sp: 0, cp: 0 };
    }
  }

  // GET CHARACTERDATA
  useEffect(() => {
    async function fetchCharacter() {
      try {
        const characterDocRef = doc(db, `users/${uid}/characters/${id}`);
        const characterSnapshot = await getDoc(characterDocRef);

        if (characterSnapshot.exists()) {
          const characterData = characterSnapshot.data() as CharacterData;
          setCharacterData(characterData);
          document.title = `${characterData.name} | CODEX.QUEST`;
        } else {
          console.error("Character not found");
        }
      } catch (error) {
        console.error("Error fetching character:", error);
      }
    }

    fetchCharacter();
  }, [uid, id]);

  return characterData ? (
    <div className={`${outletContext.className} text-shipGray [&>*+*]:mt-4`}>
      <Breadcrumb
        className="print:hidden"
        items={[
          {
            title: (
              <Link aria-label="Go back Home" to="/">
                Home
              </Link>
            ),
          },
          { title: characterData.name },
        ]}
      />
      {/* NAME / RACE / CLASS / LEVEL / XP */}
      <BaseStats
        characterData={characterData}
        setCharacterData={setCharacterData}
        userIsOwner={userIsOwner}
        showLevelUpModal={showLevelUpModal}
      />
      {/* ROLLING BUTTONS */}
      <div className="flex justify-between print:hidden">
        <InitiativeRoller characterData={characterData} />
        <DiceRoller onClick={showDiceRollerModal} />
      </div>
      <Row gutter={32} className="gap-4 md:gap-0 print:block">
        <Col xs={24} md={8} className="print:w-1/2 float-left mb-4">
          {/* ABILITY SCORES */}
          <Abilities characterData={characterData} />
        </Col>
        <Col
          xs={24}
          md={10}
          className="flex flex-col justify-between print:w-1/2"
        >
          {/* ATTACK BONUSES */}
          <AttackBonus
            characterData={characterData}
            attackBonus={getAttackBonus(characterData)}
          />
          {/* HIT POINTS */}
          <HitPoints
            characterData={characterData}
            setCharacterData={setCharacterData}
            userIsOwner={userIsOwner}
            className="mt-2"
          />
        </Col>
        <Col
          xs={24}
          md={6}
          className="flex items-center justify-between flex-wrap flex-col gap-4 sm:flex-row md:flex-col print:clear-left"
        >
          {/* ARMOR CLASS */}
          <SimpleNumberStat
            title="Armor Class"
            value={getArmorClass(characterData) || 0}
            helpText="Base AC is 11. Select the armor your character is wearing in the Equipment section below."
          />
          {/* MOVEMENT */}
          <SimpleNumberStat
            title="Movement"
            value={`${getMovement(characterData)}'`}
            helpText="Movement starts at 40' and is affected by how much weight your character is carrying and the armor they are wearing."
          />
          {/* HIT DICE */}
          <SimpleNumberStat title="Hit Dice" value={hitDice} />
        </Col>
      </Row>
      <Divider className="print:hidden" />
      {/* Hide these if using a custom Class */}
      {classChoices.includes(
        ClassNames[characterData.class as keyof typeof ClassNames]
      ) || characterData.class.toLowerCase().includes("magic-user") ? (
        <Row gutter={32} className="gap-4 md:gap-0 print:block">
          <Col xs={24} md={12} className="print:w-1/2 print:float-left">
            {/* SPECIALS / RESTRICTIONS */}
            <SpecialsRestrictions characterData={characterData} />
            {/* THIEF'S ABILITIES */}
            {(characterData.class.toLowerCase().includes("thief") ||
              characterData.class.toLowerCase().includes("assassin")) && (
              <SpecialAbilitiesTable
                characterLevel={characterData.level.toString()}
                characterClass={
                  characterData.class.toLowerCase().includes("thief")
                    ? "thief"
                    : characterData.class.toLowerCase()
                }
              />
            )}
          </Col>
          <Col xs={24} md={12} className="print:w-1/2 print:float-right">
            {/* SAVING THROWS */}
            <SavingThrows characterData={characterData} />
          </Col>
        </Row>
      ) : (
        <Typography.Text className="text-center">
          You are using a custom Class. Use the "Bio & Notes" field below to
          calculate your character's Saving Throws, Special Abilities, and
          Restrictions.
        </Typography.Text>
      )}
      <Divider />
      <Row gutter={32} className="gap-4 md:gap-0 print:block">
        <Col xs={24} sm={11} md={6} className="print:w-1/2 print:float-left">
          {/* MONEY */}
          <MoneyStats
            characterData={characterData}
            setCharacterData={setCharacterData}
            userIsOwner={userIsOwner}
            makeChange={makeChange}
          />
        </Col>
        <Col xs={24} sm={12} md={6} className="print:w-1/2 print:float-right">
          {/* WEIGHT */}
          <WeightStats characterData={characterData} />
        </Col>
        <Col xs={24} md={12} className="print:clear-both">
          {/* EQUIPMENT */}
          <EquipmentInfo
            userIsOwner={userIsOwner}
            showAddEquipmentModal={showAddEquipmentModal}
            showAddCustomEquipmentModal={showAddCustomEquipmentModal}
            characterData={characterData}
            setCharacterData={setCharacterData}
            handleCustomDelete={handleCustomDelete}
            setWeapon={setWeapon}
            showAttackModal={showAttackModal}
            updateAC={updateAC}
          />
        </Col>
      </Row>
      <Divider />
      {/* BIO & NOTES */}
      <Description
        characterData={characterData}
        setCharacterData={setCharacterData}
        userIsOwner={userIsOwner}
      />
      {/* MODALS */}
      <LevelUpModal
        isLevelUpModalOpen={isLevelUpModalOpen}
        handleCancel={handleCancel}
        characterData={characterData}
        hitDice={hitDice}
        setCharacterData={setCharacterData}
      />
      <DiceRollerModal
        handleCancel={handleCancel}
        isDiceRollerModalOpen={isDiceRollerModalOpen}
      />
      <AddEquipmentModal
        isAddEquipmentModalOpen={isAddEquipmentModalOpen}
        handleCancel={handleCancel}
        characterData={characterData}
        setCharacterData={setCharacterData}
      />
      <AddCustomEquipmentModal
        isAddCustomEquipmentModalOpen={isAddCustomEquipmentModalOpen}
        handleCancel={handleCancel}
        characterData={characterData}
        setCharacterData={setCharacterData}
      />
      <AttackModal
        isAttackModalOpen={isAttackModalOpen}
        handleCancel={handleCancel}
        characterData={characterData}
        attackBonus={getAttackBonus(characterData)}
        weapon={weapon}
      />
    </div>
  ) : (
    <Skeleton avatar paragraph={{ rows: 8 }} />
  );
}
