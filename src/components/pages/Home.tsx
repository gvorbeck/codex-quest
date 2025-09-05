import { useLocation } from "wouter";
import { Card, Typography } from "@/components/ui";
import { FABGroup } from "@/components/ui/inputs/FloatingActionButton";
import { Icon, TextHeader } from "@/components/ui/display";
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
      <section className="space-y-6 sm:space-y-8 px-2 sm:px-6 lg:px-8">
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
            {/* Hero Section with Atmospheric Background */}
            <div className="relative">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 rounded-3xl opacity-60"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-highlight-900/20 via-transparent to-transparent rounded-3xl"></div>

              {/* Decorative elements */}
              <div className="absolute top-8 left-8 w-32 h-32 bg-highlight-400/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-8 right-8 w-40 h-40 bg-highlight-500/5 rounded-full blur-3xl"></div>

              {/* Content */}
              <header className="relative text-center space-y-8 px-8">
                <div className="flex justify-center mb-6">
                  <img
                    src="/logo.webp"
                    alt="Codex.Quest Logo"
                    className="w-40 h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56"
                  />
                </div>

                <div className="space-y-4">
                  <Typography
                    variant="h1"
                    className="text-4xl lg:text-5xl xl:text-6xl font-title text-text-primary drop-shadow-lg"
                  >
                    Welcome to Codex.Quest
                  </Typography>
                  <div className="w-32 h-1 bg-gradient-to-r from-transparent via-highlight-400 to-transparent mx-auto"></div>
                </div>

                <Typography
                  variant="body"
                  color="secondary"
                  className="text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed text-text-secondary"
                >
                  Forge your legendary hero with our comprehensive character
                  generator for Basic Fantasy RPG. Roll ability scores, choose
                  from diverse races and classes, and equip your adventurer for
                  epic quests ahead.
                </Typography>
              </header>
            </div>

            {/* Features Section with Enhanced Styling */}
            <Card
              variant="standard"
              className="bg-gradient-to-br from-background-secondary to-background-tertiary border-border/50"
            >
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-highlight-400/50 to-transparent"></div>

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
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-primary-800/30 border border-border/30">
                        <Icon
                          name="dice"
                          size="lg"
                          className="text-highlight-400 mt-1 flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-semibold text-text-primary mb-2">
                            Interactive Dice Rolling
                          </h4>
                          <p className="text-text-secondary text-sm">
                            Experience the thrill of rolling ability scores with
                            animated dice and multiple generation methods.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-xl bg-primary-800/30 border border-border/30">
                        <Icon
                          name="user"
                          size="lg"
                          className="text-highlight-400 mt-1 flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-semibold text-text-primary mb-2">
                            Rich Race & Class Options
                          </h4>
                          <p className="text-text-secondary text-sm">
                            Choose from diverse races and classes, each with
                            unique abilities and progression paths.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-primary-800/30 border border-border/30">
                        <Icon
                          name="sword"
                          size="lg"
                          className="text-highlight-400 mt-1 flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-semibold text-text-primary mb-2">
                            Complete Equipment System
                          </h4>
                          <p className="text-text-secondary text-sm">
                            Outfit your hero with weapons, armor, and gear with
                            detailed stats and weight tracking.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-xl bg-primary-800/30 border border-border/30">
                        <Icon
                          name="check-circle"
                          size="lg"
                          className="text-highlight-400 mt-1 flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-semibold text-text-primary mb-2">
                            Smart Validation
                          </h4>
                          <p className="text-text-secondary text-sm">
                            Automatic requirement checking ensures your
                            character follows all BFRPG rules and restrictions.
                          </p>
                        </div>
                      </div>
                    </div>
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
