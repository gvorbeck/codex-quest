import React from "react";
import {
  Abilities,
  CharData,
  ClassNames,
  GamePlayerList,
} from "../data/definitions";
import { removePlayerFromGame } from "../support/accountSupport";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { DescriptionsProps } from "antd";
import { classSplit } from "@/support/classSupport";

export function useGameCharacters(players: GamePlayerList): [
  CharData[],
  (gameId: string, userId: string, characterId: string) => Promise<void>,
  (scores: Abilities) => DescriptionsProps["items"],
  (character: CharData) => DescriptionsProps["items"],
  (characters: CharData[]) => {
    showThief: boolean;
    showAssassin: boolean;
    showRanger: boolean;
    showScout: boolean;
  },
] {
  const [characterList, setCharacterList] = React.useState<CharData[]>([]);

  const getCharacter = async (userId: string, characterId: string) => {
    const docRef = doc(db, `users/${userId}/characters/${characterId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as CharData;
    } else {
      console.error("No such document!");
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
  ): DescriptionsProps["items"] => {
    const { level, hp, class: charClass, race } = character;
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
        children: classSplit(charClass).join(", "),
        span: 1,
      },
      { key: "race", label: "Race", children: race, span: 1 },
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
      const classes = classSplit(character.class);
      classAbilities.showThief ||= classes.includes(ClassNames.THIEF);
      classAbilities.showAssassin ||= classes.includes(ClassNames.ASSASSIN);
      classAbilities.showRanger ||= classes.includes(ClassNames.RANGER);
      classAbilities.showScout ||= classes.includes(ClassNames.SCOUT);
    });

    return classAbilities;
  };

  React.useEffect(() => {
    const fetchAllCharacterData = async () => {
      const fetchedData: CharData[] = [];
      for (const player of players) {
        const data = await getCharacter(player.user, player.character);
        if (data) {
          // Add the player's user ID to the character data for stable reference
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

  return [
    characterList,
    removePlayer,
    generateAbilityItems,
    generateDetailItems,
    calculateClassAbilitiesToShow,
  ];
}
