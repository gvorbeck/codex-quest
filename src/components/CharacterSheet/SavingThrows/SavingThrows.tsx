import {
  SavingThrowsProps,
  SavingThrowsType,
  TableCellRecord,
} from "./definitions";
import {
  getClassType,
  getSavingThrows,
  getSavingThrowsWeight,
} from "../../../support/helpers";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import CloseIcon from "../../CloseIcon/CloseIcon";
import { Table, Typography, notification } from "antd";
import {
  camelCaseToTitleCase,
  titleCaseToCamelCase,
} from "../../../support/stringSupport";
import { races } from "../../../data/races";
import { RaceNames } from "../../../data/definitions";

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
  const classType = getClassType(characterData.class);
  const characterLevel = characterData.level;

  const [api, contextHolder] = notification.useNotification();

  const rollSavingThrow = (score: number, title: string) => {
    const raceModifier =
      races[characterData.race as RaceNames]?.savingThrows?.[
        titleCaseToCamelCase(title) as keyof SavingThrowsType
      ] || 0;
    const result = roller.roll(
      `d20${raceModifier > 0 ? `+${raceModifier}` : ""}`
    );
    const passFail = result.total >= score ? "Pass" : "Fail";
    openNotification(result.output + " - " + passFail, title);
  };

  const openNotification = (result: string, specialAbilityTitle: string) => {
    api.open({
      message: `${specialAbilityTitle} Roll`,
      description: result,
      duration: 0,
      className: "bg-seaBuckthorn",
      closeIcon: <CloseIcon />,
    });
  };

  // Set the default saving throws
  let savingThrows: SavingThrowsType = defaultSavingThrows;
  // if classType is standard, find saving throws for that class
  if (classType === "standard") {
    savingThrows =
      getSavingThrows(characterData.class.join(), characterLevel) ||
      defaultSavingThrows;
    // if classType is combination, find saving throws for each class and use the best
  } else {
    const [firstClass, secondClass] = characterData.class;
    const firstClassSavingThrows = getSavingThrows(firstClass, characterLevel);
    const secondClassSavingThrows = getSavingThrows(
      secondClass,
      characterLevel
    );
    savingThrows =
      getSavingThrowsWeight(firstClassSavingThrows) <=
      getSavingThrowsWeight(secondClassSavingThrows)
        ? firstClassSavingThrows
        : secondClassSavingThrows;
  }

  const dataSource: Array<{ key: number; throw: string; score: number }> = [];
  Object.entries(savingThrows).forEach(([key, value], index) => {
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
      onCell: (record: TableCellRecord) => ({
        onClick: () => rollSavingThrow(record.score, record.throw),
      }),
    },
    {
      title: "Value",
      dataIndex: "score",
      key: "score",
      onCell: (record: TableCellRecord) => ({
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
        <div className="mt-2 ml-3 italic">
          {characterData.abilities.modifiers.constitution !== "+0" && (
            <Typography.Text className="text-shipGray block">
              * Adjust your roll by{" "}
              {characterData.abilities.modifiers.constitution} against{" "}
              <strong>Posion</strong> saving throws.
            </Typography.Text>
          )}
          {characterData.abilities.modifiers.intelligence !== "+0" && (
            <Typography.Text className="text-shipGray block">
              * Adjust your roll by{" "}
              {characterData.abilities.modifiers.intelligence} against
              illusions.
            </Typography.Text>
          )}
          {characterData.abilities.modifiers.wisdom !== "+0" && (
            <Typography.Text className="text-shipGray block">
              * Adjust your roll by {characterData.abilities.modifiers.wisdom}{" "}
              against <strong>charm</strong> spells and other forms of mind
              control.
            </Typography.Text>
          )}
        </div>
      </div>
    </>
  );
}
