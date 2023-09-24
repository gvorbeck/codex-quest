// REACT
import React, { useEffect, useState } from "react";
// REACT ROUTER
import { Link, useOutletContext, useParams } from "react-router-dom";
// FIREBASE
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
// DEFINITIONS
import { User } from "firebase/auth";
import { CharacterSheetProps } from "./definitions";
import { CharacterData } from "../../components/definitions";
import { EquipmentItem } from "../../components/EquipmentStore/definitions";
// ANTD COMPONENTS
import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Row,
  Skeleton,
  Typography,
} from "antd";
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
import AttackModal from "../../components/AttackModal/AttackModal";
// DATA
import equipmentItems from "../../data/equipmentItems.json";
import { classes } from "../../data/classes";
import { ClassNames, RaceNames } from "../../data/definitions";
// SUPPORT
import { getCarryingCapacity } from "../../support/formatSupport";
import { getClassType, getHitPointsModifier } from "../../support/helpers";
import CheatSheetModal from "../../modals/CheatSheetModal";
import { HomeOutlined, SolutionOutlined } from "@ant-design/icons";

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

  const [isCheatSheetModalOpen, setIsCheatSheetModalOpen] = useState(false);
  const showCheatSheetModal = () => {
    setIsCheatSheetModalOpen(true);
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
    setIsCheatSheetModalOpen(false);
  };

  const handleCustomDelete = (item: EquipmentItem) => {
    if (!characterData) return;

    const newEquipment = characterData.equipment.filter(
      (e) => e.name !== item.name
    );
    setCharacterData({ ...characterData, equipment: newEquipment });
  };

  // HIT DICE
  const hitDice = (level: number, className: string[], dice: string) => {
    // TODO: This should be using class modifier and specific classes should not be called out here.
    const dieType = dice.split("d")[1].split("+")[0];
    const prefix = Math.min(level, 9);

    // Calculate the suffix
    let suffix = (level > 9 ? level - 9 : 0) * getHitPointsModifier(className);

    // Combine to create the result
    const result = `${prefix}d${dieType}${suffix > 0 ? "+" + suffix : ""}`;
    return result;
  };

  // ATTACK BONUS
  const getAttackBonus = function (characterData: CharacterData) {
    if (getClassType(characterData.class) === "custom") return 0;
    let maxAttackBonus = 0;

    characterData.class.forEach((classPiece) => {
      const classAttackBonus =
        classes[classPiece as ClassNames]?.attackBonus[characterData.level];
      if (classAttackBonus > maxAttackBonus) {
        maxAttackBonus = classAttackBonus;
      }
    });

    return maxAttackBonus;
  };

  // ARMOR CLASS (AC)
  const getArmorClass = (
    characterData: CharacterData,
    type: "missile" | "melee" = "melee"
  ) => {
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
      if (type === "melee") {
        shieldAC = Number(
          equipmentItems.filter(
            (item) => item.name === characterData.wearing?.shield
          )[0]?.AC ||
            characterData.equipment.filter(
              (item) => item.name === characterData.wearing?.shield
            )[0]?.AC ||
            0
        );
      } else {
        shieldAC = Number(
          equipmentItems.filter(
            (item) => item.name === characterData.wearing?.shield
          )[0]?.missileAC ||
            characterData.equipment.filter(
              (item) => item.name === characterData.wearing?.shield
            )[0]?.missileAC ||
            0
        );
      }
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

    const carryingCapacity = getCarryingCapacity(
      +characterData.abilities.scores.strength,
      characterData.race as RaceNames
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

  const showMissileAC =
    characterData &&
    getArmorClass(characterData, "missile") !== getArmorClass(characterData);

  // GET CHARACTERDATA
  useEffect(() => {
    const characterDocRef = doc(db, `users/${uid}/characters/${id}`);

    // Listen to real-time updates
    const unsubscribe = onSnapshot(characterDocRef, (snapshot) => {
      if (snapshot.exists()) {
        let characterData = snapshot.data() as CharacterData;
        // Make sure legacy characters' class value is converted to an array
        if (typeof characterData.class === "string") {
          characterData.class = [characterData.class];
          // Make sure the string is not two standard classes with a space between them
          if (characterData.class[0].indexOf(" ") > -1) {
            const newArr = characterData.class[0].split(" ");
            // Make sure every value in the array is in the ClassNames enum
            // That way you know if it is a proper combination class and not a custom class with a space.
            if (
              newArr.every((className) =>
                Object.values(ClassNames).includes(className as ClassNames)
              )
            )
              characterData.class = newArr;
          }
        }
        setCharacterData(characterData);
        document.title = `${characterData.name} | CODEX.QUEST`;
      } else {
        console.error("Character not found");
      }
    });

    // Return the unsubscribe function to clean up the listener
    return () => unsubscribe();
  }, [uid, id]);

  return characterData ? (
    <div className={`${outletContext.className} text-shipGray [&>*+*]:mt-4`}>
      <Breadcrumb
        className="print:hidden"
        items={[
          {
            title: (
              <Link aria-label="Go back Home" to="/">
                <HomeOutlined className="mr-2" />
                Home
              </Link>
            ),
          },
          {
            title: (
              <div>
                <SolutionOutlined className="mr-2" />
                {characterData.name}
              </div>
            ),
          },
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
        <div className="flex gap-4 flex-row">
          <Button type="primary" onClick={showCheatSheetModal}>
            Cheat Sheet
          </Button>
          <DiceRoller onClick={showDiceRollerModal} />
        </div>
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
            altValue={
              showMissileAC
                ? getArmorClass(characterData, "missile")
                : undefined
            }
            helpText={`Base AC is 11.\n\nSelect the armor/shield your character is wearing in the Equipment section below.${
              showMissileAC
                ? `\n\nThe smaller number is the AC your character's worn shield provides against **missile attacks**.`
                : ""
            }`}
          />
          {/* MOVEMENT */}
          <SimpleNumberStat
            title="Movement"
            value={`${getMovement(characterData)}'`}
            helpText={`Movement starts at 40' and is affected by how much weight your character is carrying as well as the armor they are wearing.`}
          />
          {/* HIT DICE */}
          <SimpleNumberStat
            title="Hit Dice"
            value={hitDice(
              characterData.level,
              characterData.class,
              characterData.hp.dice
            )}
          />
        </Col>
      </Row>
      <Divider className="print:hidden border-seaBuckthorn" />
      {/* Hide these if using a custom Class */}
      {getClassType(characterData.class) !== "custom" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-2">
          {/* SPECIALS / RESTRICTIONS */}
          <SpecialsRestrictions
            characterData={characterData}
            className="md:col-span-2 row-span-6 print:row-span-2"
          />
          {/* SPECIAL ABILITIES TABLE */}
          {characterData.class.map((cls) => {
            if (classes[cls as ClassNames]?.specialAbilities) {
              return (
                <SpecialAbilitiesTable
                  key={cls}
                  className="md:col-start-3"
                  characterLevel={characterData.level}
                  characterClass={cls}
                  characterRace={characterData.race as RaceNames}
                />
              );
            }
            return null; // Return null if the condition is not met
          })}
          {/* SAVING THROWS */}
          <SavingThrows
            characterData={characterData}
            className="md:col-start-3 print:col-start-2"
          />
        </div>
      ) : (
        <Typography.Text className="text-center block">
          You are using a custom Class. Use the "Bio & Notes" field below to
          calculate your character's Saving Throws, Special Abilities, and
          Restrictions.
        </Typography.Text>
      )}
      <Divider className="border-seaBuckthorn" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* MONEY */}
        <MoneyStats
          characterData={characterData}
          setCharacterData={setCharacterData}
          userIsOwner={userIsOwner}
          makeChange={makeChange}
          className="col-span-1"
        />
        {/* WEIGHT */}
        <WeightStats
          characterData={characterData}
          className="col-span-1 md:col-start-1 lg:col-start-2 lg:col-span-2"
        />
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
          className="col-span-1 md:col-start-2 md:row-start-1 lg:col-start-4 lg:col-span-2 row-span-2"
        />
      </div>
      <Divider className="border-seaBuckthorn" />
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
        setCharacterData={setCharacterData}
      />
      <CheatSheetModal
        handleCancel={handleCancel}
        isCheatSheetModalOpen={isCheatSheetModalOpen}
      />
    </div>
  ) : (
    <Skeleton avatar paragraph={{ rows: 8 }} />
  );
}
