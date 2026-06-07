// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authReducer from "./slices/authSlice";
import { injectStore } from "@/lib/http";

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["authToken", "refreshToken", "user", "isAuthenticated", "initiateEmail"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

// Inject store into http module for 401 handling
injectStore(store);

export const persistor = persistStore(store);
