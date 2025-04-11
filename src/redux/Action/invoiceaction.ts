import axios from "axios";

export const getInvoice = async (id: string) => {
    try {
        const { data } = await axios.get(`/api/v1/invoice/${id}`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log(data);
            
        return data
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}