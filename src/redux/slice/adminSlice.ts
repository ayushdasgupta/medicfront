import { createSlice } from "@reduxjs/toolkit";

interface AdminState {
  authAdmin: boolean;
  admin: { id: string; name: string; email: string} | null;
}

const initialState: AdminState = {
  authAdmin: false,
  admin: null,
};


export const adminSlice=createSlice({
  name: "adminSlice",
  initialState,
  reducers:{
      register:(state,action)=>{     
        state.authAdmin=true
        state.admin=action.payload.admin
      },
      login:(state,action)=>{
        state.authAdmin=true
        state.admin=action.payload.admin
      },
      logout:(state)=>{
        state.authAdmin=false
        state.admin=null
      },
      loadadmininfo:(state,action)=>{
        state.authAdmin=true
        state.admin=action.payload.admin
      }
  }

})
export const { register,login,logout,loadadmininfo } = adminSlice.actions



export default adminSlice.reducer