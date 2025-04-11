
import { configureStore } from "@reduxjs/toolkit";
import adminreducer from "./slice/adminSlice";
import doctorreducer from "./slice/doctorSlice";
import patientreducer from "./slice/patientSlice";
import receptionistreducer from "./slice/receptionist";
import pharmacistreducer from "./slice/pharmacistSlice";
import laboratorianreducer from "./slice/laboratorianSlice";

const store = configureStore({
  reducer: {
    patient:patientreducer,
    admin:adminreducer,
    doctor:doctorreducer,
    receptionist:receptionistreducer,
    pharmacist:pharmacistreducer,
    laboratorian:laboratorianreducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
