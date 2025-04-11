import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks/custom";

import GlassForm from "../GlassFrom";
import { loginReceptionist } from "../../redux/Action/receptionistaction";
import { login } from "../../redux/slice/receptionist";

const ReceptionistLogin: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const dispatch=useAppDispatch()
    const navigate=useNavigate()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        loginReceptionist(email,password).then((data)=>{
            dispatch(login(data))
            toast.success("Login Successful!!!")
            navigate('/receptionist/dashboard')
        }).catch((e)=>{
            toast.error(e.message)
        })
    };

    return (
        
            <GlassForm
                title="Receptionist Login"
                fields={[
                    { 
                        name: "email", 
                        type: "email", 
                        placeholder: "Enter your email", 
                        value: email, 
                        onChange: (e) => setEmail(e.target.value)
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

export default ReceptionistLogin;
