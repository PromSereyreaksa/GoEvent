import { configureStore } from "@reduxjs/toolkit"
import authReducer, { initializeAuth } from "./slices/authSlice"
import eventReducer from "./slices/eventSlice"
import guestReducer from "./slices/guestSlice"
import userReducer from "./slices/userSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    guests: guestReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})

// Initialize auth state on store creation
store.dispatch(initializeAuth())
