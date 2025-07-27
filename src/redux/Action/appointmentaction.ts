import {axiosInstance as axios}  from '../../utils/axiosinstance.js'
export const bookAppointment=async(formdata:object)=>{
    try {
        const {data} =await axios.post("/api/v1/book/appointment",formdata,{
            headers:{
                "Content-Type":"application/json"
            }
        })  
        return data  
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const cancelAppointment=async(formdata:object)=>{
    try {
        const {data} =await axios.post("/api/v1/cancel/appointment",formdata,{
            headers:{
                "Content-Type":"application/json"
            }
        })  
        return data  
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const completedAppointment=async(formdata:object)=>{
    try {
        const {data} =await axios.post("/api/v1/completed/appointment",formdata,{
            headers:{
                "Content-Type":"application/json"
            }
        })  
        return data  
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const rescheduleAppointment=async(formdata:object)=>{
    try {
        const {data} =await axios.post("/api/v1/reschedule/appointment",formdata,{
            headers:{
                "Content-Type":"application/json"
            }
        })  
        return data  
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const getNextAvailableDayAndAppointmentCount=async(doctorId:string)=>{
try {
        const {data} =await axios.get(`/api/v1/appointment/next-available/${doctorId}`,{
            headers:{
                "Content-Type":"application/json"
            }
        })  
        return data  
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const bulkCancelFutureAppointments=async(formdata:object)=>{
try {
        const {data} =await axios.put(`/api/v1/appointment/bulk-cancel`,formdata,{
            headers:{
                "Content-Type":"application/json"
            }
        })  
        return data  
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const bulkRescheduleFutureAppointments=async(formdata:object)=>{
try {
        const {data} =await axios.put(`/api/v1/appointment/bulk-reschedule`,formdata,{
            headers:{
                "Content-Type":"application/json"
            }
        })  
        return data  
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}