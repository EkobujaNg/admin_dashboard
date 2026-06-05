// src/store/features/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "@/lib/http";

// Async thunk for fetching profile
export const fetchPersonalInfo = createAsyncThunk("auth/fetchPersonalInfo", async (_, { rejectWithValue }) => {
  try {
    const response = await http.get("/Profile/get-personal-info");
    return response.data;
  } catch (error) {
    let message = error?.response?.data?.message || error.message || "Failed to fetch personal info";
    return rejectWithValue(message);
  }
});

const initialState = {
  isAuthenticated: false,
  authToken: null,
  profile: null,
  profileLoading: false,
  profileError: null,
  initiateEmail: null,
  pinSet: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initiateEmailReg: (state, action) => {
      state.initiateEmail = action.payload.email;
    },
    login: (state, action) => {
      state.isAuthenticated = true;
      state.authToken = action.payload.authToken;
      state.pinSet = action.payload.pinSet ?? false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.authToken = null;
      state.profile = null;
      state.initiateEmail = null;
      state.pinSet = false;
    },
    updateProfileLocally: (state, action) => {
      // 👇 useful after successful profile update
      state.profile = { ...state.profile, ...action.payload };
    },
    setPinStatus: (state, action) => {
      state.pinSet = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // Profile
      .addCase(fetchPersonalInfo.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchPersonalInfo.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
        state.profileError = null;
      })
      .addCase(fetchPersonalInfo.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload || "Failed to fetch personal info";
      });
  },
});

export const { login, logout, initiateEmailReg, updateProfileLocally, setPinStatus } = authSlice.actions;

export default authSlice.reducer;
