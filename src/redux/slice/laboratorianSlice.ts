import { createSlice } from "@reduxjs/toolkit";

interface laboratorianState {
    authLabratorian: boolean;
    laboratorian: ILaboratorian | null;
}

const initialphState: laboratorianState = {
    authLabratorian: false,
    laboratorian: null,
};


export const laboratorianSlice = createSlice({
    name: "laboratorianSlice",
    initialState: initialphState,
    reducers: {
        login: (state, action) => {
            state.authLabratorian = true
            state.laboratorian = action.payload.laboratorian
        },
        logout: (state) => {
            state.authLabratorian = false
            state.laboratorian = null
        },
        loadLaboratorianinfo: (state, action) => {
            state.authLabratorian = true
            state.laboratorian = action.payload.laboratorian
        }
    }

})
export const { login, logout, loadLaboratorianinfo } = laboratorianSlice.actions



export default laboratorianSlice.reducer