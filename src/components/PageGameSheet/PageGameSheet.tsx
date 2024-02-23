import { User } from "firebase/auth";
import React from "react";
import { useParams } from "react-router-dom";
import { GameData } from "@/data/definitions";
import { fetchDocument } from "@/support/accountSupport";
import { Flex, Skeleton } from "antd";
import PlayerList from "./PlayerList/PlayerList";
import GameBinder from "./GameBinder/GameBinder";
import { useMediaQuery } from "react-responsive";
import { mobileBreakpoint } from "@/support/stringSupport";
import classNames from "classnames";
import CombatTracker from "./CombatTracker/CombatTracker";
import Hero from "./Hero/Hero";

interface PageGameSheetProps {
  user: User | null;
}

const PageGameSheet: React.FC<
  PageGameSheetProps & React.ComponentPropsWithRef<"div">
> = ({ className, user }) => {
  const { uid, id } = useParams();
  const userLoggedIn: User | null = user;
  const userIsOwner = userLoggedIn?.uid === uid;
  const [game, setGame] = React.useState<GameData | null>(null);
  const [combatTrackerExpanded, setCombatTrackerExpanded] =
    React.useState(false);
  const [showThiefAbilities, setShowThiefAbilities] = React.useState(false);
  const [showAssassinAbilities, setShowAssassinAbilities] =
    React.useState(false);
  const [showRangerAbilities, setShowRangerAbilities] = React.useState(false);
  const [showScoutAbilities, setShowScoutAbilities] = React.useState(false);
  const [hidePlayers, setHidePlayers] = React.useState(false);
  const isMobile = useMediaQuery({ query: mobileBreakpoint });
  const gameBinderClassNames = classNames(
    { "shrink-0": !isMobile },
    { "w-1/2 ": !isMobile && !hidePlayers },
    { "w-full": !isMobile && hidePlayers },
  );

  const handlePlayersSwitch = (checked: boolean) => {
    setHidePlayers(checked);
  };

  React.useEffect(() => {
    const unsubscribe = fetchDocument(uid, id, setGame, "games");
    return () => unsubscribe();
  }, [uid, id]);

  return game ? (
    <>
      <CombatTracker
        className="absolute bottom-0 right-0 z-10"
        combatTrackerExpanded={combatTrackerExpanded}
        setCombatTrackerExpanded={setCombatTrackerExpanded}
      />
      <Hero
        game={game}
        handlePlayersSwitch={handlePlayersSwitch}
        uid={uid}
        gameId={id}
        userIsOwner={userIsOwner}
        setCombatTrackerExpanded={setCombatTrackerExpanded}
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
