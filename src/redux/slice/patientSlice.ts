import { createSlice } from "@reduxjs/toolkit";

interface PatientState {
  authPatient: boolean;
  patient: IPatient | null;
}

const initialpaState: PatientState = {
  authPatient: false,
  patient: null,
};


export const patientSlice=createSlice({
  name: "patientSlice",
  initialState: initialpaState,
  reducers:{
      register:(state,action)=>{     
        state.authPatient=true
        state.patient=action.payload.patient
      },
      login:(state,action)=>{
        state.authPatient=true
        state.patient=action.payload.patient
      },
      logout:(state)=>{
        state.authPatient=false
        state.patient=null
      },
      loadpatientinfo:(state,action)=>{
        state.authPatient=true
        state.patient=action.payload.patient
      }
  }

})
export const { register,login,logout,loadpatientinfo } = patientSlice.actions



export default patientSlice.reducer