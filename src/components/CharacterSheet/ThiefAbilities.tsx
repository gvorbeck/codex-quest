import { Typography } from "antd";
import { ThiefAbilitiesArray } from "../types";

const thiefAbilitiesTable: ThiefAbilitiesArray = {
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
};

export default function ThiefAbilities({
  characterLevel,
}: {
  characterLevel: string;
}) {
  const abilities = thiefAbilitiesTable[characterLevel];
  return (
    <>
      <Typography.Title level={3} className=" text-shipGray">
        Thief Special Abilities
      </Typography.Title>
      <dl>
        {[
          "Open Locks",
          "Remove Traps",
          "Pick Pockets",
          "Move Silently",
          "Climb Walls",
          "Hide",
          "Listen",
        ].map((skill, index) => (
          <div
            key={skill}
            className="flex w-1/2 justify-between ml-6 items-baseline"
          >
            <dt className="font-bold">{skill}</dt>
            <dd className="m-0 ml-3 mt-3">{abilities[index]}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
