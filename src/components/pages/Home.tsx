import { Link } from "wouter";

function Home() {
  return (
    <section>
      <h2>Welcome to Torchlight</h2>
      <p>
        Create your perfect Basic Fantasy RPG character with our comprehensive
        character generator. Roll ability scores, choose from various races and
        classes, and equip your adventurer for their next quest.
      </p>

      <div>
        <h3>Features</h3>
        <ul>
          <li>Interactive dice rolling for ability scores</li>
          <li>Comprehensive race selection with special abilities</li>
          <li>Multiple character classes and combination classes</li>
          <li>Equipment and gear selection</li>
          <li>Character validation and requirements checking</li>
        </ul>
      </div>

      <div>
        <Link href="/new-character" aria-describedby="create-char-desc">
          Start Creating Your Character
        </Link>
        <p id="create-char-desc">
          Begin the character creation process with our step-by-step wizard
        </p>
      </div>
    </section>
  );
}

export default Home;
