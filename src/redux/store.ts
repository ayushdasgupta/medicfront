
import { configureStore } from "@reduxjs/toolkit";
import adminreducer from "./slice/adminSlice";
import doctorreducer from "./slice/doctorSlice";
import patientreducer from "./slice/patientSlice";
//pro
import receptionistreducer from "./slice/receptionistSlice";
//plus
import pharmacistreducer from "./slice/pharmacistSlice";
import laboratorianreducer from "./slice/laboratorianSlice";
//end

const store = configureStore({
  reducer: {
    patient:patientreducer,
    admin:adminreducer,
    doctor:doctorreducer,
//pro 
    receptionist:receptionistreducer,
//plus
    pharmacist:pharmacistreducer,
    laboratorian:laboratorianreducer
//end
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
