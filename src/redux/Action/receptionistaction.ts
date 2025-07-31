import {axiosInstance as axios}  from '../../utils/axiosinstance.js'
export const logoutReceptionist = async () => {
    try {
        const { data } = await axios.get('/api/v1/receptionist/logout', {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const loginReceptionist = async (email: string, password: string) => {
    try {
        const { data } = await axios.post('/api/v1/receptionist/login', { email, password }, {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const loadReceptionist = async () => {
    try {
        const { data } = await axios.get('/api/v1/receptionist/me', {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const invoiceGenerate=async(formdata:object)=>{
    try {
        const {data} = await axios.post(`/api/v1/receptionist/invoice/generate`,formdata,{
            headers: {
                "Content-Type":"application/json"
            }
        })
        return data;
        
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const allAppointmentToday = async () => {
    try {
        const { data } = await axios.get('/api/v1/receptionist/appointment/today', {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const receptionistupdateInfo=async(formdata:object)=>{
    try {
        const {data} = await axios.patch(`/api/v1/receptionist/info`,formdata,{
            headers:{
                "Content-Type":"application/json"
            }
        })
        return data;
        
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const receptionistupdatepassword=async(formdata:object)=>{
    try {
        const {data} = await axios.patch(`/api/v1/receptionist/update/password`,formdata,{
            headers:{
                "Content-Type":"application/json"
            }
        })
        return data;
        
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const receptionistupdateAvatar=async(formdata:object)=>{
    try {
        const {data} = await axios.patch(`/api/v1/receptionist/update/avatar`,formdata,{
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        return data;
        
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const createPatientByReception=async(formdata:object)=>{
    try {
        const {data} = await axios.post(`/api/v1/receptionist/create/patient`,formdata,{
            headers: {
                "Content-Type":"application/json"
            }
        })
        return data;
        
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const bookAppointmentByReception=async(formdata:object)=>{
    try {
        const {data} = await axios.post(`/api/v1/receptionist/book`,formdata,{
            headers: {
                "Content-Type":"application/json"
            }
        })
        return data;
        
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const allPatientReception=async()=>{
    try {
        const {data} = await axios.get(`/api/v1/receptionist/allpatient`,{
            headers: {
                "Content-Type":"application/json"
            }
        })
        return data;
        
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const allDocReception=async()=>{
    try {
        const {data} = await axios.get(`/api/v1/receptionist/alldoc`,{
            headers: {
                "Content-Type":"application/json"
            }
        })
        return data;
        
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
