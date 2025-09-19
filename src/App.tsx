import { Suspense, lazy, useState, useEffect } from "react";
import "./App.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import {
  ErrorBoundary,
  NotificationContainer,
  NotificationErrorBoundary,
  LoadingState,
} from "@/components/ui/core/feedback";
import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";
import { Routes } from "@/components/app/Routes";
import { useAppData } from "@/hooks";
import { useNotifications } from "@/hooks";
import NotificationContext from "@/contexts/NotificationContext";
import { initializeFavicon } from "@/utils/favicon";
import { getInitialAlerts, type AlertConfig } from "@/constants";

const SignInModal = lazy(() => import("./components/modals/auth/SignInModal"));

// Conditionally import DevTools only in development
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((module) => ({
        default: module.ReactQueryDevtools,
      }))
    )
  : null;

function App() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [alerts, setAlerts] = useState<AlertConfig[]>(() => getInitialAlerts());
  const notifications = useNotifications();

  useAppData();

  // Initialize favicon based on app mode
  useEffect(() => {
    initializeFavicon();
  }, []);

  const handleSignInSuccess = () => {
    setIsSignInModalOpen(false);
  };

  const handleAlertClose = (alertIndex: number) => {
    setAlerts((prevAlerts) =>
      prevAlerts.filter((_, index) => index !== alertIndex)
    );
  };

  const headerProps = {
    setIsSignInModalOpen,
    alerts,
    onAlertClose: handleAlertClose,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <NotificationContext.Provider value={notifications}>
          <div className="app dark bg-primary text-primary min-h-screen flex flex-col">
            <Header {...headerProps} />
            <Routes />
            <Footer />

            {/* Sign In Modal - Lazy loaded */}
            {isSignInModalOpen && (
              <Suspense
                fallback={
                  <LoadingState message="Loading sign in..." variant="inline" />
                }
              >
                <SignInModal
                  isOpen={isSignInModalOpen}
                  onClose={() => setIsSignInModalOpen(false)}
                  onSuccess={handleSignInSuccess}
                />
              </Suspense>
            )}

            {/* Global Notification Container */}
            <NotificationErrorBoundary>
              <NotificationContainer
                notifications={notifications.notifications}
                onDismiss={notifications.dismissNotification}
              />
            </NotificationErrorBoundary>
          </div>
        </NotificationContext.Provider>
      </ErrorBoundary>

      {/* React Query DevTools - only in development */}
      {import.meta.env.DEV && ReactQueryDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}

export default App;
