import React from "react";
import Hero from "./Hero/Hero";
import { useParams } from "react-router-dom";
import { User } from "firebase/auth";
import { fetchDocument } from "@/support/accountSupport";
import {
  CharData,
  CombatantType,
  CombatantTypes,
  GameData,
} from "@/data/definitions";
import PlayerList from "./PlayerList/PlayerList";
import { Flex, Skeleton, message } from "antd";
import { getArmorClass } from "@/support/statSupport";
import { useCharacterData } from "@/hooks/useCharacterData";
import { GameDataContext } from "@/store/GameDataContext";
import GameBinder from "./GameBinder/GameBinder";
import RoundTracker from "./TurnTracker/RoundTracker";
import { useDeviceType } from "@/hooks/useDeviceType";

interface PageGameSheetProps {
  user: User | null;
}

const PageGameSheet: React.FC<PageGameSheetProps> = ({ user }) => {
  const [hideCharacters, setHideCharacters] = React.useState(false);
  const [roundTrackerOpen, setRoundTrackerOpen] = React.useState(false);
  const [game, setGame] = React.useState<GameData | null>(null);
  const [combatants, setCombatants] = React.useState<CombatantType[]>([]);

  const { userId, gameId } = useParams();
  const { characterDispatch } = useCharacterData(user);
  const { isMobile, isTablet } = useDeviceType();

  const userLoggedIn: User | null = user;
  const userIsOwner = userLoggedIn?.uid === userId;

  const addToTurnTracker = (
    data: CombatantType | CharData,
    type: CombatantTypes,
  ) => {
    if (!data) {
      message.error("addToTurnTracker data is required");
      return;
    }
    if (type !== "player" && type !== "monster") {
      message.error('addToTurnTracker type must be "player" or "monster"');
      return;
    }
    const newCombatant: CombatantType = {
      name: data.name,
      avatar: data.avatar ?? undefined,
      initiative: 0,
      type,
      tags: [],
    };
    if (type === "player") {
      // If combatant is a player, and they are already in the combatants array, return
      if (combatants?.some((c) => c.name === newCombatant.name)) {
        message.warning(`${data.name} is already in the Round Tracker`);
        return;
      }
      newCombatant.ac = getArmorClass(data as CharData, characterDispatch);
    }
    // if (type === "monster") {}
    if (combatants) setCombatants([...combatants, newCombatant]);
    message.success(`${data.name} added to Round Tracker`);
  };

  const characterList = () => {
    return (
      <PlayerList
        players={game?.players ?? []}
        className={hideCharacters ? "hidden" : ""}
      />
    );
  };

  function handleRoundTrackerOpen() {
    setRoundTrackerOpen(true);
  }

  function handleRoundTrackerClose() {
    setRoundTrackerOpen(false);
  }

  function handlePlayersSwitch(checked: boolean) {
    console.log("checked", checked);
    setHideCharacters(checked);
  }

  React.useEffect(() => {
    const unsubscribe = fetchDocument(
      userId,
      gameId,
      (fetchedGame) => {
        setGame(fetchedGame.payload);
      },
      "games",
    );

    return () => unsubscribe();
    // userId and gameId will not change during the lifetime of the component so they are not needed as dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return game ? (
    <GameDataContext.Provider
      value={{
        addToTurnTracker,
        userIsOwner,
        gameId,
        userId,
        user,
        combatants,
        setCombatants,
      }}
    >
      <RoundTracker
        className="absolute bottom-0 right-0 z-10"
        roundTrackerOpen={roundTrackerOpen}
        handleRoundTrackerClose={handleRoundTrackerClose}
      />
      <Hero
        handlePlayersSwitch={handlePlayersSwitch}
        handleRoundTrackerOpen={handleRoundTrackerOpen}
        name={game.name}
      />
      <Flex
        gap={16}
        className={isMobile || isTablet ? "" : "[&>*]:flex-1 [&>*]:w-1/2"}
        vertical={isMobile || isTablet}
      >
        {characterList()}
        <GameBinder game={game} />
      </Flex>
    </GameDataContext.Provider>
  ) : (
    <Skeleton paragraph={{ rows: 8 }} />
  );
};

export default PageGameSheet;
