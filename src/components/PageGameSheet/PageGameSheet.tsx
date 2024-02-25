import { User } from "firebase/auth";
import React from "react";
import { useParams } from "react-router-dom";
import { CombatantType, GameData } from "@/data/definitions";
import { fetchDocument } from "@/support/accountSupport";
import { Flex, Skeleton, message } from "antd";
import PlayerList from "./PlayerList/PlayerList";
import GameBinder from "./GameBinder/GameBinder";
import { useMediaQuery } from "react-responsive";
import { mobileBreakpoint } from "@/support/stringSupport";
import classNames from "classnames";
import TurnTracker from "./TurnTracker/TurnTracker";
import Hero from "./Hero/Hero";

interface PageGameSheetProps {
  user: User | null;
}

const PageGameSheet: React.FC<
  PageGameSheetProps & React.ComponentPropsWithRef<"div">
> = ({ className, user }) => {
  const [, contextHolder] = message.useMessage();
  const { uid, id } = useParams();
  const userLoggedIn: User | null = user;
  const userIsOwner = userLoggedIn?.uid === uid;
  const [game, setGame] = React.useState<GameData | null>(null);
  const [turnTrackerExpanded, setTurnTrackerExpanded] = React.useState(false);
  const [showThiefAbilities, setShowThiefAbilities] = React.useState(false);
  const [showAssassinAbilities, setShowAssassinAbilities] =
    React.useState(false);
  const [showRangerAbilities, setShowRangerAbilities] = React.useState(false);
  const [showScoutAbilities, setShowScoutAbilities] = React.useState(false);
  const [hidePlayers, setHidePlayers] = React.useState(false);
  const [combatants, setCombatants] = React.useState<CombatantType[]>([]);
  const isMobile = useMediaQuery({ query: mobileBreakpoint });
  const gameBinderClassNames = classNames(
    { "shrink-0": !isMobile },
    { "w-1/2 ": !isMobile && !hidePlayers },
    { "w-full": !isMobile && hidePlayers },
  );

  const handlePlayersSwitch = (checked: boolean) => {
    setHidePlayers(checked);
  };

  const addToTurnTracker = (
    data: CombatantType,
    type: "player" | "monster",
  ) => {
    if (!data) {
      message.error("addToTurnTracker data is required");
      return;
    }
    if (type !== "player" && type !== "monster") {
      message.error('addToTurnTracker type must be "player" or "monster"');
      return;
    }
    const newCombatant = {
      name: data.name,
      avatar: data.avatar ?? undefined,
      initiative: 0,
    };
    if (type === "player") {
      console.log("player click");
      // If combatant is a player, and they are already in the combatants array, return
      if (combatants.some((c) => c.name === newCombatant.name)) {
        message.warning(`${data.name} is already in the Turn Tracker`);
        return;
      }
    }
    if (type === "monster") {
      console.log("monster click");
    }
    setCombatants((prev) => [...prev, newCombatant]);
    message.success(`${data.name} added to Turn Tracker`);
  };

  React.useEffect(() => {
    const unsubscribe = fetchDocument(uid, id, setGame, "games");
    return () => unsubscribe();
  }, [uid, id]);

  return game ? (
    <>
      {contextHolder}
      <TurnTracker
        className="absolute bottom-0 right-0 z-10"
        turnTrackerExpanded={turnTrackerExpanded}
        setTurnTrackerExpanded={setTurnTrackerExpanded}
        combatants={combatants}
        setCombatants={setCombatants}
      />
      <Hero
        game={game}
        handlePlayersSwitch={handlePlayersSwitch}
        uid={uid}
        gameId={id}
        userIsOwner={userIsOwner}
        setTurnTrackerExpanded={setTurnTrackerExpanded}
      />
      <Flex
        vertical={isMobile}
        gap={16}
        className={className}
        justify="flex-end"
      >
        {uid && id && (
          <>
            <div>
              {!!game.players?.length && (
                <PlayerList
                  players={game.players}
                  setShowThiefAbilities={setShowThiefAbilities}
                  setShowAssassinAbilities={setShowAssassinAbilities}
                  setShowRangerAbilities={setShowRangerAbilities}
                  setShowScoutAbilities={setShowScoutAbilities}
                  gameId={id}
                  userIsOwner={userIsOwner}
                  className={!hidePlayers ? "" : "hidden"}
                  setCombatants={setCombatants}
                  addToTurnTracker={addToTurnTracker}
                />
              )}
            </div>
            {!!game && (
              <GameBinder
                players={game.players}
                showThiefAbilities={showThiefAbilities}
                showAssassinAbilities={showAssassinAbilities}
                showRangerAbilities={showRangerAbilities}
                showScoutAbilities={showScoutAbilities}
                className={gameBinderClassNames}
                gameId={id}
                uid={uid}
                notes={game.notes}
              />
            )}
          </>
        )}
      </Flex>
    </>
  ) : (
    <Skeleton paragraph={{ rows: 8 }} />
  );
};

export default PageGameSheet;
