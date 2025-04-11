import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loginlaboratorian } from "../../redux/Action/laboratorianaction";
import { useAppDispatch } from "../../redux/hooks/custom";
import { login } from "../../redux/slice/pharmacistSlice";
import GlassForm from "../GlassFrom";

const LaboratorianLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch=useAppDispatch()
  const navigate=useNavigate()
  const handleLogin =async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data= await loginlaboratorian({email,password})
      dispatch(login(data))
      toast.success(data.message)
      navigate("/laboratorian/dashboard")
    } catch (error:any) {
      toast.error(error.message)
    }
    
  };

  return (
    <GlassForm
      title="Laboratorian Login"
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
          placeholder: "Enter a password", 
          value: password, 
          onChange: (e) => setPassword(e.target.value)
      },
      ]}
      buttonText="Login"
      onSubmit={handleLogin}
    />
  );
};

export default LaboratorianLogin;
