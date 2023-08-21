import { SavingThrowsProps, SavingThrowsType } from "./definitions";
import savingThrows from "../../../data/savingThrows";
import { RaceNames } from "../../definitions";
import { getClassType } from "../../../support/helpers";

const raceSavingThrowModifiers: Record<RaceNames, Partial<SavingThrowsType>> = {
  [RaceNames.DWARF]: {
    deathRayOrPoison: 4,
    magicWands: 4,
    paralysisOrPetrify: 4,
    dragonBreath: 3,
    spells: 4,
  },
  [RaceNames.ELF]: { paralysisOrPetrify: 1, magicWands: 2, spells: 2 },
  [RaceNames.GNOME]: { deathRayOrPoison: 4, dragonBreath: 3 },
  [RaceNames.HALFLING]: {
    deathRayOrPoison: 4,
    magicWands: 4,
    paralysisOrPetrify: 4,
    dragonBreath: 3,
    spells: 4,
  },
  [RaceNames.HUMAN]: {},
  [RaceNames.CUSTOM]: {},
};

const defaultSavingThrows: SavingThrowsType = {
  deathRayOrPoison: 0,
  magicWands: 0,
  paralysisOrPetrify: 0,
  dragonBreath: 0,
  spells: 0,
};

export default function SavingThrows({
  characterData,
  className,
}: SavingThrowsProps) {
  let baseSavingThrows: SavingThrowsType;

  if (getClassType(characterData.class) === "standard") {
    const savingThrowForLevel = savingThrows[
      characterData.class as keyof typeof savingThrows
    ].find((savingThrow) => (savingThrow[0] as number) >= characterData.level);
    baseSavingThrows = savingThrowForLevel
      ? (savingThrowForLevel[1] as SavingThrowsType)
      : defaultSavingThrows;
  } else {
    // Split the combination class into its two components
    const [firstClass, secondClass] = characterData.class.split(" ");

    // Find the best saving throw for each component class
    const firstClassThrow = savingThrows[
      firstClass as keyof typeof savingThrows
    ].find(
      (savingThrow) => (savingThrow[0] as number) >= characterData.level
    )?.[1] as SavingThrowsType;
    const secondClassThrow = savingThrows[
      secondClass as keyof typeof savingThrows
    ].find(
      (savingThrow) => (savingThrow[0] as number) >= characterData.level
    )?.[1] as SavingThrowsType;

    // Find the best of the two saving throws
    baseSavingThrows = Object.entries(
      firstClassThrow || {}
    ).reduce<SavingThrowsType>(
      (prev, [key, value]) => ({
        ...prev,
        [key]: Math.min(
          value,
          secondClassThrow?.[key as keyof SavingThrowsType] || value
        ),
      }),
      {} as SavingThrowsType
    );
  }

  // Apply race modifiers
  const raceModifier =
    raceSavingThrowModifiers[characterData.race as RaceNames];
  const finalSavingThrows = Object.entries(baseSavingThrows).reduce(
    (prev, [key, value]) => ({
      ...prev,
      [key]: value + (raceModifier[key as keyof SavingThrowsType] || 0),
    }),
    {} as SavingThrowsType
  );

  console.log(finalSavingThrows);

  return <div>hello world</div>;
}

// import { Table, Typography, notification } from "antd";
// import { camelCaseToTitleCase } from "../../../support/stringSupport";
// import { SavingThrowsType, SavingThrowsProps } from "./definitions";
// import { DiceRoller } from "@dice-roller/rpg-dice-roller";
// import CloseIcon from "../../CloseIcon/CloseIcon";
// import savingThrows from "../../../data/savingThrows";
// import { getClassType } from "../../../support/helpers";
// import { RaceNames } from "../../definitions";

// const raceSavingThrowModifiers: Record<RaceNames, Partial<SavingThrowsType>> = {
//   [RaceNames.DWARF]: {
//     deathRayOrPoison: 4,
//     magicWands: 4,
//     paralysisOrPetrify: 4,
//     dragonBreath: 3,
//     spells: 4,
//   },
//   [RaceNames.ELF]: { paralysisOrPetrify: 1, magicWands: 2, spells: 2 },
//   [RaceNames.GNOME]: { deathRayOrPoison: 4, dragonBreath: 3 },
//   [RaceNames.HALFLING]: {
//     deathRayOrPoison: 4,
//     magicWands: 4,
//     paralysisOrPetrify: 4,
//     dragonBreath: 3,
//     spells: 4,
//   },
//   // Humans have no modifiers
//   [RaceNames.HUMAN]: {},
//   // C.Q not obligated to track custom Race modifiers
//   [RaceNames.CUSTOM]: {},
// };

// export default function SavingThrows({
//   characterData,
//   className,
// }: SavingThrowsProps) {
//   const dataSource: {}[] = [];

//   const roller = new DiceRoller();

//   let foundThrow: SavingThrowsType = {
//     deathRayOrPoison: 0,
//     magicWands: 0,
//     paralysisOrPetrify: 0,
//     dragonBreath: 0,
//     spells: 0,
//   };

//   if (getClassType(characterData.class) === "standard") {
//     foundThrow = (savingThrows as any)[characterData.class].find(
//       (savingThrow: number[]) => savingThrow[0] >= characterData.level
//     )[1];
//   } else {
//     // Split the combination class into its two components
//     const [firstClass, secondClass] = characterData.class.split(" ");

//     // Find the best saving throw for each component class
//     const firstClassThrow = (savingThrows as any)[firstClass].find(
//       (savingThrow: number[]) => savingThrow[0] >= characterData.level
//     )[1];
//     const secondClassThrow = (savingThrows as any)[secondClass].find(
//       (savingThrow: number[]) => savingThrow[0] >= characterData.level
//     )[1];

//     // Find the best of the two saving throws
//     foundThrow = Object.entries(firstClassThrow).reduce<SavingThrowsType>(
//       (prev, curr) => {
//         const key = curr[0];
//         const value = curr[1];
//         const secondClassValue = secondClassThrow[key];
//         if ((value as number) < secondClassValue) {
//           return { ...prev, [key]: value };
//         } else {
//           return { ...prev, [key]: secondClassValue };
//         }
//       },
//       {
//         deathRayOrPoison: 0,
//         magicWands: 0,
//         paralysisOrPetrify: 0,
//         dragonBreath: 0,
//         spells: 0,
//       }
//     );
//   }

//   const raceModifier =
//     raceSavingThrowModifiers[
//       characterData.race as keyof typeof raceSavingThrowModifiers
//     ] || {};

//   console.log("Base saving throws:", foundThrow);
//   console.log("Race modifiers:", raceModifier);
//   Object.entries(raceModifier).forEach(([key, value]) => {
//     foundThrow[key as keyof SavingThrowsType] =
//       (foundThrow[key as keyof SavingThrowsType] || 0) + value;
//   });
//   console.log("Final saving throws:", foundThrow);

//   const [api, contextHolder] = notification.useNotification();
//   const openNotification = (result: string, specialAbilityTitle: string) => {
//     api.open({
//       message: `${specialAbilityTitle} Roll`,
//       description: result,
//       duration: 0,
//       className: "bg-seaBuckthorn",
//       closeIcon: <CloseIcon />,
//     });
//   };

//   Object.entries(foundThrow).forEach(([key, value], index) => {
//     dataSource.push({
//       key: index + 1,
//       throw: camelCaseToTitleCase(key),
//       score: value,
//     });
//   });

//   const columns = [
//     {
//       title: "Saving Throw",
//       dataIndex: "throw",
//       key: "throw",
//       onCell: (record: any) => ({
//         onClick: () => rollSavingThrow(record.score, record.throw),
//       }),
//     },
//     {
//       title: "Value",
//       dataIndex: "score",
//       key: "score",
//       onCell: (record: any) => ({
//         onClick: () => rollSavingThrow(record.score, record.throw),
//       }),
//     },
//   ];

//   const rollSavingThrow = (score: number, title: string) => {
//     const result = roller.roll(`d20`);
//     const passFail = result.total >= score ? "Pass" : "Fail";
//     openNotification(result.output + " - " + passFail, title);
//   };

//   return (
//     <>
//       {contextHolder}
//       <div className={`${className}`}>
//         <Typography.Title level={3} className="mt-0 text-shipGray">
//           Saving Throws
//         </Typography.Title>
//         <Table
//           dataSource={dataSource}
//           pagination={false}
//           showHeader={false}
//           columns={columns}
//           className="[&_td]:print:p-2 cursor-pointer"
//         />
//       </div>
//     </>
//   );
// }
