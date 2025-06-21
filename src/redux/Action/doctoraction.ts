import {axiosInstance as axios}  from '../../utils/axiosinstance.js'
export const loginDoc=async(email:string,password:string)=>{
    try {
        const {data} = await axios.post('/api/v1/doctor/login',{email,password},{
            headers:{
                "Content-Type":"application/json"
            }
        })
        return data
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const logoutDoc=async()=>{
    try {
        const {data} = await axios.get('/api/v1/doctor/logout',{
            headers:{
                "Content-Type":"application/json"
            }
        })
        return data
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}

export const loadDoc=async()=>{
    try {
        const {data} = await axios.get('/api/v1/doctor/me',{
            headers:{
                 "Content-Type":"multipart/form-data"
            }
        })
        return data
        
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}

export const allDoctor=async()=>{
    try {
        const {data} = await axios.get('/api/v1/admin/alldoc',{
            headers:{
                "Content-Type":"application/json"
            }
        })
        return data;

    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const allAppointment=async()=>{
    try {
        const {data} = await axios.get('/api/v1/admin/allappointment',{
            headers:{
                "Content-Type":"application/json"
            }
        })
        return data;

    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const allPatient=async()=>{
    try {
        const {data} = await axios.get('/api/v1/admin/allpatient',{
            headers:{
                "Content-Type":"application/json"
            }
        })
        return data;

    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const allBeds=async()=>{
    try {
        const {data} = await axios.get('/api/v1/admin/allbeds',{
            headers:{
                "Content-Type":"application/json"
            }
        })
        return data;

    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const findDocID=async(id:string)=>{
    try {
        const {data} = await axios.get(`/api/v1/doctor/${id}`,{
            headers:{
                "Content-Type":"application/json"
            }
        })
        return data;
        
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const doctorupdateInfo=async(formdata:object)=>{
    try {
        const {data} = await axios.patch(`/api/v1/doctor/info`,formdata,{
            headers:{
                "Content-Type":"application/json"
            }
        })
        return data;
        
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const doctorupdatepassword=async(formdata:object)=>{
    try {
        const {data} = await axios.patch(`/api/v1/doctor/update/password`,formdata,{
            headers:{
                "Content-Type":"application/json"
            }
        })
        return data;
        
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}

export const doctorupdateAvatar=async(formdata:object)=>{
    try {
        const {data} = await axios.patch(`/api/v1/doctor/update/avatar`,formdata,{
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        return data;
        
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}