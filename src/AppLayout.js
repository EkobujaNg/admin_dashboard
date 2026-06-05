"use client";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/lib/store";
import { fetchPersonalInfo } from "@/lib/store/slices/authSlice";
import { DrawerModalProvider } from "@/context/DrawerModalContext";
import Drawer from "@/components/ui/Drawer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.authToken);
  const { profile } = useSelector((state) => state.auth);

  useEffect(() => {
    if (authToken) {
      if (!profile) dispatch(fetchPersonalInfo());
    }
  }, [dispatch, authToken]);

  return children;
}

export default function AppLayout({ children }) {
  // Manage QueryClient state using client-side hooks
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
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
          <AuthInitializer>
            <DrawerModalProvider>
              <Toaster />
              <main>{children}</main>
              <Drawer />
            </DrawerModalProvider>
          </AuthInitializer>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}
