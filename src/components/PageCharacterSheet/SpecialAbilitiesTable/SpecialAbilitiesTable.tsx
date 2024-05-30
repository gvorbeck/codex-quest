import React from "react";
import { ColumnType } from "antd/es/table";
import { Table } from "antd";
import classNames from "classnames";
import { CharacterDataContext } from "@/store/CharacterContext";
import { useNotification } from "@/hooks/useNotification";
import { rollSpecialAbility } from "@/support/statSupport";

interface SpecialAbilitiesTableProps {
  specialAbilities: {
    stats: number[][];
    titles: string[];
  };
}

interface DataType {
  key: string;
  ability: string;
  percentage: number;
}

interface TableCellRecord {
  percentage: number;
  ability: string;
}

const SpecialAbilitiesTable: React.FC<
  SpecialAbilitiesTableProps & React.ComponentPropsWithRef<"div">
> = ({ className, specialAbilities }) => {
  const { character } = React.useContext(CharacterDataContext);
  const abilitiesValues = specialAbilities.stats[character.level];
  const { contextHolder, openNotification } = useNotification();
  const dataSource: DataType[] = specialAbilities.titles.map(
    (title, index) => ({
      key: title.toLowerCase(),
      ability: title,
      percentage: abilitiesValues[index],
    }),
  );

  const columns: ColumnType<DataType>[] = [
    {
      title: "Ability",
      dataIndex: "ability",
      key: "ability",
      onCell: (record: TableCellRecord) => ({
        onClick: () =>
          rollSpecialAbility(
            record.percentage,
            record.ability,
            openNotification,
          ),
      }),
    },
    {
      title: "Percentage",
      dataIndex: "percentage",
      key: "percentage",
      onCell: (record: TableCellRecord) => ({
        onClick: () =>
          rollSpecialAbility(
            record.percentage,
            record.ability,
            openNotification,
          ),
      }),
    },
  ];
  const tableClassNames = classNames("[&_td]:cursor-pointer", className);
  return (
    <>
      {contextHolder}
      <Table
        className={tableClassNames}
        columns={columns}
        dataSource={dataSource}
        bordered
        pagination={false}
      />
    </>
  );
};

export default SpecialAbilitiesTable;
