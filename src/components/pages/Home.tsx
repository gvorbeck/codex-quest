import { useLocation } from "wouter";
import { Card, Typography } from "@/components/ui";
import { FABGroup } from "@/components/ui/inputs/FloatingActionButton";
import {
  Icon,
  TextHeader,
  List,
  FeatureListItem,
} from "@/components/ui/display";
import { PageWrapper } from "@/components/ui/layout";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@/components/ui/layout/Tabs";
import { CharactersList } from "@/components/character/management";
import { GamesList } from "@/components/game/management";
import { useAuth, useCharacters } from "@/hooks";

function Home() {
  const { user } = useAuth();
  const { characters, loading } = useCharacters();
  const [, setLocation] = useLocation();

  const hasCharacters = characters.length > 0;
  const showWelcomeContent = !user || (!hasCharacters && !loading);

  return (
    <PageWrapper>
      <section className="space-y-8">
        {/* Show character list for authenticated users */}
        {user && (
          <Card variant="standard">
            <Tabs defaultValue="characters" variant="underline">
              <TabList aria-label="Main navigation">
                <Tab value="characters">Characters</Tab>
                <Tab value="games">Games</Tab>
              </TabList>
              <TabPanels>
                <TabPanel value="characters">
                  <CharactersList />
                </TabPanel>
                <TabPanel value="games">
                  <GamesList />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Card>
        )}

        {/* Welcome content - only show if user has no characters or not authenticated */}
        {showWelcomeContent && (
          <>
            <header className="text-center space-y-4">
              <Typography variant="h2">Welcome to Codex.Quest</Typography>
              <Typography variant="body" color="secondary" className="text-lg">
                Create your perfect Basic Fantasy RPG character with our
                comprehensive character generator. Roll ability scores, choose
                from various races and classes, and equip your adventurer for
                their next quest.
              </Typography>
            </header>

            <Card variant="standard">
              <TextHeader variant="h4" size="md">
                Features
              </TextHeader>
              <List variant="feature" spacing="normal">
                <FeatureListItem>
                  Interactive dice rolling for ability scores
                </FeatureListItem>
                <FeatureListItem>
                  Comprehensive race selection with special abilities
                </FeatureListItem>
                <FeatureListItem>
                  Multiple character classes and combination classes
                </FeatureListItem>
                <FeatureListItem>Equipment and gear selection</FeatureListItem>
                <FeatureListItem>
                  Character validation and requirements checking
                </FeatureListItem>
              </List>
            </Card>
          </>
        )}
      </section>

      {/* Floating Action Button Group for authenticated users */}
      {user && (
        <FABGroup
          position="bottom-right"
          actions={[
            {
              key: "new-character",
              label: "New Character",
              variant: "primary" as const,
              size: "lg" as const,
              onClick: () => setLocation("/new-character"),
              children: <Icon name="dice" size="lg" aria-hidden />,
            },
            {
              key: "new-game",
              label: "New Game",
              variant: "secondary" as const,
              size: "lg" as const,
              onClick: () => setLocation("/new-game"),
              children: <Icon name="shield" size="lg" aria-hidden />,
            },
          ]}
          mainAction={{
            key: "main",
            label: "Create",
            variant: "primary" as const,
            size: "lg" as const,
            children: <Icon name="plus" size="lg" aria-hidden />,
          }}
          expandDirection="up"
          showLabels={true}
        />
      )}
    </PageWrapper>
  );
}

export default Home;
