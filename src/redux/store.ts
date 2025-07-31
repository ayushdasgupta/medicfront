
import { configureStore } from "@reduxjs/toolkit";
import adminreducer from "./slice/adminSlice";
import doctorreducer from "./slice/doctorSlice";
import patientreducer from "./slice/patientSlice";
import receptionistreducer from "./slice/receptionistSlice";
//pro
import pharmacistreducer from "./slice/pharmacistSlice";
//plus
import laboratorianreducer from "./slice/laboratorianSlice";
//end

const store = configureStore({
  reducer: {
    patient:patientreducer,
    admin:adminreducer,
    doctor:doctorreducer,
    receptionist:receptionistreducer,
//pro 
    pharmacist:pharmacistreducer,
//plus
    laboratorian:laboratorianreducer
//end
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
