import {axiosInstance as axios}  from '../../utils/axiosinstance.js'

export const createAdmin = async (name: string, email: string, password: string) => {
    try {
        const { data } = await axios.post('/api/v1/admin/create', { name, email, password }, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return data

    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const loginAdmin = async (email: string, password: string) => {
    try {
        const { data } = await axios.post('/api/v1/admin/login', { email, password }, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return data

    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const loadnAdmin = async () => {
    try {
        const { data } = await axios.get('/api/v1/admin/me', {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return data

    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const loagoutnAdmin = async () => {
    try {
        const { data } = await axios.get('/api/v1/admin/logout', {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return data

    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const adminForgotpassword = async () => {
    try {
        const { data } = await axios.get(`/api/v1/admin/forgot/password`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        return data
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const createDoctor = async (
    fromdata: object
) => {
    try {
        const { data } = await axios.post('/api/v1/create/doctor',
            fromdata,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
        return data

    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const updateDocAdmin = async (fromdata: object) => {
    try {
        const { data } = await axios.patch('/api/v1/admin/doctor/update',
            fromdata,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        return data

    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const changeDocPassAdmin = async (formdata: object) => {
    try {
        const { data } = await axios.patch(`/api/v1/admin/doctor/update/pass`, formdata,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        return data
    } catch (error: any) {
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
export const getAllInvoices=async()=>{
    try {
        const { data } = await axios.get(`/api/v1/admin/allinvoice`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        return data
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
//pro
export const createReceptionist = async (formdata: object) => {
    try {
        const { data } = await axios.post(`/api/v1/create/receptionist`, formdata,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
        return data
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const createBeds = async (formdata: object) => {
    try {
        const { data } = await axios.post(`/api/v1/admin/create/bed`, formdata,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        return data
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const allReceptionist = async () => {
    try {
        const { data } = await axios.get(`/api/v1/admin/allreceptionist`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })

        return data
    } catch (error: any) {
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
export const changeRecepPassAdmin = async (formdata: object) => {
    try {
        const { data } = await axios.patch(`/api/v1/admin/receptionist/update/pass`, formdata,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        return data
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
//plus
export const createPharmacistAdmin = async (formdata:object) => {
    try {
        const { data } = await axios.post(`/api/v1/admin/create/pharmacist`,formdata,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
        return data
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const createLaboratorianAdmin = async (formdata:object) => {
    try {
        const { data } = await axios.post(`/api/v1/admin/create/laboratorian`,formdata,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
        return data
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const allLaboratorians = async () => {
    try {
        const { data } = await axios.get(`/api/v1/admin/alllaboratorian`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })

        return data
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const allPharmacists = async () => {
    try {
        const { data } = await axios.get(`/api/v1/admin/allpharmacist`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })

        return data
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}

export const changeLabPassAdmin = async (formdata: object) => {
    try {
        const { data } = await axios.patch(`/api/v1/admin/laboratorian/update/pass`, formdata,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        return data
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const changePharmaPassAdmin = async (formdata: object) => {
    try {
        const { data } = await axios.patch(`/api/v1/admin/pharmacist/update/pass`, formdata,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        return data
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
//end
//basic
export const deleteDocAdmin = async (id: string) => {
    try {
        const { data } = await axios.delete(`/api/v1/admin/doctor/${id}`,
            {
                headers: {
                    "Content-Type": "apllication/json"
                }
            })
        return data

    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const deletePatientAdmin = async (id: string) => {
    try {
        const { data } = await axios.delete(`/api/v1/admin/patient/${id}`,
            {
                headers: {
                    "Content-Type": "apllication/json"
                }
            })
        return data

    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const deleteAppointmentAdmin = async (id: string) => {
    try {
        const { data } = await axios.delete(`/api/v1/admin/appointment/${id}`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        return data
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}

//pro
export const deleteBeds = async (id: string) => {
    try {
        const { data } = await axios.delete(`/api/v1/admin/bed/${id}`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        return data
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const deleteReceptioinstAdmin = async (id: string) => {
    try {
        const { data } = await axios.delete(`/api/v1/admin/receptionist/${id}`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        return data
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
//plus
export const deletePharmacistByAdmin = async (id: string) => {
    try {
        const { data } = await axios.delete(`/api/v1/admin/pharmacist/${id}`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        return data
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const deleteLaboratorianByAdmin = async (id: string) => {
    try {
        const { data } = await axios.delete(`/api/v1/admin/laboratorian/${id}`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        return data
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
//end
export const adminResetpassword = async (token: string, password: string) => {
    try {
        const { data } = await axios.patch(`/api/v1/admin/password/reset/${token}`, { password },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        return data
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
