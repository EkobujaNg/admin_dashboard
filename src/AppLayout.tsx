"use client";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/lib/store";
import { DrawerModalProvider } from "@/context/DrawerModalContext";
import Drawer from "@/components/ui/Drawer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useIdleLogout from "@/hooks/useIdleLogout";
import IdleTimeoutWarningModal from "@/components/ui/IdleTimeoutWarningModal";

function IdleLogoutWatcher() {
  const { showWarning, secondsRemaining, stayLoggedIn } = useIdleLogout();
  return (
    <IdleTimeoutWarningModal isOpen={showWarning} secondsRemaining={secondsRemaining} onStayLoggedIn={stayLoggedIn} />
  );
}

export default function AppLayout({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <DrawerModalProvider>
            <Toaster />
            <main>{children}</main>
            <Drawer />
            <IdleLogoutWatcher />
          </DrawerModalProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}
