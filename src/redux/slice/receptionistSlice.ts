import { createSlice } from "@reduxjs/toolkit";

interface ReceptionistState {
  authReceptionist: boolean;
  receptionist:IReceptionist | null;
}

const initialpaState: ReceptionistState = {
    authReceptionist: false,
    receptionist: null,
};


export const receptionistSlice=createSlice({
  name: "receptionistSlice",
  initialState: initialpaState,
  reducers:{
      login:(state,action)=>{
        state.authReceptionist=true
        state.receptionist=action.payload.receptionist
      },
      logout:(state)=>{
        state.authReceptionist=false
        state.receptionist=null
      },
      loadreceptionistinfo:(state,action)=>{
        state.authReceptionist=true
        state.receptionist=action.payload.receptionist
      }
  }

})
export const {login,logout,loadreceptionistinfo } = receptionistSlice.actions



export default receptionistSlice.reducer