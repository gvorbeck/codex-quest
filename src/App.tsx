import { Link, Route, Switch } from "wouter";
import "./App.css";
import { Home, CharGen } from "./components";
import { ErrorBoundary } from "@/components/ui";

function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <header role="banner">
          <nav role="navigation" aria-label="Main navigation">
            <h1>
              <Link href="/" aria-label="Go to homepage">
                Torchlight
              </Link>
            </h1>
            <ul>
              <li>
                <Link href="/new-character">Create Character</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main role="main" id="main-content">
          <ErrorBoundary
            fallback={
              <section>
                <h2>Character Creation Unavailable</h2>
                <p>
                  We're experiencing technical difficulties with the character
                  creation system. Please try refreshing the page.
                </p>
                <Link href="/">Return to homepage</Link>
              </section>
            }
          >
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/new-character" component={CharGen} />

              {/* Default route in a switch */}
              <Route>
                <section>
                  <h2>Page Not Found</h2>
                  <p>Sorry, the page you're looking for doesn't exist.</p>
                  <Link href="/">Return to homepage</Link>
                </section>
              </Route>
            </Switch>
          </ErrorBoundary>
        </main>

        <footer role="contentinfo">
          <p>&copy; 2025 Torchlight. A BFRPG character generator.</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
