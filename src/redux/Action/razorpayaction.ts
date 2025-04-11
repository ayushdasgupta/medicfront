import axios from "axios";

export const createOrder=async(formdata:object)=>{
    try {
        const {data} = await axios.post(`/api/v1/createorder`,formdata,{
            headers: {
                "Content-Type":"application/json"
            }
        })
        return data;
        
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}

export const verifyOrder=async(formdata:object)=>{
    try {
        const {data} = await axios.post(`/api/v1/verifypayment`,formdata,{
            headers: {
                "Content-Type":"application/json"
            }
        })
        return data;
        
    } catch (error:any) {
        throw error.response?.data || 'An error occurred';
    }
}