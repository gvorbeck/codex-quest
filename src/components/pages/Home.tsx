import { Link } from "wouter";
import { Button } from "@/components/ui";
import { PageWrapper } from "@/components/ui/layout";
import { CharactersList } from "@/components/character/management";
import { useAuth } from "@/hooks";

function Home() {
  const { user } = useAuth();

  return (
    <PageWrapper>
      <section className="space-y-8">
        {/* Show character list for authenticated users */}
        {user && (
          <div className="bg-primary-800 rounded-lg p-6 border border-primary-700">
            <CharactersList />
          </div>
        )}

        <header className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-primary-100">
            Welcome to Torchlight
          </h2>
          <p className="text-lg text-primary-300 leading-relaxed">
            Create your perfect Basic Fantasy RPG character with our comprehensive
            character generator. Roll ability scores, choose from various races
            and classes, and equip your adventurer for their next quest.
          </p>
        </header>

        <div className="bg-primary-800 rounded-lg p-6 border border-primary-700">
          <h3 className="text-xl font-semibold text-primary-100 mb-4">
            Features
          </h3>
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
        </div>

        <div className="text-center space-y-4">
          <Link href="/new-character" aria-describedby="create-char-desc">
            <Button variant="primary" size="lg" className="text-lg px-8 py-4">
              Start Creating Your Character
            </Button>
          </Link>
          <p id="create-char-desc" className="text-primary-400 text-sm">
            Begin the character creation process with our step-by-step wizard
          </p>
        </div>
      </section>
    </PageWrapper>
  );
}

export default Home;
