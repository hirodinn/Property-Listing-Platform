import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import propertyReducer from "../features/properties/propertySlice";
import adminReducer from "../features/admin/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    admin: adminReducer,
  },
});
