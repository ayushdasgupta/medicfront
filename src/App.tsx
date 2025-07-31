import Home from "./pages/Home";
import Homecopy from "./pages/Home-copy";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./components/admin/AdminLogin";
import AdminRegister from "./components/admin/AdminRegister";
import AdminResetPass from "./components/admin/AdminResetPass";

import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorLogin from "./components/doctor/DoctorLogin"; 

import PatientDashboard from "./pages/PatientDashboard";
import PatientForgotPass from "./components/patient/PatientForgotPass";
import PatientLogin from "./components/patient/PatientLogin";
import PatientRegister from "./components/patient/PatientRegister";
import PatientResetPass from "./components/patient/PatientResetPass";
import ReceptionistLogin from "./components/receptionist/ReceptionistLogin";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Invoice from "./components/invoice";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/forgotpassword" element={<PatientForgotPass />} />
        <Route path="/patient/password/reset/:token" element={<PatientResetPass />} />
        <Route path="/admin/password/reset/:token" element={<AdminResetPass />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/patient/dashboard" element={<PatientDashboard/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard/>} />
        <Route path="/receptionist/login" element={<ReceptionistLogin />} />
        <Route path="/receptionist/dashboard" element={<ReceptionistDashboard/>} />
        <Route path="/invoice/:id" element={<Invoice/>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>

  )
}

export default App