import axios from "axios";

export const loadPharmacist = async () => {
    try {
        const { data } = await axios.get('/api/v1/pharmacist/me', {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const loginPharmacist = async (formdata:object) => {
    try {
        const { data } = await axios.post('/api/v1/pharmacist/login', formdata, {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const logoutPharmacist = async () => {
    try {
        const { data } = await axios.get('/api/v1/pharmacist/logout', {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const createMedicine = async (formdata:object) => {
    try {
        const { data } = await axios.post('/api/v1/pharmacist/create/medicine',formdata, {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const updateMedicine = async (id:string,formdata:object) => {
    try {
        const { data } = await axios.patch(`/api/v1/pharmacist/medicine/${id}`,formdata, {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const deleteMedicine = async (id:string) => {
    try {
        const { data } = await axios.delete(`/api/v1/pharmacist/medicine/${id}`, {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const allMedicine = async () => {
    try {
        const { data } = await axios.get(`/api/v1/pharmacist/medicines`, {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const sellMedicine = async (formdata:object) => {
    try {
        const { data } = await axios.patch(`/api/v1/pharmacist/medicine/sell`,formdata, {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}

export const pharmacististupdatepassword=async(formdata:object)=>{
    try {
        const {data} = await axios.patch(`/api/v1/pharmacist/update/password`,formdata,{
            headers:{
                "Content-Type":"application/json"
            }
        })
        return data;
        
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const pharmacistupdateAvatar=async(formdata:object)=>{
    try {
        const {data} = await axios.patch(`/api/v1/pharmacist/update/avatar`,formdata,{
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        return data;
        
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const pharmacististupdateProfile=async(formdata:object)=>{
    try {
        const {data} = await axios.patch(`/api/v1/pharmacist/update/profile`,formdata,{
            headers:{
                "Content-Type":"application/json"
            }
        })
        return data;
        
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const patientListForPharmacist=async()=>{
    try {
        const {data} = await axios.get(`/api/v1/pharmacist/patients`,{
            headers:{
                "Content-Type":"application/json"
            }
        })
        return data;
        
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}