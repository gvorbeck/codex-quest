import { Link, Route, Switch } from "wouter";
import "./App.css";
import { Home, CharGen } from "./components";

function App() {
  return (
    <div>
      <p>foo</p>
      <Link href="/new-character">New</Link>

      <Switch>
        <Route path="/" component={Home} />

        <Route path="/new-character" component={CharGen} />

        {/* Default route in a switch */}
        <Route>404: No such page!</Route>
      </Switch>
    </div>
  );
}

export default App;
