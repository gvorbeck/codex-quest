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
import { CharacterData } from "../../components/types";
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
// MODALS
import LevelUpModal from "../../modals/LevelUpModal";
import DiceRollerModal from "../../modals/DiceRollerModal";
import AddEquipmentModal from "../../modals/AddEquipmentModal";
import AddCustomEquipmentModal from "../../modals/AddCustomEquipmentModal";
// DATA
import { hitDiceModifiers } from "../../data/hitDiceModifiers";
import { attackBonusTable } from "../../data/attackBonusTable";
import equipmentItems from "../../data/equipment-items.json";
import { classChoices } from "../../data/classDetails";
// SUPPORT
import { calculateCarryingCapacity } from "../../support/formatSupport";
import { EquipmentItem } from "../../components/EquipmentStore/definitions";
import AttackModal from "../../modals/AttackModal";

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

  const findEquipment = (itemNames: string[]): boolean => {
    if (!characterData) return false;
    return itemNames.some((name) =>
      characterData.equipment.find((item) => item.name === name)
    );
  };

  // ARMOR CLASS (AC)
  const getArmorClass = (characterData: CharacterData) => {
    if (!characterData) return;

    let armorClass = 11;
    let armorAC = 0;
    let shieldAC = 0;

    // armorAC = equipmentItems.filter((item) => item.name === characterData.wearing.armor).AC
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

    if (findEquipment(["No Armor", "Magic Leather Armor"])) {
      return characterData.weight >= carryingCapacity.light ? 40 : 30;
    } else if (findEquipment(["Leather Armor", "Magic Metal Armor"])) {
      return characterData.weight >= carryingCapacity.light ? 30 : 20;
    } else if (findEquipment(["Metal Armor"])) {
      return characterData.weight >= carryingCapacity.light ? 20 : 10;
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
      return { gp: 0, sp: 0, cp: 0 }; // default object when characterData is null/undefined
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
          console.log("Character not found");
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
          />
          {/* HIT DICE */}
          <SimpleNumberStat title="Hit Dice" value={hitDice} />
        </Col>
      </Row>
      <Divider className="print:hidden" />
      {/* Hide these if using a custom Class */}
      {classChoices.includes(characterData.class) ||
      characterData.class.toLowerCase().includes("magic-user") ? (
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
            <SavingThrows
              characterData={characterData}
              setCharacterData={setCharacterData}
            />
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
          <WeightStats
            character={characterData}
            setCharacter={setCharacterData}
          />
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
            attackBonus={getAttackBonus(characterData)}
            updateAC={updateAC}
          />
        </Col>
      </Row>
      <Divider />
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
// // REACT
// import { useEffect, useState } from "react";
// import { useParams, Link, useOutletContext } from "react-router-dom";
// // FIREBASE
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../firebase";
// import { User } from "firebase/auth";
// // ANTD COMPONENTS
// import {
//   Breadcrumb,
//   Button,
//   Col,
//   Collapse,
//   Divider,
//   Row,
//   Skeleton,
//   Typography,
// } from "antd";
// // CHARACTER SHEET COMPONENTS
// import BaseStats from "../../components/CharacterSheet/BaseStats/BaseStats";
// import Description from "../../components/CharacterSheet/CharacterDescription/CharacterDescription";
// import Abilities from "../../components/CharacterSheet/Abilities";
// import AttackBonus from "../../components/CharacterSheet/AttackBonus";
// import HitPoints from "../../components/CharacterSheet/HitPoints";
// import SpecialsRestrictions from "../../components/CharacterSheet/SpecialsRestrictions";
// import SavingThrows from "../../components/CharacterSheet/SavingThrows/SavingThrows";
// import MoneyStats from "../../components/CharacterSheet/MoneyStats/MoneyStats";
// import EquipmentList from "../../components/CharacterSheet/EquipmentList/EquipmentList";
// import Spells from "../../components/CharacterSheet/Spells";
// import InitiativeRoller from "../../components/CharacterSheet/InitiativeRoller";
// import SimpleNumberStat from "../../components/CharacterSheet/SimpleNumberStat/SimpleNumberStat";
// import SpecialAbilitiesTable from "../../components/CharacterSheet/SpecialAbilitiesTable/SpecialAbilitiesTable";
// import WeightStats from "../../components/CharacterSheet/WeightStats/WeightStats";
// import HelpTooltip from "../../components/HelpTooltip/HelpTooltip";
// import DiceRoller from "../../components/DiceRoller/DiceRoller";
// // SUPPORT
// import { calculateCarryingCapacity } from "../../support/formatSupport";
// // DATA
// import { hitDiceModifiers } from "../../data/hitDiceModifiers";
// import { attackBonusTable } from "../../data/attackBonusTable";
// import { classChoices } from "../../data/classDetails";
// // DEFINITIONS
// import { CharacterData, EquipmentItem } from "../../components/types";
// import { CharacterSheetProps } from "./definitions";
// // MODALS
// import AttackModal from "../../modals/AttackModal";
// import LevelUpModal from "../../modals/LevelUpModal";
// import DiceRollerModal from "../../modals/DiceRollerModal";
// import AddEquipmentModal from "../../modals/AddEquipmentModal";
// import AddCustomEquipmentModal from "../../modals/AddCustomEquipmentModal";

// const attackBonus = function (character: CharacterData) {
//   let classes = Object.keys(attackBonusTable);
//   let maxAttackBonus = 0;

//   for (let i = 0; i < classes.length; i++) {
//     if (character && character.class.includes(classes[i])) {
//       let attackBonus = attackBonusTable[classes[i]][character.level];
//       if (attackBonus > maxAttackBonus) {
//         maxAttackBonus = attackBonus;
//       }
//     }
//   }

//   return maxAttackBonus;
// };

// export default function CharacterSheet({ user }: CharacterSheetProps) {
//   const userLoggedIn: User | null = user;
//   const outletContext = useOutletContext() as { className: string };
//   const { uid, id } = useParams();
//   const [character, setCharacter] = useState<CharacterData | null>(null);
//   const [weapon, setWeapon] = useState<EquipmentItem | undefined>(undefined);
//   const [calculatedAC, setCalculatedAC] = useState<number>(0);
//   // MODALS
//   const [isAttackModalOpen, setIsAttackModalOpen] = useState(false);
//   const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
//   const [isAddEquipmentModalOpen, setIsAddEquipmentModalOpen] = useState(false);
//   const [isAddCustomEquipmentModalOpen, setIsAddCustomEquipmentModalOpen] =
//     useState(false);
//   const [isDiceRollerModalOpen, setIsDiceRollerModalOpen] = useState(false);

//   const showAttackModal = () => {
//     setIsAttackModalOpen(true);
//   };

//   const showLevelUpModal = () => {
//     setIsLevelUpModalOpen(true);
//   };

//   const showAddEquipmentModal = () => {
//     setIsAddEquipmentModalOpen(true);
//   };

//   const showAddCustomEquipmentModal = () => {
//     setIsAddCustomEquipmentModalOpen(true);
//   };

//   const showDiceRollerModal = () => {
//     setIsDiceRollerModalOpen(true);
//   };

//   const handleCancel = () => {
//     setIsAttackModalOpen(false);
//     setIsLevelUpModalOpen(false);
//     setIsAddEquipmentModalOpen(false);
//     setIsAddCustomEquipmentModalOpen(false);
//     setIsDiceRollerModalOpen(false);
//   };

//   const userIsOwner = userLoggedIn?.uid === uid;

//   // MOVEMENT
//   let movement;
//   if (character) {
//     const carryingCapacity = calculateCarryingCapacity(
//       +character.abilities.scores.strength,
//       character.race
//     );
//     if (
//       character.equipment.find((item) => item.name === "No Armor") ||
//       character.equipment.find((item) => item.name === "Magic Leather Armor")
//     ) {
//       movement = character.weight >= carryingCapacity.light ? 40 : 30;
//     } else if (
//       character.equipment.find((item) => item.name === "Leather Armor") ||
//       character.equipment.find((item) => item.name === "Magic Metal Armor")
//     ) {
//       movement = character.weight >= carryingCapacity.light ? 30 : 20;
//     } else if (
//       character.equipment.find((item) => item.name === "Metal Armor")
//     ) {
//       movement = character.weight >= carryingCapacity.light ? 20 : 10;
//     }
//   }

//   // HIT DICE
//   let hitDice = "";
//   if (character) {
//     hitDice = character.hp.dice;
//     let modifier = 0;
//     if (!character.class.includes(" ")) {
//       modifier =
//         character.class === "Cleric" || character.class === "Magic-User"
//           ? hitDiceModifiers.single[character.level - 1] || 0
//           : hitDiceModifiers.double[character.level - 1] || 0;
//     }
//     const diceParts = character.hp.dice.split("d")[1].split("+");
//     if (character.level < 10) {
//       hitDice =
//         character.level.toString() +
//         "d" +
//         diceParts[0] +
//         (modifier !== 0 ? "+" + modifier : "");
//     } else {
//       hitDice = "9d" + diceParts[0] + "+" + modifier;
//     }
//   }

//   // GET/SETUP WEARING
//   useEffect(() => {
//     if (character) {
//       if (!character.wearing) {
//         character.wearing = { armor: "", shield: "" };
//         setCalculatedAC(11);
//       } else console.log(character.wearing);
//     }
//   }, []);
//   // if (character) {
//   //   if (!character.wearing) {
//   //     character.wearing = { armor: "", shield: "" };
//   //   }
//   // }

//   // GET CHARACTER
//   useEffect(() => {
//     async function fetchCharacter() {
//       try {
//         const characterDocRef = doc(db, `users/${uid}/characters/${id}`);
//         const characterSnapshot = await getDoc(characterDocRef);

//         if (characterSnapshot.exists()) {
//           const characterData = characterSnapshot.data() as CharacterData;
//           setCharacter(characterData);
//           document.title = `${characterData.name} | CODEX.QUEST`;
//         } else {
//           console.log("Character not found");
//         }
//       } catch (error) {
//         console.error("Error fetching character:", error);
//       }
//     }

//     fetchCharacter();
//   }, [uid, id]);

//   return (
//     <div className={`${outletContext.className}`}>
//       <Breadcrumb
//         className="print:hidden"
//         items={[
//           {
//             title: (
//               <Link aria-label="Go back Home" to="/">
//                 Home
//               </Link>
//             ),
//           },
//           { title: character?.name || "" },
//         ]}
//       />
//       {character ? (
//         <div className="!text-shipGray [&>*]:mt-4 [&>div:first-child]:mt-0">
//           {/* NAME / RACE / CLASS / LEVEL / XP */}
//           <BaseStats
//             character={character}
//             setCharacter={setCharacter}
//             userIsOwner={userIsOwner}
//             showLevelUpModal={showLevelUpModal}
//           />
//           <div className="flex justify-between print:hidden">
//             <InitiativeRoller character={character} />
//             <DiceRoller onClick={showDiceRollerModal} />
//           </div>
//           <Row gutter={32} className="gap-4 md:gap-0 print:block">
//             <Col xs={24} md={8} className="print:w-1/2 float-left mb-4">
//               {/* ABILITY SCORES */}
//               <Abilities character={character} />
//             </Col>
//             <Col
//               xs={24}
//               md={10}
//               className="flex flex-col justify-between print:w-1/2"
//             >
//               {/* ATTACK BONUSES */}
//               <AttackBonus
//                 character={character}
//                 attackBonus={attackBonus(character)}
//               />
//               {/* HIT POINTS */}
//               <HitPoints
//                 character={character}
//                 setCharacter={setCharacter}
//                 userIsOwner={userIsOwner}
//                 className="mt-2"
//               />
//             </Col>
//             <Col
//               xs={24}
//               md={6}
//               className="flex items-center justify-between flex-wrap flex-col gap-4 sm:flex-row md:flex-col print:clear-left"
//             >
//               {/* ARMOR CLASS */}
//               <SimpleNumberStat
//                 title="Armor Class"
//                 value={calculatedAC}
//                 helpText="Base AC is 11. Select the armor your character is wearing in their equipment section below"
//               />
//               {/* MOVEMENT */}
//               <SimpleNumberStat title="Movement" value={`${movement}'`} />
//               {/* HIT DICE */}
//               <SimpleNumberStat title="Hit Dice" value={hitDice} />
//             </Col>
//           </Row>
//           <Divider className="print:hidden" />
//           {/* Hide these if using a custom Class */}
//           {classChoices.includes(character.class) ||
//           character.class.includes("Magic-User") ? (
//             <Row gutter={32} className="gap-4 md:gap-0 print:block">
//               <Col xs={24} md={12} className="print:w-1/2 print:float-left">
//                 {/* SPECIALS / RESTRICTIONS */}
//                 <SpecialsRestrictions character={character} />
//                 {/* THIEF'S ABILITIES */}
//                 {(character.class.includes("Thief") ||
//                   character.class.includes("Assassin")) && (
//                   <SpecialAbilitiesTable
//                     characterLevel={character.level.toString()}
//                     characterClass={
//                       character.class.includes("Thief")
//                         ? "Thief"
//                         : character.class
//                     }
//                   />
//                 )}
//               </Col>
//               <Col xs={24} md={12} className="print:w-1/2 print:float-right">
//                 {/* SAVING THROWS */}
//                 <SavingThrows
//                   character={character}
//                   setCharacter={setCharacter}
//                 />
//               </Col>
//             </Row>
//           ) : (
//             <Typography.Text className="text-center">
//               You are using a custom Class. Use the "Bio & Notes" field below to
//               calculate your character's Saving Throws, Special Abilities, and
//               Restrictions.
//             </Typography.Text>
//           )}
//           <Divider />
//           <Row gutter={32} className="gap-4 md:gap-0 print:block">
//             <Col
//               xs={24}
//               sm={11}
//               md={6}
//               className="print:w-1/2 print:float-left"
//             >
//               {/* MONEY */}
//               <MoneyStats
//                 character={character}
//                 setCharacter={setCharacter}
//                 userIsOwner={userIsOwner}
//               />
//             </Col>
//             <Col
//               xs={24}
//               sm={12}
//               md={6}
//               className="print:w-1/2 print:float-right"
//             >
//               {/* WEIGHT */}
//               <WeightStats character={character} setCharacter={setCharacter} />
//             </Col>
//             <Col xs={24} md={12} className="print:clear-both">
//               {/* EQUIPMENT */}
//               <div className="flex items-baseline gap-4">
//                 <Typography.Title level={3} className="mt-0 text-shipGray">
//                   Equipment
//                 </Typography.Title>
//                 <HelpTooltip text="Adding & removing equipment will automatically modify your gold balance." />
//               </div>
//               <div className="print:hidden flex flex-wrap gap-4">
//                 <Button
//                   type="primary"
//                   disabled={!userIsOwner}
//                   onClick={showAddEquipmentModal}
//                 >
//                   Add/Edit Equipment
//                 </Button>
//                 <Button
//                   type="primary"
//                   disabled={!userIsOwner}
//                   onClick={showAddCustomEquipmentModal}
//                 >
//                   Add Custom Equipment
//                 </Button>
//               </div>
//               <div className="hidden print:block">
//                 {character.equipment.map((item) => (
//                   <div key={item.name}>{item.name}</div>
//                 ))}
//               </div>
//               <Collapse className="bg-seaBuckthorn mt-4 print:hidden">
//                 {/* SPELLS */}
//                 {character.spells.length > 0 && (
//                   <Collapse.Panel
//                     header="Spells"
//                     key="spells"
//                     className="[&>div:not(:first)]:bg-springWood"
//                   >
//                     <Spells character={character} />
//                   </Collapse.Panel>
//                 )}
//                 {/* WEAPONS */}
//                 <Collapse.Panel
//                   header="Weapons"
//                   key="weapons"
//                   className="[&>div:not:first-child]:bg-springWood"
//                 >
//                   <EquipmentList
//                     character={character}
//                     setCharacter={setCharacter}
//                     handleAttack
//                     categories={[
//                       "axes",
//                       "bows",
//                       "daggers",
//                       "swords",
//                       "hammers-and-maces",
//                       "improvised-weapons",
//                       "brawling",
//                       "chain-and-flail",
//                       "hammers-and-maces",
//                       "other-weapons",
//                       "slings-and-hurled-weapons",
//                       "spears-and-polearms",
//                     ]}
//                     attackBonus={attackBonus(character)}
//                     setWeapon={setWeapon}
//                     showAttackModal={showAttackModal}
//                   />
//                 </Collapse.Panel>
//                 {/* MISC ITEMS */}
//                 <Collapse.Panel
//                   header="General Equipment"
//                   key="general-equipment"
//                   className="[&>div:not:first-child]:bg-springWood"
//                 >
//                   <EquipmentList
//                     character={character}
//                     categories={"items"}
//                     setCharacter={setCharacter}
//                   />
//                 </Collapse.Panel>
//                 {/* ARMOR */}
//                 {/* 'armor-and-shields' was an old category that included armor AND shields. Keep for legacy characters. */}
//                 <Collapse.Panel
//                   header="Armor"
//                   key="armor"
//                   className="[&>div:not:first-child]:bg-springWood"
//                 >
//                   <EquipmentList
//                     character={character}
//                     categories={["armor", "armor-and-shields"]}
//                     setCharacter={setCharacter}
//                     calculatedAC={calculatedAC}
//                     setCalculatedAC={setCalculatedAC}
//                     radios
//                   />
//                 </Collapse.Panel>
//                 {/* SHIELDS */}
//                 <Collapse.Panel
//                   header="Shields"
//                   key="shields"
//                   className="[&>div:not:first-child]:bg-springWood"
//                 >
//                   <EquipmentList
//                     character={character}
//                     categories={["shields", "armor-and-shields"]}
//                     setCharacter={setCharacter}
//                     calculatedAC={calculatedAC}
//                     setCalculatedAC={setCalculatedAC}
//                     radios
//                   />
//                 </Collapse.Panel>
//                 {/* BEAST OF BURDEN */}
//                 <Collapse.Panel
//                   header="Beasts of Burden"
//                   key="beasts-of-burden"
//                   className="[&>div:not:first-child]:bg-springWood"
//                 >
//                   <EquipmentList
//                     character={character}
//                     categories={"beasts-of-burden"}
//                     setCharacter={setCharacter}
//                   />
//                 </Collapse.Panel>
//                 {/* Ammunition */}
//                 <Collapse.Panel
//                   header="Ammunition"
//                   key="ammunition"
//                   className="[&>div:not:first-child]:bg-springWood"
//                 >
//                   <EquipmentList
//                     character={character}
//                     categories={"ammunition"}
//                     setCharacter={setCharacter}
//                   />
//                 </Collapse.Panel>
//               </Collapse>
//             </Col>
//           </Row>
//           <Divider />
//           {/* BIO & NOTES */}
//           <Description
//             character={character}
//             setCharacter={setCharacter}
//             userIsOwner={userIsOwner}
//           />
//           {/* MODALS */}
//           <AttackModal
//             isAttackModalOpen={isAttackModalOpen}
//             handleCancel={handleCancel}
//             character={character}
//             attackBonus={attackBonus(character)}
//             weapon={weapon}
//           />
//           <LevelUpModal
//             isLevelUpModalOpen={isLevelUpModalOpen}
//             handleCancel={handleCancel}
//             character={character}
//             hitDice={hitDice}
//             setCharacter={setCharacter}
//           />
//           <AddEquipmentModal
//             isAddEquipmentModalOpen={isAddEquipmentModalOpen}
//             handleCancel={handleCancel}
//             character={character}
//             setCharacter={setCharacter}
//           />
//           <AddCustomEquipmentModal
//             isAddCustomEquipmentModalOpen={isAddCustomEquipmentModalOpen}
//             handleCancel={handleCancel}
//             character={character}
//             setCharacter={setCharacter}
//           />
//           <DiceRollerModal
//             handleCancel={handleCancel}
//             isDiceRollerModalOpen={isDiceRollerModalOpen}
//           />
//         </div>
//       ) : (
//         <Skeleton avatar paragraph={{ rows: 4 }} />
//       )}
//     </div>
//   );
// }
