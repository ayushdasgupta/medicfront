import React, { useEffect, useState, Suspense, lazy } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks/custom";
import { loadpatient, logoutPatient, patientUpdatePassword } from "../redux/Action/patientaction";
import { loadpatientinfo, logout } from "../redux/slice/patientSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import ConfirmationModal from "../components/ConfirmModal";
import { APPNAME } from "../utils/constant";

// Lazy load components
const Navbar = lazy(() => import("../components/Navbar"));
const Sidebar = lazy(() => import("../components/Sidebar"));
const DoctorSearch = lazy(() => import("../components/patient/DoctorSearch"));
const UpdateInformation = lazy(() => import("../components/patient/UpdateInformation"));
const UpdateMedicalInfo = lazy(() => import("../components/patient/UpdateMedicalInfo"));
const Appointments = lazy(() => import("../components/patient/Appointments"));
const Invoice = lazy(() => import("../components/patient/Invoices"));
const Report = lazy(() => import("../components/patient/Reports"));
const UpdatePassword = lazy(() => import("../components/Updatepassword"));

const PatientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("doctorSearch");
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const data = await loadpatient();
        dispatch(loadpatientinfo(data));
        setLoading(false);
      } catch (e: any) {
        navigate("/");
        toast.error(e.message);
      }
    };

    fetchPatientInfo();
  }, [dispatch, navigate]);

  const { patient } = useAppSelector((state) => state.patient);
  const patientName = patient?.name;

  const handleLogout = () => {
    setIsModalOpen(true);
    
  };
  const handleConfirmLogout = () => {
    logoutPatient()
    .then((data) => {
      dispatch(logout());
      toast.success(data.message);
      navigate("/");
    })
    .catch((e) => {
      toast.error(e.message);
    });
    setIsModalOpen(false);
  };

  const handleCancelLogout = () => {
    setIsModalOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "doctorSearch":
        return <DoctorSearch />;
      case "updateInfo":
        return <UpdateInformation />;
      case "medicalInfo":
        return <UpdateMedicalInfo />;
      case "invoice":
        return <Invoice />;
//pro
//plus
      case "report":
        return <Report />;
//end
      case "updatePassword":
        return (
          <UpdatePassword role="patient" updatePasswordAction={patientUpdatePassword} />
        );
      case "appointments":
        return <Appointments/>
      
      default:
        return <DoctorSearch />;
    }
  };

  const tabs = [
    { id: "doctorSearch", label: "Doctor Search" },
    { id: "appointments", label: "Appointments" },
    { id: "invoice", label: "Invoice" },
//pro
//plus
    { id: "report", label: "Report" },
//end
    { id: "updateInfo", label: "Update Information" },
    { id: "medicalInfo", label: "Medical Information" },
    { id: "updatePassword", label: "Update Password" },
  ];

  return loading ? (
    <Loader />
  ) : (
    <Suspense fallback={<Loader />}>
      <div className="overflow-auto flex h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100">
        {/* Sidebar */}
        <Sidebar
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          name={patientName}
          logout={handleLogout}
        />

        {/* Main Content */}
        <div className="min-h-full flex-1 flex flex-col">
          <Navbar
            websiteName={APPNAME}
            patientName={patientName}
            onLogout={handleLogout}
          />
          {/* Scrollable Content */}
          <div className="flex-1 overflow-auto p-8">{renderContent()}</div>
        </div>
        <ConfirmationModal
          isOpen={isModalOpen}
          title="Confirm Logout"
          message="Are you sure you want to log out of your account?"
          actionType="logout"
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      </div>
    </Suspense>
  );
};

export default PatientDashboard;
