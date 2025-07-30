import "./firebase";
import { Spin } from "antd";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { Route, Router } from "wouter";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import "../node_modules/modern-normalize/modern-normalize.css";
import PageLayout from "./components/PageLayout/PageLayout";
import ThemeSwitcher from "./components/ThemeSwitcher/ThemeSwitcher";

const PageWelcome = lazy(() => import("./components/PageWelcome/PageWelcome"));
const PageCharacterSheet = lazy(
  () => import("./components/PageCharacterSheet/PageCharacterSheet"),
);
const PageHome = lazy(() => import("./components/PageHome/PageHome"));
const PageGameSheet = lazy(
  () => import("./components/PageGameSheet/PageGameSheet"),
);
const PageNewCharacter = lazy(
  () => import("./components/PageNewCharacter/PageNewCharacter"),
);
const PageNewGame = lazy(() => import("./components/PageNewGame/PageNewGame"));
const PageSources = lazy(() => import("./components/PageSources/PageSources"));

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string>("1");

  const auth = getAuth();

  const handleTabChange = (key: string) => {
    setSelectedKey(key);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const date = new Date();
  const spin = <Spin size="large" className="w-full h-full py-4" />;
  const gmDay = date.getMonth() === 2 && date.getDate() === 4;

  return (
    <ThemeSwitcher>
      <Suspense fallback={spin}>
        <Router>
          <PageLayout
            user={user}
            alert={gmDay ? "Happy International GM's Day!" : undefined}
          >
            <Route path="/">
              {loading ? (
                spin
              ) : user ? (
                <PageHome
                  user={user}
                  selectedKey={selectedKey}
                  handleTabChange={handleTabChange}
                />
              ) : (
                <PageWelcome />
              )}
            </Route>
            <Route path="/new-character">
              <PageNewCharacter user={user} />
            </Route>
            <Route path="/new-game">
              <PageNewGame user={user} handleTabChange={handleTabChange} />
            </Route>
            <Route path="/u/:uid/c/:id">
              <PageCharacterSheet user={user} />
            </Route>
            <Route path="/u/:userId/g/:gameId">
              <PageGameSheet user={user} />
            </Route>
            <Route path="/sources">
              <PageSources />
            </Route>
          </PageLayout>
        </Router>
      </Suspense>
    </ThemeSwitcher>
  );
};

export default App;
