import React, { useState } from "react";
import GlassForm from "../GlassFrom";
import { useAppDispatch } from "../../redux/hooks/custom";
import { useNavigate } from "react-router-dom";
import { loginDoc } from "../../redux/Action/doctoraction";
import { login } from "../../redux/slice/doctorSlice";
import toast from "react-hot-toast";

const DoctorLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch=useAppDispatch()
  const navigate=useNavigate()
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginDoc(email,password).then((data)=>{
      dispatch(login(data))
      toast.success("Login successfull !!!")
      navigate('/doctor/dashboard')
    }).catch((e)=>{
      toast.error(e.message)
    })
  };

  return (
    <GlassForm
      title="Doctor Login"
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

export default DoctorLogin;
