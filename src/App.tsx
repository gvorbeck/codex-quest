import { Suspense, lazy, useState } from "react";
import "./App.css";
import { ErrorBoundary, NotificationContainer, NotificationErrorBoundary } from "@/components/ui/feedback";
import { AppHeader } from "@/components/ui/AppHeader";
import { AppFooter } from "@/components/ui/AppFooter";
import { AppRoutes } from "@/components/ui/AppRoutes";
import { useAppData } from "@/hooks/useAppData";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationContext from "@/contexts/NotificationContext";

const SignInModal = lazy(() => import("./components/auth/SignInModal"));

function App() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const notifications = useNotifications();

  useAppData();

  const handleSignInSuccess = () => {
    setIsSignInModalOpen(false);
  };

  return (
    <ErrorBoundary>
      <NotificationContext.Provider value={notifications}>
        <div className="app dark bg-primary text-primary min-h-screen flex flex-col">
          <AppHeader setIsSignInModalOpen={setIsSignInModalOpen} />
          <AppRoutes />
          <AppFooter />

          {/* Sign In Modal - Lazy loaded */}
          {isSignInModalOpen && (
            <Suspense fallback={<div>Loading...</div>}>
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
  );
}

export default App;
