import { Table, Typography, notification } from "antd";
import { camelCaseToTitleCase } from "../../../support/stringSupport";
import { SavingThrowsProps } from "./definitions";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import CloseIcon from "../../CloseIcon/CloseIcon";
import savingThrows from "../../../data/savingThrows";
import { getClassType } from "../../../support/helpers";

export default function SavingThrows({
  characterData,
  className,
}: SavingThrowsProps) {
  const dataSource: {}[] = [];

  const roller = new DiceRoller();

  let foundThrow;

  if (getClassType(characterData.class) === "standard") {
    foundThrow = (savingThrows as any)[characterData.class].find(
      (savingThrow: number[]) => savingThrow[0] >= characterData.level
    )[1];
  } else {
    // Split the combination class into its two components
    const [firstClass, secondClass] = characterData.class.split(" ");

    // Find the best saving throw for each component class
    const firstClassThrow = (savingThrows as any)[firstClass].find(
      (savingThrow: number[]) => savingThrow[0] >= characterData.level
    )[1];
    const secondClassThrow = (savingThrows as any)[secondClass].find(
      (savingThrow: number[]) => savingThrow[0] >= characterData.level
    )[1];

    // Find the best of the two saving throws
    foundThrow = Object.entries(firstClassThrow).reduce((prev, curr) => {
      const key = curr[0];
      const value = curr[1];
      const secondClassValue = secondClassThrow[key];

      if ((value as number) < secondClassValue) {
        return { ...prev, [key]: value };
      } else {
        return { ...prev, [key]: secondClassValue };
      }
    }, {});
  }

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

  Object.entries(foundThrow).forEach(([key, value], index) => {
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

  const rollSavingThrow = (score: number, title: string) => {
    const result = roller.roll(`d20`);
    const passFail = result.total >= score ? "Pass" : "Fail";
    openNotification(result.output + " - " + passFail, title);
  };

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
