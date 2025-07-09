
import { configureStore } from "@reduxjs/toolkit";
import adminreducer from "./slice/adminSlice";
import doctorreducer from "./slice/doctorSlice";
import patientreducer from "./slice/patientSlice";

const store = configureStore({
  reducer: {
    patient:patientreducer,
    admin:adminreducer,
    doctor:doctorreducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
