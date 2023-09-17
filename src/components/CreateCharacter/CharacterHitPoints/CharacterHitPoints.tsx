import { useEffect, useState } from "react";
import { Divider } from "antd";
import { CharacterHitPointsProps } from "./definitions";
import HomebrewWarning from "../../HomebrewWarning/HomebrewWarning";
import { getClassType } from "../../../support/helpers";
import { classes } from "../../../data/classes";
import { RaceNamesTwo, races } from "../../../data/races";
import HitPointsRoller from "./HitPointsRoller/HitPointsRoller";
import CustomHitPointsPicker from "./CustomHitPointsPicker/CustomHitPointsPicker";
import { ClassNamesTwo } from "../../../data/definitions";
import { DiceTypes } from "../../../data/definitions";

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
      // Initialize a variable to hold the largest die
      let largestDie = "d4";

      // Iterate through each class and find the largest die
      characterData.class.forEach((part) => {
        const classDie = classes[part as ClassNamesTwo].hitDice;
        if (classDie.split("d")[1] > largestDie.split("d")[1]) {
          largestDie = classDie;
        }
      });

      // Check for raceData.maximumHitDice and compare with the largest die
      const raceData = races[characterData.race as RaceNamesTwo];
      if (
        raceData &&
        raceData.maximumHitDice !== undefined &&
        largestDie.split("d")[1] > raceData.maximumHitDice.split("d")[1]
      ) {
        dice = raceData.maximumHitDice;
      } else {
        dice = largestDie as DiceTypes;
      }
    }
    if (getClassType(characterData.class) === "standard") {
      const classDie = classes[characterData.class[0] as ClassNamesTwo].hitDice;
      const raceData = races[characterData.race as RaceNamesTwo];
      if (
        raceData &&
        raceData.maximumHitDice !== undefined &&
        classDie.split("d")[1] > raceData.maximumHitDice.split("d")[1]
      ) {
        dice = raceData.maximumHitDice;
      } else {
        dice = classDie as DiceTypes;
      }
    }
    // If Race increments Class's Hit Die (Half-Ogre)
    if (races[characterData.race as RaceNamesTwo]?.incrementHitDie) {
      let index = Object.values(DiceTypes).indexOf(dice);

      // Increment the index, but make sure it doesn't exceed the bounds of the enum
      index = Math.min(index + 1, Object.values(DiceTypes).length - 1);

      // Assign the new dice value from the `DiceTypes` enum
      dice = Object.values(DiceTypes)[index] as DiceTypes;
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
      {!characterData.class.some((part) =>
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
