import axios from "axios"

export const bookAppointment=async(fromdata:object)=>{
    try {
        const {data} =await axios.post("/api/v1/book/appointment",fromdata,{
            headers:{
                "Content-Type":"application/json"
            }
        })  
        return data  
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const cancelAppointment=async(fromdata:object)=>{
    try {
        const {data} =await axios.post("/api/v1/cancel/appointment",fromdata,{
            headers:{
                "Content-Type":"application/json"
            }
        })  
        return data  
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const completedAppointment=async(fromdata:object)=>{
    try {
        const {data} =await axios.post("/api/v1/completed/appointment",fromdata,{
            headers:{
                "Content-Type":"application/json"
            }
        })  
        return data  
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const rescheduleAppointment=async(fromdata:object)=>{
    try {
        const {data} =await axios.post("/api/v1/reschedule/appointment",fromdata,{
            headers:{
                "Content-Type":"application/json"
            }
        })  
        return data  
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}