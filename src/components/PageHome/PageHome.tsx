import { Spin, Tabs, TabsProps } from "antd";
import React from "react";
import ContentListWrapper from "@/components/ContentListWrapper/ContentListWrapper";
import { CharData, GameData } from "@/data/definitions";
import { fetchCollection } from "@/support/accountSupport";
import { User } from "firebase/auth";
import CardCharacter from "@/components/CardCharacter/CardCharacter";
import CardGame from "@/components/CardGame/CardGame";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";

interface PageHomeProps {
  user: User | null;
  selectedKey: string;
  handleTabChange: (key: string) => void;
}

const PageHome: React.FC<PageHomeProps> = ({
  user,
  selectedKey,
  handleTabChange,
}) => {
  const [characters, setCharacters] = React.useState<CharData[]>([]);
  const [games, setGames] = React.useState<GameData[]>([]);
  const [charactersLoading, setCharactersLoading] =
    React.useState<boolean>(true);
  const [gamesLoading, setGamesLoading] = React.useState<boolean>(true);
  const spin = <Spin size="large" className="w-full h-full py-4" />;

  const childrenCharacterList = (
    <ContentListWrapper
      loading={charactersLoading}
      loadingContent={spin}
      className="mx-auto"
    >
      {characters.map((character, index) => (
        <div
          key={character.id || ""}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardCharacter user={user} item={character} />
        </div>
      ))}
    </ContentListWrapper>
  );

  const childrenGameList = (
    <ContentListWrapper loading={gamesLoading} loadingContent={spin}>
      {games.map((game, index) => (
        <div
          key={game.id || ""}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardGame user={user} item={game} />
        </div>
      ))}
    </ContentListWrapper>
  );

  const tabItemClassNames =
    "px-2 py-1 bg-gradient-to-r from-seaBuckthorn to-california text-shipGray text-xs rounded-full font-bold shadow-sm";

  const tabsItems: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-2 font-medium">
          <UserOutlined />
          Characters
          {characters.length > 0 && (
            <span className={tabItemClassNames}>{characters.length}</span>
          )}
        </span>
      ),
      children: childrenCharacterList,
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-2 font-medium">
          <TeamOutlined />
          Games
          {games.length > 0 && (
            <span className={tabItemClassNames}>{games.length}</span>
          )}
        </span>
      ),
      children: childrenGameList,
    },
  ];

  React.useEffect(() => {
    fetchCollection(
      user,
      "characters",
      setCharacters,
      setCharactersLoading,
      "Home",
    );
    fetchCollection(user, "games", setGames, setGamesLoading, "Home");
  }, [user]);

  return (
    <div className="space-y-6">
      <Tabs
        size="large"
        defaultActiveKey={selectedKey}
        items={tabsItems}
        onChange={handleTabChange}
      />
    </div>
  );
};

export default PageHome;
