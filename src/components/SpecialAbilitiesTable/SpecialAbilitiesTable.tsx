import { Table, Typography } from "antd";
import HelpTooltip from "../HelpTooltip/HelpTooltip";
import {
  SpecialAbilitiesTableProps,
  AbilitiesArray,
  CharacterClass,
} from "./definitions";

const abilitiesTable: AbilitiesArray = {
  thief: {
    "1": [25, 20, 30, 25, 80, 10, 30],
    "2": [30, 25, 35, 30, 81, 15, 34],
    "3": [35, 30, 40, 35, 82, 20, 38],
    "4": [40, 35, 45, 40, 83, 25, 42],
    "5": [45, 40, 50, 45, 84, 30, 46],
    "6": [50, 45, 55, 50, 85, 35, 50],
    "7": [55, 50, 60, 55, 86, 40, 54],
    "8": [60, 55, 65, 60, 87, 45, 58],
    "9": [65, 60, 70, 65, 88, 50, 62],
    "10": [68, 63, 74, 68, 89, 53, 65],
    "11": [71, 66, 78, 71, 90, 56, 68],
    "12": [74, 69, 82, 74, 91, 59, 71],
    "13": [77, 72, 86, 77, 92, 62, 74],
    "14": [80, 75, 90, 80, 93, 65, 77],
    "15": [83, 78, 94, 83, 94, 68, 80],
    "16": [84, 79, 95, 85, 95, 69, 83],
    "17": [85, 80, 96, 87, 96, 70, 86],
    "18": [86, 81, 97, 89, 97, 71, 89],
    "19": [87, 82, 98, 91, 98, 72, 92],
    "20": [88, 83, 99, 93, 99, 73, 95],
  },
  assassin: {
    "1": [15, 20, 20, 70, 5, 25, 25],
    "2": [19, 25, 25, 72, 10, 29, 30],
    "3": [23, 30, 30, 74, 15, 33, 35],
    "4": [27, 35, 35, 76, 20, 37, 40],
    "5": [31, 40, 40, 78, 25, 41, 45],
    "6": [35, 45, 45, 80, 30, 45, 50],
    "7": [39, 50, 50, 82, 35, 49, 55],
    "8": [43, 55, 55, 84, 40, 53, 60],
    "9": [47, 60, 60, 86, 45, 57, 65],
    "10": [50, 63, 63, 87, 48, 60, 69],
    "11": [53, 66, 66, 88, 51, 63, 73],
    "12": [56, 69, 69, 89, 54, 66, 77],
    "13": [59, 72, 72, 90, 57, 69, 81],
    "14": [62, 75, 75, 91, 60, 72, 85],
    "15": [65, 78, 78, 92, 63, 75, 89],
    "16": [66, 79, 80, 93, 64, 77, 91],
    "17": [67, 80, 82, 94, 65, 79, 93],
    "18": [68, 81, 84, 95, 66, 81, 95],
    "19": [69, 82, 86, 96, 67, 83, 97],
    "20": [70, 83, 88, 97, 68, 85, 99],
  },
};

const columns = [
  { title: "Skill", dataIndex: "skill", key: "skill" },
  { title: "Percentage", dataIndex: "percentage", key: "percentage" },
];

const abilityNames = {
  thief: [
    "Open Locks",
    "Remove Traps",
    "Pick Pockets",
    "Move Silently",
    "Climb Walls",
    "Hide",
    "Listen",
  ],
  assassin: [
    "Open Locks",
    "Pick Pockets",
    "Move Silently",
    "Climb Walls",
    "Hide",
    "Listen",
    "Poison",
  ],
};

export default function SpecialAbilitiesTable({
  characterLevel,
  characterClass,
}: SpecialAbilitiesTableProps) {
  const dataSource: {}[] = [];
  const abilities = abilitiesTable[characterClass.toLowerCase()][
    characterLevel
  ] as number[];
  abilityNames[characterClass.toLowerCase() as CharacterClass].forEach(
    (skill: string, index: number) => {
      dataSource.push({ key: index + 1, skill, percentage: abilities[index] });
    }
  );

  return (
    <>
      <div className="mt-6 flex items-baseline gap-4">
        <Typography.Title level={3} className="mt-0 text-shipGray">
          {characterClass} Special Abilities
        </Typography.Title>
        <HelpTooltip text="A player must roll their percentile dice with a result less than or equal to the numbers shown below." />
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        showHeader={false}
        size="small"
      />
    </>
  );
}
