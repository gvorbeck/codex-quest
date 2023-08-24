import { useEffect, useState } from "react";
import { Divider } from "antd";
import { CharacterHitPointsProps } from "./definitions";
import HomebrewWarning from "../../HomebrewWarning/HomebrewWarning";
import { DiceTypes } from "../../definitions";
import { getClassType } from "../../../support/helpers";
import { ClassNamesTwo, classes } from "../../../data/classes";
import { RaceNamesTwo, races } from "../../../data/races";
import HitPointsRoller from "./HitPointsRoller/HitPointsRoller";
import CustomHitPointsPicker from "./CustomHitPointsPicker/CustomHitPointsPicker";

export default function CharacterHitPoints({
  characterData,
  setCharacterData,
}: CharacterHitPointsProps) {
  const [customHitDice, setCustomHitDice] = useState("");

  useEffect(() => {
    let dice = DiceTypes.D6;

    if (getClassType(characterData.class) === "custom") {
    }
    if (getClassType(characterData.class) === "combination") {
    }
    if (getClassType(characterData.class) === "standard") {
      const classDie = classes[characterData.class as ClassNamesTwo].hitDice;
      const raceData = races[characterData.race as RaceNamesTwo];
      if (
        raceData &&
        raceData.maximumHitDice !== undefined &&
        classDie.split("d")[1] > raceData.maximumHitDice
      ) {
        dice = raceData.maximumHitDice;
      } else {
        dice = classDie as DiceTypes;
      }
    }

    setCharacterData({
      ...characterData,
      hp: {
        ...characterData.hp,
        dice,
      },
    });
  }, []);

  return (
    <>
      {!characterData.class
        .split(" ")
        .some((part) =>
          Object.values(ClassNamesTwo).includes(part as ClassNamesTwo)
        ) && (
        <>
          <CustomHitPointsPicker
            characterData={characterData}
            customHitDice={customHitDice}
            setCharacterData={setCharacterData}
            setCustomHitDice={setCustomHitDice}
          />
          <HomebrewWarning homebrew="Race or Class" />
          <Divider />
        </>
      )}
      <HitPointsRoller
        characterData={characterData}
        setCharacterData={setCharacterData}
        customHitDice={customHitDice}
      />
    </>
  );
}
