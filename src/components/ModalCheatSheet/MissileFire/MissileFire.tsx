import { Table, Typography } from "antd";

export default function MissileFire() {
  const missileFireDataSource: {
    key: number;
    distance: string;
    ab: string;
  }[] = [];
  const missileFireColumns = [
    { title: "Target distance", dataIndex: "distance", key: "distance" },
    { title: "Attack bonus/penalty", dataIndex: "ab", key: "ab" },
  ];
  [
    { distance: "5' or less", ab: "-5*" },
    { distance: "Up to short range ", ab: "+1" },
    { distance: "Up to medium range", ab: "+0" },
    { distance: "Up to long range", ab: "-2" },
    { distance: "Beyond long range", ab: "Cannot be attacked" },
  ].forEach((item, index) => {
    missileFireDataSource.push({
      key: index + 1,
      distance: item.distance,
      ab: item.ab,
    });
  });

  const coverDataSource: {
    key: number;
    percent: string;
    covered: string;
    concealed: string;
  }[] = [];
  const coverColumns = [
    { title: "Percent", dataIndex: "percent", key: "percent" },
    { title: "Covered", dataIndex: "covered", key: "covered" },
    { title: "Concealed", dataIndex: "concealed", key: "concealed" },
  ];
  [
    { percent: "25%", covered: "-2", concealed: "-1" },
    { percent: "50%", covered: "-4", concealed: "-2" },
    { percent: "75%", covered: "-6", concealed: "-3" },
    { percent: "90%", covered: "-8", concealed: "-4" },
  ].forEach((item, index) => {
    coverDataSource.push({
      key: index + 1,
      percent: item.percent,
      covered: item.covered,
      concealed: item.concealed,
    });
  });

  return (
    <>
      <Table
        dataSource={missileFireDataSource}
        columns={missileFireColumns}
        pagination={false}
      />
      <Typography.Text type="secondary">
        * If the attacker is behind the target creature and undetected, or that
        creature is distracted apply +1 bonus (+3 total bonus if attacking from
        behind)
      </Typography.Text>
      <Typography.Title level={5}>
        Cover and Concealment Penalty
      </Typography.Title>
      <Table
        dataSource={coverDataSource}
        columns={coverColumns}
        pagination={false}
      />
    </>
  );
}
