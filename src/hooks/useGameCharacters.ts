import React from "react";
import {
  Abilities,
  CharData,
  CharDataAction,
  ClassNames,
  GamePlayerList,
} from "../data/definitions";
import { removePlayerFromGame } from "../support/accountSupport";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { DescriptionsProps } from "antd";
import { getArmorClass, getMovement } from "@/support/statSupport";

export function useGameCharacters(players: GamePlayerList) {
  const [characterList, setCharacterList] = React.useState<CharData[]>([]);

  const getCharacter = async (userId: string, characterId: string) => {
    const docRef = doc(db, `users/${userId}/characters/${characterId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as CharData;
    }
  };

  const removePlayer = async (
    gameId: string,
    userId: string,
    characterId: string,
  ) => {
    await removePlayerFromGame(gameId, userId, characterId);
    setCharacterList((prevCharacterList) =>
      prevCharacterList.filter((character) => character.id !== characterId),
    );
  };

  const generateAbilityItems = (
    scores: Abilities,
  ): DescriptionsProps["items"] => [
    { key: "strength", label: "STR", children: scores.strength, span: 1 },
    {
      key: "intelligence",
      label: "INT",
      children: scores.intelligence,
      span: 1,
    },
    { key: "wisdom", label: "WIS", children: scores.wisdom, span: 1 },
    { key: "dexterity", label: "DEX", children: scores.dexterity, span: 1 },
    {
      key: "constitution",
      label: "CON",
      children: scores.constitution,
      span: 1,
    },
    { key: "charisma", label: "CHA", children: scores.charisma, span: 1 },
  ];

  const generateDetailItems = (
    character: CharData,
    characterDispatch: React.Dispatch<CharDataAction>,
  ): DescriptionsProps["items"] => {
    const { level, hp, race } = character;
    return [
      {
        key: "level",
        label: "Level",
        children: level,
        span: 1,
      },
      {
        key: "hp",
        label: "HP",
        children: `${hp.points} / ${hp.max}`,
        span: 1,
      },
      {
        key: "class",
        label: "Class",
        children: character.class.join(", "),
        span: 1,
      },
      { key: "race", label: "Race", children: race, span: 1 },
      {
        key: "ac",
        label: "AC",
        children: getArmorClass(character, characterDispatch),
        span: 1,
      },
      {
        key: "movement",
        label: "Movement",
        children: getMovement(character),
        span: 1,
      },
    ];
  };

  const calculateClassAbilitiesToShow = (characters: CharData[]) => {
    const classAbilities = {
      showThief: false,
      showAssassin: false,
      showRanger: false,
      showScout: false,
    };

    characters.forEach((character) => {
      classAbilities.showThief ||= character.class.includes(ClassNames.THIEF);
      classAbilities.showAssassin ||= character.class.includes(
        ClassNames.ASSASSIN,
      );
      classAbilities.showRanger ||= character.class.includes(ClassNames.RANGER);
      classAbilities.showScout ||= character.class.includes(ClassNames.SCOUT);
    });

    return classAbilities;
  };

  React.useEffect(() => {
    const fetchAllCharacterData = async () => {
      const fetchedData: CharData[] = [];
      for (const player of players) {
        const data = await getCharacter(player.user, player.character);
        if (data) {
          fetchedData.push({
            ...data,
            userId: player.user,
            charId: player.character,
          });
        }
      }
      setCharacterList(fetchedData);
    };

    fetchAllCharacterData();
  }, [players]);

  return {
    characterList,
    removePlayer,
    generateAbilityItems,
    generateDetailItems,
    calculateClassAbilitiesToShow,
  };
}
