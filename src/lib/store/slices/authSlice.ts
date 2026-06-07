import { createSlice } from "@reduxjs/toolkit";
import type { AuthUser, LoginResponse } from "@/lib/auth/types";

const initialState = {
  isAuthenticated: false,
  authToken: null as string | null,
  refreshToken: null as string | null,
  user: null as AuthUser | null,
  initiateEmail: null as string | null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setForgotPasswordEmail: (state, action: { payload: { email: string } }) => {
      state.initiateEmail = action.payload.email;
    },
    clearForgotPasswordFlow: (state) => {
      state.initiateEmail = null;
    },
    login: (state, action: { payload: LoginResponse }) => {
      state.isAuthenticated = true;
      state.authToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = {
        userId: action.payload.userId,
        email: action.payload.email,
        fullName: action.payload.fullName,
        role: action.payload.role ?? action.payload.accountType,
        profilePicture: action.payload.profilePicture ?? null,
      };
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.authToken = null;
      state.refreshToken = null;
      state.user = null;
      state.initiateEmail = null;
    },
    updateProfileLocally: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { login, logout, setForgotPasswordEmail, clearForgotPasswordFlow, updateProfileLocally } = authSlice.actions;

export default authSlice.reducer;
