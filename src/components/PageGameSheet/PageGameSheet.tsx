import { User } from "firebase/auth";
import React from "react";
import { useParams } from "react-router-dom";
import { GameData } from "@/data/definitions";
import { fetchDocument } from "@/support/accountSupport";
import { Breadcrumb, BreadcrumbProps, Flex, Skeleton } from "antd";
import PlayerList from "./PlayerList/PlayerList";
import GameBinder from "./GameBinder/GameBinder";
import { useMediaQuery } from "react-responsive";
import { mobileBreakpoint } from "@/support/stringSupport";
import classNames from "classnames";
import BreadcrumbHomeLink from "@/components/BreadcrumbHomeLink/BreadcrumbHomeLink";
import { TeamOutlined } from "@ant-design/icons";
import AddPlayerForm from "./PlayerList/AddPlayerForm/AddPlayerForm";

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
  const [showThiefAbilities, setShowThiefAbilities] = React.useState(false);
  const [showAssassinAbilities, setShowAssassinAbilities] =
    React.useState(false);
  const [showRangerAbilities, setShowRangerAbilities] = React.useState(false);
  const [showScoutAbilities, setShowScoutAbilities] = React.useState(false);
  const isMobile = useMediaQuery({ query: mobileBreakpoint });
  const addPlayerFormClassNames = classNames({
    "w-1/2": !game?.players.length,
  });
  const gameBinderClassNames = classNames({ "w-1/2 shrink-0": !isMobile });

  const breadcrumbItems: BreadcrumbProps["items"] = [
    {
      title: <BreadcrumbHomeLink />,
    },
    {
      title: (
        <div>
          <TeamOutlined className="mr-2" />
          <span>{game?.name}</span>
        </div>
      ),
    },
  ];

  React.useEffect(() => {
    const unsubscribe = fetchDocument(uid, id, setGame, "games");
    return () => unsubscribe();
  }, [uid, id]);

  return game ? (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <Flex
        vertical={isMobile}
        gap={16}
        className={className}
        justify="flex-end"
      >
        {uid && id && (
          <>
            <div className={addPlayerFormClassNames}>
              <AddPlayerForm
                gmId={uid}
                gameId={id}
                userIsOwner={userIsOwner}
                className="mb-4"
              />
              {!!game.players.length && (
                <PlayerList
                  players={game.players}
                  setShowThiefAbilities={setShowThiefAbilities}
                  setShowAssassinAbilities={setShowAssassinAbilities}
                  setShowRangerAbilities={setShowRangerAbilities}
                  setShowScoutAbilities={setShowScoutAbilities}
                  gameId={id}
                  userIsOwner={userIsOwner}
                />
              )}
            </div>
            {!!game.players.length && (
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
