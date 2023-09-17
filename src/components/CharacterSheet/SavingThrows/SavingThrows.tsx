import { SavingThrowsProps, SavingThrowsType } from "./definitions";
import { getClassType } from "../../../support/helpers";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import CloseIcon from "../../CloseIcon/CloseIcon";
import { Table, Typography, notification } from "antd";
import { camelCaseToTitleCase } from "../../../support/stringSupport";
import { races } from "../../../data/races";
import { classes } from "../../../data/classes";
import { ClassNames, RaceNames } from "../../../data/definitions";

const roller = new DiceRoller();

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
  const dataSource: {}[] = [];

  const getSavingThrowsForLevel = (characterClass: string) =>
    classes[characterClass as ClassNames].savingThrows.find(
      (savingThrow) => (savingThrow[0] as number) >= characterData.level
    );

  if (getClassType(characterData.class) === "standard") {
    const savingThrowForLevel = getSavingThrowsForLevel(characterData.class[0]);
    baseSavingThrows = savingThrowForLevel
      ? (savingThrowForLevel[1] as SavingThrowsType)
      : defaultSavingThrows;
  } else {
    // Split the combination class into its two components
    const [firstClass, secondClass] = characterData.class;

    // Find the best saving throw for each component class
    let getSavingThrowsForLevelResult = getSavingThrowsForLevel(firstClass);
    const firstClassThrow = getSavingThrowsForLevelResult
      ? (getSavingThrowsForLevelResult[1] as SavingThrowsType)
      : defaultSavingThrows; // Provide a default value if undefined

    getSavingThrowsForLevelResult = getSavingThrowsForLevel(secondClass);
    const secondClassThrow = getSavingThrowsForLevelResult
      ? (getSavingThrowsForLevelResult[1] as SavingThrowsType)
      : defaultSavingThrows; // Provide a default value if undefined

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
  const raceModifiers = races[characterData.race as RaceNames].savingThrows;
  const finalSavingThrows = Object.entries(baseSavingThrows).reduce(
    (prev, [key, value]) => ({
      ...prev,
      [key]:
        value +
        ((raceModifiers && raceModifiers[key as keyof SavingThrowsType]) || 0),
    }),
    {} as SavingThrowsType
  );

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (result: string, specialAbilityTitle: string) => {
    api.open({
      message: `${specialAbilityTitle} Roll`,
      description: result,
      duration: 0,
      className: "bg-seaBuckthorn",
      closeIcon: <CloseIcon />,
    });
  };

  const rollSavingThrow = (score: number, title: string) => {
    const result = roller.roll(`d20`);
    const passFail = result.total >= score ? "Pass" : "Fail";
    openNotification(result.output + " - " + passFail, title);
  };

  Object.entries(finalSavingThrows).forEach(([key, value], index) => {
    dataSource.push({
      key: index + 1,
      throw: camelCaseToTitleCase(key),
      score: value,
    });
  });

  const columns = [
    {
      title: "Saving Throw",
      dataIndex: "throw",
      key: "throw",
      onCell: (record: any) => ({
        onClick: () => rollSavingThrow(record.score, record.throw),
      }),
    },
    {
      title: "Value",
      dataIndex: "score",
      key: "score",
      onCell: (record: any) => ({
        onClick: () => rollSavingThrow(record.score, record.throw),
      }),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className={`${className}`}>
        <Typography.Title level={3} className="mt-0 text-shipGray">
          Saving Throws
        </Typography.Title>
        <Table
          dataSource={dataSource}
          pagination={false}
          showHeader={false}
          columns={columns}
          className="[&_td]:print:p-2 cursor-pointer"
        />
      </div>
    </>
  );
}
