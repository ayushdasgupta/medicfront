import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks/custom";
import { login } from "../../redux/slice/adminSlice";
import GlassForm from "../GlassFrom";
import { createAdmin } from "../../redux/Action/adminaction";

const AdminRegister: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch=useAppDispatch()
  const navigate=useNavigate()
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    createAdmin(name,email,password).then((data)=>{
      dispatch(login(data))
      navigate('/admin/dashboard')
      toast.success("Register Successful !!!")
    }).catch((e)=>{
        toast.error(e.message)
    })
  };

  return (
    <GlassForm
      title="Admin Register"
      fields={[
        { 
          name: "name", 
          type: "text", 
          placeholder: "Enter your name", 
          value: name, 
          onChange: (e) => setName(e.target.value)
      },
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
      buttonText="Register"
      onSubmit={handleLogin}
    />
  );
};

export default AdminRegister;
