import { Abilities, CharData } from "@/data/definitions";
import { Button, Descriptions, Flex, Table, TableProps } from "antd";
import AbilityRoller from "./AbilityRoller/AbilityRoller";
import { useDeviceType } from "@/hooks/useDeviceType";

interface StepAbilitiesProps {
  character: CharData;
  setCharacter: React.Dispatch<React.SetStateAction<CharData>>;
  newCharacter?: boolean;
}

const StepAbilities: React.FC<
  StepAbilitiesProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter }) => {
  const { isMobile } = useDeviceType();
  const dataSource: TableProps["dataSource"] = [
    {
      key: "1",
      label: "STR",
      ability: "Strength",
      score: Number(character.abilities?.scores.strength) || 0,
      modifier: character.abilities?.modifiers?.strength || "",
    },
    {
      key: "2",
      label: "INT",
      ability: "Intelligence",
      score: Number(character.abilities?.scores.intelligence) || 0,
      modifier: character.abilities?.modifiers?.intelligence || "",
    },
    {
      key: "3",
      label: "WIS",
      ability: "Wisdom",
      score: Number(character.abilities?.scores.wisdom) || 0,
      modifier: character.abilities?.modifiers?.wisdom || "",
    },
    {
      key: "4",
      label: "DEX",
      ability: "Dexterity",
      score: Number(character.abilities?.scores.dexterity) || 0,
      modifier: character.abilities?.modifiers?.dexterity || "",
    },
    {
      key: "5",
      label: "CON",
      ability: "Constitution",
      score: Number(character.abilities?.scores.constitution) || 0,
      modifier: character.abilities?.modifiers?.constitution || "",
    },
    {
      key: "6",
      label: "CHA",
      ability: "Charisma",
      score: Number(character.abilities?.scores.charisma) || 0,
      modifier: character.abilities?.modifiers?.charisma || "",
    },
  ];

  const columns: TableProps["columns"] = [
    {
      title: "Ability",
      dataIndex: "label",
    },
    {
      title: "Score",
      dataIndex: "score",
      render: (
        _,
        record: {
          key: string;
          label: string;
          ability: string;
          score: number;
          modifier: string;
        },
        index: number,
      ) => {
        const abilityKey = record.ability.toLowerCase();

        return (
          <AbilityRoller
            character={character}
            setCharacter={setCharacter}
            ability={abilityKey as keyof Abilities}
            newCharacter
          />
        );
      },
      //         const abilityKey = record.ability.toLowerCase();
      //         let abilityValue = 0;
      //         if (isAbilityKey(abilityKey, character)) {
      //           abilityValue =
      //             +character.abilities.scores[
      //               abilityKey as keyof typeof character.abilities.scores
      //             ];
      //         }

      //         return (
      //           <AbilityRoller
      //             abilityValue={abilityValue}
      //             record={record}
      //             character={character}
      //             setCharacter={setCharacter}
      //             newCharacter={newCharacter}
      //           />
      //         );
    },
    {
      title: "Modifier",
      dataIndex: "modifier",
    },
  ];

  return (
    <Flex vertical className={className} gap={16}>
      {/* {!hideRollAll && (
         <Flex gap={16} align="center" justify="flex-start">
           <Button
             type="primary"
             onClick={rollAllAbilities}
             className="self-start"
           >
             Roll All Abilities
           </Button>
           {areAllAbilitiesSet(character?.abilities?.scores) && (
             <>
               <Descriptions
                 className="[&_td]:p-0 inline-block"
                 items={abilityTotalItems}
               />
               <Button
                 onClick={() => flipAbilityScores(character, setCharacter)}
               >
                 Flip 'Em
               </Button>
             </>
           )}
         </Flex>
       )} */}
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        size={isMobile ? "small" : "large"}
        bordered
        className="w-fit"
      />
    </Flex>
  );
};

export default StepAbilities;

// import { Button, Descriptions, DescriptionsProps, Flex, Table } from "antd";
// import React from "react";
// import { AbilityRecord, CharData } from "@/data/definitions";
// import AbilityRoller from "./AbilityRoller/AbilityRoller";
// import { rollDice } from "@/support/diceSupport";
// import { getModifier, isAbilityKey } from "@/support/statSupport";
// import {
//   areAllAbilitiesSet,
//   flipAbilityScores,
//   getAbilitiesDataSource,
//   getAbilityTotalItems,
//   updateCharacter,
// } from "@/support/pageNewCharacterSupport";

// interface StepAbilitiesProps {
//   character: CharData;
//   setCharacter: (character: CharData) => void;
//   setComboClass?: (comboClass: boolean) => void;
//   setComboClassSwitch?: (comboClassSwitch: boolean) => void;
//   hideRollAll?: boolean;
//   newCharacter?: boolean;
// }

// const StepAbilities: React.FC<
//   StepAbilitiesProps & React.ComponentPropsWithRef<"div">
// > = ({ className, character, setCharacter, hideRollAll, newCharacter }) => {
//   const dataSource = getAbilitiesDataSource(character);
//   const columns = [
//     {
//       title: "Ability",
//       dataIndex: "label",
//       key: "ability",
//     },
//     {
//       title: "Score",
//       dataIndex: "score",
//       key: "score",
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       render: (_text: string, record: AbilityRecord, _index: number) => {
//         const abilityKey = record.ability.toLowerCase();
//         let abilityValue = 0;
//         if (isAbilityKey(abilityKey, character)) {
//           abilityValue =
//             +character.abilities.scores[
//               abilityKey as keyof typeof character.abilities.scores
//             ];
//         }

//         return (
//           <AbilityRoller
//             abilityValue={abilityValue}
//             record={record}
//             character={character}
//             setCharacter={setCharacter}
//             newCharacter={newCharacter}
//           />
//         );
//       },
//     },
//     {
//       title: "Modifier",
//       dataIndex: "modifier",
//       key: "modifier",
//     },
//   ];

//   const rollAllAbilities = () => {
//     const abilities = [
//       "strength",
//       "intelligence",
//       "wisdom",
//       "dexterity",
//       "constitution",
//       "charisma",
//     ];
//     const newScores: Record<string, number> = {};
//     const newModifiers: Record<string, string> = {};
//     abilities.forEach((ability) => {
//       const score = rollDice("3d6");
//       newScores[ability] = score;
//       newModifiers[ability] = getModifier(score);
//     });
//     updateCharacter(
//       newScores,
//       newModifiers,
//       character,
//       setCharacter,
//       newCharacter,
//     );
//   };

//   const abilityTotalItems: DescriptionsProps["items"] =
//     getAbilityTotalItems(character);

//   return (
//     <Flex vertical className={className} gap={16}>
//       {!hideRollAll && (
//         <Flex gap={16} align="center" justify="flex-start">
//           <Button
//             type="primary"
//             onClick={rollAllAbilities}
//             className="self-start"
//           >
//             Roll All Abilities
//           </Button>
//           {areAllAbilitiesSet(character?.abilities?.scores) && (
//             <>
//               <Descriptions
//                 className="[&_td]:p-0 inline-block"
//                 items={abilityTotalItems}
//               />
//               <Button
//                 onClick={() => flipAbilityScores(character, setCharacter)}
//               >
//                 Flip 'Em
//               </Button>
//             </>
//           )}
//         </Flex>
//       )}
//       <Table
//         dataSource={dataSource}
//         columns={columns}
//         pagination={false}
//         size="small"
//         bordered
//       />
//     </Flex>
//   );
// };

// export default StepAbilities;
