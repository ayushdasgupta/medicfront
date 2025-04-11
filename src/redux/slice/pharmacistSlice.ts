import { createSlice } from "@reduxjs/toolkit";

interface PhamacistState {
    authPharmacist: boolean;
    pharmacist: IPharmacist | null;
}

const initialphState: PhamacistState = {
    authPharmacist: false,
    pharmacist: null,
};


export const pharmacistSlice = createSlice({
    name: "pharmacistSlice",
    initialState: initialphState,
    reducers: {
        login: (state, action) => {
            state.authPharmacist = true
            state.pharmacist = action.payload.pharmacist
        },
        logout: (state) => {
            state.authPharmacist = false
            state.pharmacist = null
        },
        loadpharmacistinfo: (state, action) => {
            state.authPharmacist = true
            state.pharmacist = action.payload.pharmacist
        }
    }

})
export const { login, logout, loadpharmacistinfo } = pharmacistSlice.actions



export default pharmacistSlice.reducer