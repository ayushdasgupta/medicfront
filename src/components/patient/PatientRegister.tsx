import React, { useState } from "react";


import { useAppDispatch } from "../../redux/hooks/custom";
import GlassForm from "../GlassFrom";
import { createPatient } from "../../redux/Action/patientaction";
import { register } from "../../redux/slice/patientSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const PatientRegister: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<number>(0);
    const [password, setPassword] = useState<string>("");
    const [gender, setGender] = useState<string>("Male");
    const [age, setAge] = useState<number>(0);
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        const patientData = {
            name,
            email,
            phone, password,
            age,
            gender
        }
        try {
            const data = await createPatient(patientData)
            dispatch(register(data))
            toast.success("Successfully Registered !!!")
            navigate('/patient/dashboard')
        } catch (error:any) {
            toast.error(error.message)
        }

    };
    const formFields: FormField[] = [
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
            name: "phone",
            type: "number",
            placeholder: "Enter your phone number",
            value: phone,
            onChange: (e) => setPhone(Number(e.target.value))
        },
        {
            name: "age",
            type: "number",
            placeholder: "Enter your age",
            value: age,
            onChange: (e) => setAge(Number(e.target.value))
        },
        {
            name: "password",
            type: "password",
            placeholder: "Create a password",
            value: password,
            onChange: (e) => setPassword(e.target.value)
        },
        {
            name: "gender",
            type: "select",
            value: gender,
            onChange: (e) => setGender(e.target.value),
            options: [
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Others", value: "Others" }
            ]
        }
    ];

    return (
        <GlassForm
            title="Patient Registration"
            fields={formFields}
            buttonText="Register"
            onSubmit={handleRegister}
        />
    );

};

export default PatientRegister;
