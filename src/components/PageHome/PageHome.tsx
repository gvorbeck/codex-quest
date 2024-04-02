import { Spin, Tabs, TabsProps } from "antd";
import React from "react";
import ContentListWrapper from "@/components/ContentListWrapper/ContentListWrapper";
import { CharData, GameData } from "@/data/definitions";
import { fetchCollection } from "@/support/accountSupport";
import { User } from "firebase/auth";
import CardCharacter from "@/components/CardCharacter/CardCharacter";
import CardGame from "@/components/CardGame/CardGame";

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

  const childrenCharacterList = (
    <ContentListWrapper
      loading={charactersLoading}
      loadingContent={<Spin size="large" className="w-full" />}
      className="mx-auto"
    >
      {characters.map((character) => (
        <CardCharacter key={character.id || ""} user={user} item={character} />
      ))}
    </ContentListWrapper>
  );

  const childrenGameList = (
    <ContentListWrapper
      loading={gamesLoading}
      loadingContent={<Spin size="large" className="w-full" />}
    >
      {games.map((game) => (
        <CardGame key={game.id || ""} user={user} item={game} />
      ))}
    </ContentListWrapper>
  );

  const tabsItems: TabsProps["items"] = [
    { key: "1", label: "Characters", children: childrenCharacterList },
    { key: "2", label: "Games", children: childrenGameList },
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
    <Tabs
      size="large"
      defaultActiveKey={selectedKey}
      items={tabsItems}
      onChange={handleTabChange}
    />
  );
};

export default PageHome;
