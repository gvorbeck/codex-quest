import "./firebase";
import { ConfigProvider, Spin } from "antd";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import "../node_modules/modern-normalize/modern-normalize.css";
import PageLayout from "./components/PageLayout/PageLayout";
import { cqTheme } from "./support/theme";
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

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // DONE: standardize useNotification custom hook wherever notifications are used.
  // DONE: Add regular equipment to character sheet.
  // DONE: Click Saving Throws to roll dice.
  // DONE: Click Special Abilities to roll dice.
  // DONE: Character Creator: Show a list of equipment character has purchased.
  // TODO: Verify race class filtering works when creating new character.
  // TODO: There are race/class specific special parameters (like incrementing hit dice), that need to be checked.
  // DONE: Rollinitiative button needs functionality.
  // DONE: CHEAT SHEET button needs functionality.
  // DONE: VIRTUAL DICE buttons need functionality.
  // DONE: LEVEL UP MODAL needs functionality.
  // DONE: ATTACK button needs functionality.
  // DONE: Shortbow name is crunched in character sheet.
  // DONE: Money needs weight
  // DONE: Selecting Armor/Shield does not change AC value
  // DONE: Selecting Armor/Shield does get saved
  // DONE: Spells should be listed on character sheet
  // DONE: GM SHEET: the rest of the special abilities should be fixed
  // DONE: GM SHEET: notes panel
  // DONE: makeChange into custom hook
  // DONE: Site title and favicon
  // DONE: Separate general equipment into sub categories https://ant.design/components/collapse#components-collapse-demo-mix
  // DONE: make whole collapse bar clickable
  // DONE: Welcome Page
  // DONE: Sources Page
  // TODO: Edit character name
  // DONE: Switch (Options.tsx) to turn on/off supplemental classes/races
  console.error("REMAINING TODOS!");
  return (
    <ConfigProvider theme={cqTheme}>
      <Suspense fallback={<Spin />}>
        <Routes>
          <Route path="/" element={<PageLayout user={user} />}>
            <Route
              index
              element={
                loading ? (
                  <Spin size="large" />
                ) : user ? (
                  <PageHome user={user} />
                ) : (
                  <PageWelcome />
                )
              }
            />
            <Route
              path="new-character"
              element={<PageNewCharacter user={user} />}
            />
            <Route path="new-game" element={<PageNewGame user={user} />} />
            <Route
              path="u/:uid/c/:id"
              element={<PageCharacterSheet user={user} />}
            />
            <Route
              path="u/:uid/g/:id"
              element={<PageGameSheet user={user} />}
            />
            <Route path="sources" element={<PageSources />} />
          </Route>
        </Routes>
      </Suspense>
    </ConfigProvider>
  );
};

export default App;
