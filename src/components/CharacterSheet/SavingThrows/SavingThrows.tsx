import { Table, Typography, notification } from "antd";
import { camelCaseToTitleCase } from "../../../support/stringSupport";
import { SavingThrowsProps } from "./definitions";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import CloseIcon from "../../CloseIcon/CloseIcon";
import savingThrows from "../../../data/savingThrows";

export default function SavingThrows({ characterData }: SavingThrowsProps) {
  const dataSource: {}[] = [];

  const roller = new DiceRoller();

  let foundThrow = (savingThrows as any)[characterData.class].find(
    (savingThrow: number[]) => savingThrow[0] >= characterData.level
  )[1];

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
      <div>
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
