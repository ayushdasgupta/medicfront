import {axiosInstance as axios}  from '../../utils/axiosinstance.js'
export const loadlaboratorian = async () => {
    try {
        const { data } = await axios.get('/api/v1/laboratorian/me', {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const loginlaboratorian = async (formdata: object) => {
    try {
        const { data } = await axios.post('/api/v1/laboratorian/login', formdata, {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const logoutlaboratorian = async () => {
    try {
        const { data } = await axios.get('/api/v1/laboratorian/logout', {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}

export const createTestForPatient = async (id: string, formdata: object) => {
    try {
        const { data } = await axios.post(`/api/v1/laboratorian/patient/${id}`, formdata, {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const laboratorianupdatepassword = async (formdata: object) => {
    try {
        const { data } = await axios.patch(`/api/v1/laboratorian/update/password`, formdata, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return data;

    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const laboratorianupdateAvatar = async (formdata: object) => {
    try {
        const { data } = await axios.patch(`/api/v1/laboratorian/update/avatar`, formdata, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        return data;

    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const laboratorianupdateProfile = async (formdata: object) => {
    try {
        const { data } = await axios.patch(`/api/v1/laboratorian/update/profile`, formdata, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return data;

    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const patientListForlaboratorian = async () => {
    try {
        const { data } = await axios.get(`/api/v1/laboratorian/patients`, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return data;

    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}
export const uploadReportForPatient = async (patientId:string, formData:object) => {
    try {
        const { data } = await axios.post(
            `/api/v1/laboratorian/patient/${patientId}/report`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data", // Important for file uploads
                },
            }
        );
        return data;
    } catch (error: any) {
        throw error.response?.data || 'An error occurred';
    }
}