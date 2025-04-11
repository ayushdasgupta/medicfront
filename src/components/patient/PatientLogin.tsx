import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loginPatient } from "../../redux/Action/patientaction";
import { useAppDispatch } from "../../redux/hooks/custom";
import { login } from "../../redux/slice/patientSlice";
import GlassForm from "../GlassFrom";

const PatientLogin: React.FC = () => {
    const [identifier, setIdentifier] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const patientData = {
            identifier, password
        }
      try {
        const data = await loginPatient(patientData)
        dispatch(login(data))
        toast.success("Login Successful!!!")
        navigate('/patient/dashboard')
      } catch (error:any) {
        toast.error(error.message)
      }

    };

    return (

        <GlassForm
            title="Patient Login"
            fields={[
                {
                    name: "Email or Phone no",
                    type: "text",
                    placeholder: "Enter your email or phone",
                    value: identifier,
                    onChange: (e) => setIdentifier(e.target.value)
                },
                {
                    name: "password",
                    type: "password",
                    placeholder: "Create a password",
                    value: password,
                    onChange: (e) => setPassword(e.target.value)
                },
            ]}
            buttonText="Login"
            onSubmit={handleLogin}
        />



    );
};

export default PatientLogin;
