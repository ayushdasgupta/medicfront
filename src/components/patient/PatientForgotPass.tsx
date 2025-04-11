import React, { useState } from "react";
import toast from "react-hot-toast";
import { patientForgotpassword } from "../../redux/Action/patientaction";
import GlassForm from "../GlassFrom";

const PatientForgotPass: React.FC = () => {
    const [email, setEmail] = useState<string>("");

    const handleSendMail = (e: React.FormEvent) => {
        e.preventDefault();
        patientForgotpassword({email}).then((data)=>{
            toast.success(data.message)
        }).catch((e)=>{
            toast.error(e.message)
        })
    };

    return (
        
            <GlassForm
                title="Patient Forgot Password"
                fields={[
                    { 
                        name: "email", 
                        type: "email", 
                        placeholder: "Enter your email", 
                        value: email, 
                        onChange: (e) => setEmail(e.target.value)
                    },
                    
                ]}
                buttonText="Send Email"
                onSubmit={handleSendMail}
            />
             


    );
};

export default PatientForgotPass;
