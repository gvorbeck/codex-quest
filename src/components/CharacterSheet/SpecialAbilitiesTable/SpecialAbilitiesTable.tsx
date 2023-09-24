import { Table, Typography, notification } from "antd";
import HelpTooltip from "../../HelpTooltip/HelpTooltip";
import { SpecialAbilitiesTableProps } from "./definitions";
import { toTitleCase } from "../../../support/stringSupport";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import CloseIcon from "../../CloseIcon/CloseIcon";
import { classes } from "../../../data/classes";
import { ClassNames } from "../../../data/definitions";
import React from "react";
import SpecialAbilitiesFootnotes from "./SpecialAbilitiesFootnotes/SpecialAbilitiesFootnotes";

export default function SpecialAbilitiesTable({
  characterLevel,
  characterClass,
  characterRace,
  className,
}: SpecialAbilitiesTableProps & React.ComponentPropsWithRef<"div">) {
  const dataSource: {}[] = [];

  const abilities =
    classes[characterClass as ClassNames].specialAbilities?.stats[
      characterLevel
    ] || [];

  classes[characterClass as ClassNames].specialAbilities?.titles.forEach(
    (skill: string, index: number) => {
      dataSource.push({ key: index + 1, skill, percentage: abilities[index] });
    }
  );

  const columns = [
    {
      title: "Skill",
      dataIndex: "skill",
      key: "skill",
      onCell: (record: any) => ({
        onClick: () => rollSpecialAbility(record.percentage, record.skill),
      }),
    },
    {
      title: "Percentage",
      dataIndex: "percentage",
      key: "percentage",
      onCell: (record: any) => ({
        onClick: () => rollSpecialAbility(record.percentage, record.skill),
      }),
    },
  ];

  const roller = new DiceRoller();
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
  const rollSpecialAbility = (
    specialAbilityScore: number,
    specialAbilityTitle: string
  ) => {
    const result = roller.roll(`d%`);
    const passFail = result.total <= specialAbilityScore ? "Pass" : "Fail";
    openNotification(result.output + " - " + passFail, specialAbilityTitle);
  };

  return (
    <>
      {contextHolder}
      <div className={className}>
        <div className={`flex items-baseline gap-4`}>
          <Typography.Title level={3} className="mt-0 text-shipGray">
            {toTitleCase(characterClass)} Special Abilities
          </Typography.Title>
          <HelpTooltip text="A player must roll their percentile dice with a result less than or equal to the numbers shown below. Click the rows to automatically roll for each special ability." />
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          showHeader={false}
          size="small"
          className="cursor-pointer"
        />
        <SpecialAbilitiesFootnotes
          characterRace={characterRace}
          characterClass={characterClass as ClassNames}
        />
      </div>
    </>
  );
}
