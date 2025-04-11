import { createSlice } from "@reduxjs/toolkit";

interface DoctorState {
  authDoctor: boolean;
  doctor: IDoctor| null;
}

const initialState: DoctorState = {
    authDoctor: false,
    doctor: null,
};

export const doctorSlice=createSlice({
  name: "doctorSlice",
  initialState,
  reducers:{
      register:(state,action)=>{     
        state.authDoctor=true
        state.doctor=action.payload.doctor
      },
      login:(state,action)=>{
        state.authDoctor=true
        state.doctor=action.payload.doctor
      },
      logout:(state)=>{
        state.authDoctor=false
        state.doctor=null
      },
      loaddoctorinfo:(state,action)=>{
        state.authDoctor=true
        state.doctor=action.payload.doctor
      }
  }
})

export const { register,login,logout,loaddoctorinfo } = doctorSlice.actions

export default doctorSlice.reducer