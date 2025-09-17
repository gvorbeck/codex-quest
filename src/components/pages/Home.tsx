import { useLocation } from "wouter";
import { Card } from "@/components/ui";
import { FABGroup } from "@/components/ui/core/primitives/FloatingActionButton";
import { Icon, HeroSection, FeatureCard } from "@/components/ui/composite";
import { TextHeader } from "@/components/ui/composite/TextHeader";
import { PageWrapper } from "@/components/ui/core/layout";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@/components/ui/core/layout/Tabs";
import { CharactersList } from "@/components/features/character/management";
import { GamesList } from "@/components/features/game/management";
import { useAuth, useCharacters } from "@/hooks";

function Home() {
  const { user } = useAuth();
  const { data: characters = [], isLoading: loading } = useCharacters();
  const [, setLocation] = useLocation();

  const hasCharacters = characters.length > 0;
  const showWelcomeContent = !user || (!hasCharacters && !loading);

  return (
    <PageWrapper>
      <section className="space-y-6 sm:space-y-8">
        {/* Show character list for authenticated users */}
        {user && (
          <Card variant="standard" size="compact" className="sm:p-6">
            <Tabs defaultValue="characters" variant="underline" size="sm">
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
            <HeroSection
              title="Welcome to Codex.Quest"
              subtitle="Forge your legendary hero with our comprehensive character generator for Basic Fantasy RPG. Roll ability scores, choose from diverse races and classes, and equip your adventurer for epic quests ahead."
              logo={
                <img
                  src="/images/logo.webp"
                  alt="Codex.Quest Logo"
                  className="mb-8 max-w-64 mx-auto"
                />
              }
            />

            <Card variant="hero">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-highlight-400/50 to-transparent" />

              <div className="pt-4">
                <TextHeader
                  variant="h3"
                  size="lg"
                  className="text-center mb-8 text-text-primary"
                >
                  Forge Your Legend
                </TextHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <FeatureCard
                      icon="dice"
                      title="Interactive Dice Rolling"
                      description="Experience the thrill of rolling ability scores with animated dice and multiple generation methods."
                    />
                    <FeatureCard
                      icon="user"
                      title="Rich Race & Class Options"
                      description="Choose from diverse races and classes, each with unique abilities and progression paths."
                    />
                  </div>

                  <div className="space-y-4">
                    <FeatureCard
                      icon="sword"
                      title="Complete Equipment System"
                      description="Outfit your hero with weapons, armor, and gear with detailed stats and weight tracking."
                    />
                    <FeatureCard
                      icon="check-circle"
                      title="Smart Validation"
                      description="Automatic requirement checking ensures your character follows all BFRPG rules and restrictions."
                    />
                  </div>
                </div>
              </div>
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
