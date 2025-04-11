import React, { useState } from "react";
import GlassForm from "../GlassFrom";
import { useAppDispatch } from "../../redux/hooks/custom";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../redux/Action/adminaction";
import { login } from "../../redux/slice/adminSlice";
import toast from "react-hot-toast";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch=useAppDispatch()
  const navigate=useNavigate()
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(email,password).then((data)=>{
      dispatch(login(data))
      navigate('/admin/dashboard')
      toast.success("Login Successful !!!")
    }).catch((e)=>{
        toast.error(e.message)
    })
  };

  return (
    <GlassForm
      title="Admin Login"
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

export default AdminLogin;
