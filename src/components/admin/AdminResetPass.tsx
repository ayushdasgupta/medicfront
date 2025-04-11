import React, { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { adminResetpassword } from "../../redux/Action/adminaction";
import GlassForm from "../GlassFrom";


const AdminResetPass: React.FC = () => {
    const [password, setPassword] = useState<string>("");
    const [Confirmpassword, setConfirmpassword] = useState<string>("");

    const { token } = useParams()

    const handleSendMail = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === Confirmpassword) {
            adminResetpassword(token!, password).then((data) => {
                toast.success(data.message)
            }).catch((e) => {
                toast.error(e.message)
            })
        }else{
            toast.error("New Password and Confirm password should be same")
        }
    };

    return (

        <GlassForm
            title="Admin Reset Password"
            fields={[
                {
                    name: " New Password",
                    type: "password",
                    placeholder: "Enter your New Password",
                    value: password,
                    onChange: (e) => setPassword(e.target.value)
                },
                {
                    name: "Confirm Password",
                    type: "password",
                    placeholder: "Enter the password",
                    value: Confirmpassword,
                    onChange: (e) => setConfirmpassword(e.target.value)
                },

            ]}
            buttonText="Change Password"
            onSubmit={handleSendMail}
        />



    );
};

export default AdminResetPass;
