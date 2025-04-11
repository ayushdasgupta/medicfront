import axios from 'axios';

export const createPatient = async (fromdata:object) => {
  try {
    const { data } = await axios.post('/api/v1/create/patient',fromdata, {
      headers: { 'Content-Type': 'application/json' },
    });
    return data;
  } catch (error:any) {
    throw error.response?.data || 'An error occurred';
  }
};

export const loadpatient=async()=>{
  try {
    const { data } = await axios.get('/api/v1/patient/me', {
      headers: { 'Content-Type': 'application/json' },
    });
    return data;
  } catch (error:any) {
    throw error.response?.data || 'An error occurred';
  }
}

export const logoutPatient=async()=>{
  try {
    const { data } = await axios.get('/api/v1/patient/logout', {
      headers: { 'Content-Type': 'application/json' },
    });
    return data;
  } catch (error:any) {
    throw error.response?.data || 'An error occurred';
  }
}
export const loginPatient=async(fromdata:object)=>{
  try {
    const { data } = await axios.post('/api/v1/patient/login',fromdata, {
      headers: { 'Content-Type': 'application/json' },
    });
    return data;
  } catch (error:any) {
    throw error.response?.data || 'An error occurred';
  }
}
export const patientUpdate=async(fromdata:object)=>{
  try {
    const { data } = await axios.patch('/api/v1/patient/update',fromdata, {
      headers: { 'Content-Type': 'application/json' },
    });
    return data;
  } catch (error:any) {
    throw error.response?.data || 'An error occurred';
  }
}
export const patientUpdatePassword=async(fromdata:object)=>{
  try {
    const { data } = await axios.patch('/api/v1/patient/update/password',fromdata, {
      headers: { 'Content-Type': 'application/json' },
    });
    return data;
  } catch (error:any) {
    throw error.response?.data || 'An error occurred';
  }
}
export const patientForgotpassword=async(fromdata:object)=>{
  try {
    const { data } = await axios.post('/api/v1/patient/forgot/password',fromdata, {
      headers: { 'Content-Type': 'application/json' },
    });
    return data;
  } catch (error:any) {
    throw error.response?.data || 'An error occurred';
  }
}
export const patientResetpassword=async(token:string,password:string)=>{
  try {
    const { data } = await axios.patch(`/api/v1/patient/password/reset/${token}`,{password}, {
      headers: { 'Content-Type': 'application/json' },
    });
    return data;
  } catch (error:any) {
    throw error.response?.data || 'An error occurred';
  }
}