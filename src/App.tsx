import { Link, Route, Switch } from "wouter";
import "./App.css";
import { Home, CharGen } from "./components";

function App() {
  return (
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
      </main>

      <footer role="contentinfo">
        <p>&copy; 2025 Torchlight. A BFRPG character generator.</p>
      </footer>
    </div>
  );
}

export default App;
