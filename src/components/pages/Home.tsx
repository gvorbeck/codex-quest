import { Link } from "wouter";
import { Button, Card, Typography } from "@/components/ui";
import { FloatingActionButton } from "@/components/ui/inputs/FloatingActionButton";
import { Icon } from "@/components/ui/display";
import { PageWrapper } from "@/components/ui/layout";
import { CharactersList } from "@/components/character/management";
import { useAuth, useCharacters } from "@/hooks";

function Home() {
  const { user } = useAuth();
  const { characters, loading } = useCharacters();

  const hasCharacters = characters.length > 0;
  const showWelcomeContent = !user || (!hasCharacters && !loading);

  return (
    <PageWrapper>
      <section className="space-y-8">
        {/* Show character list for authenticated users */}
        {user && (
          <Card variant="standard">
            <CharactersList />
          </Card>
        )}

        {/* Welcome content - only show if user has no characters or not authenticated */}
        {showWelcomeContent && (
          <>
            <header className="text-center space-y-4">
              <Typography variant="h2">
                Welcome to Codex.Quest
              </Typography>
              <Typography variant="body" color="secondary" className="text-lg">
                Create your perfect Basic Fantasy RPG character with our comprehensive
                character generator. Roll ability scores, choose from various races
                and classes, and equip your adventurer for their next quest.
              </Typography>
            </header>

            <Card variant="standard">
              <Typography variant="h4" className="mb-4">
                Features
              </Typography>
              <ul className="space-y-2 text-primary-300">
                <li className="flex items-start gap-2">
                  <span className="text-highlight-400 mt-1">•</span>
                  Interactive dice rolling for ability scores
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-highlight-400 mt-1">•</span>
                  Comprehensive race selection with special abilities
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-highlight-400 mt-1">•</span>
                  Multiple character classes and combination classes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-highlight-400 mt-1">•</span>
                  Equipment and gear selection
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-highlight-400 mt-1">•</span>
                  Character validation and requirements checking
                </li>
              </ul>
            </Card>

            <div className="text-center space-y-4">
              <Link href="/new-character" aria-describedby="create-char-desc">
                <Button variant="primary" size="lg" className="text-lg px-8 py-4">
                  Start Creating Your Character
                </Button>
              </Link>
              <Typography variant="helper" id="create-char-desc">
                Begin the character creation process with our step-by-step wizard
              </Typography>
            </div>
          </>
        )}
      </section>

      {/* Floating Action Button for authenticated users */}
      {user && (
        <div className="fixed bottom-6 right-6 z-50">
          <Link href="/new-character">
            <FloatingActionButton
              variant="primary"
              size="lg"
              tooltip="Create New Character"
              aria-label="Create new character"
            >
              <Icon name="plus" size="lg" aria-hidden />
            </FloatingActionButton>
          </Link>
        </div>
      )}
    </PageWrapper>
  );
}

export default Home;
