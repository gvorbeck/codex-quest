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
  const date = new Date();
  console.log("date:", date.getMonth(), date.getDate());
  return (
    <ConfigProvider theme={cqTheme}>
      <Suspense fallback={<Spin />}>
        <Routes>
          <Route
            path="/"
            element={
              <PageLayout
                user={user}
                // If the date is March 4th
                alert={
                  date.getMonth() === 2 && date.getDate() === 4
                    ? "Happy International GM's Day!"
                    : undefined
                }
                // alert={"Site-Wide Message Goes Here"}
              />
            }
          >
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
