import { ColumnType } from "antd/es/table";
import React from "react";
import { Table } from "antd";
import { camelCaseToTitleCase } from "@/support/stringSupport";
import classNames from "classnames";
import { CharacterDataContext } from "@/contexts/CharacterContext";
import { useNotification } from "@/hooks/useNotification";
import { classSplit } from "@/support/classSupport";
import { rollSavingThrow } from "@/support/diceSupport";
import { getBestSavingThrowList } from "@/support/statSupport";

interface DataType {
  key: number;
  throw: string;
  score: number;
}

interface TableCellRecord {
  score: number;
  throw: string;
}

const SavingThrows: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  const { character } = React.useContext(CharacterDataContext);
  const { level, class: charClass, race } = character;
  const savingThrows = getBestSavingThrowList(classSplit(charClass), level);
  const dataSource: Array<{ key: number; throw: string; score: number }> = [];
  const { contextHolder, openNotification } = useNotification();
  Object.entries(savingThrows).forEach(([key, value], index) => {
    dataSource.push({
      key: index + 1,
      throw: camelCaseToTitleCase(key),
      score: value,
    });
  });

  const columns: ColumnType<DataType>[] = [
    {
      title: "Throw",
      dataIndex: "throw",
      key: "throw",
      onCell: (record: TableCellRecord) => ({
        onClick: () =>
          rollSavingThrow(record.score, record.throw, race, openNotification),
      }),
    },
    { title: "Score", dataIndex: "score", key: "score" },
  ];
  const tableClassNames = classNames("[&_td]:cursor-pointer", className);
  return (
    <>
      {contextHolder}
      <Table
        className={tableClassNames}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
      />
    </>
  );
};

export default SavingThrows;
