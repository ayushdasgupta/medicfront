import React, { useEffect, useState, Suspense, lazy } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks/custom";
import { loadDoc, logoutDoc, doctorupdatepassword } from "../redux/Action/doctoraction";
import { useNavigate } from "react-router-dom";
import { loaddoctorinfo, logout } from "../redux/slice/doctorSlice";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import ConfirmationModal from "../components/ConfirmModal";
import { APPNAME } from "../utils/constant";

// Lazy load components
const Navbar = lazy(() => import("../components/Navbar"));
const Sidebar = lazy(() => import("../components/Sidebar"));
const ViewAppointments = lazy(() => import("../components/doctor/ViewAppointments"));
const PatientHistory = lazy(() => import("../components/doctor/PatientHistory"));
const UpdateProfile = lazy(() => import("../components/doctor/UpdateProfile"));
const UpdatePassword = lazy(() => import("../components/Updatepassword"));
const UpdateAvatar = lazy(() => import("../components/doctor/UpdateAvatar"));

const DoctorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("viewAppointments");
  const [loading, setLoading] = useState<boolean>(true);
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    loadDoc()
      .then((data) => {
        dispatch(loaddoctorinfo(data));
        setLoading(false);
      })
      .catch((e) => {
        navigate("/");
        toast.error(e.message);
      });
  }, [dispatch, navigate]);

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmLogout = () => {
    logoutDoc()
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

  const { doctor } = useAppSelector((state) => state.doctor);

  const doctorName = doctor?.name;

  const renderContent = () => {
    switch (activeTab) {
      case "viewAppointments":
        return <ViewAppointments />;
      case "patientHistory":
        return <PatientHistory />;
      case "updateProfile":
        return <UpdateProfile />;
      case "updatePassword":
        return (
          <UpdatePassword role="doctor" updatePasswordAction={doctorupdatepassword} />
        );
      case "updateAvatar":
        return <UpdateAvatar />;
      default:
        return <ViewAppointments />;
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <Suspense fallback={<Loader />}>
      <div className="flex h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={[
            { id: "viewAppointments", label: "View Appointments" },
            { id: "patientHistory", label: "Patient History" },
            { id: "updateProfile", label: "Update Profile" },
            { id: "updateAvatar", label: "Update Image" },
            { id: "updatePassword", label: "Update Password" },
          ]}
          name={doctorName}
          logout={handleLogoutClick}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Navbar
            websiteName={`${APPNAME} Doctor Dashboard`}
            patientName={doctorName}
            onLogout={handleLogoutClick}
          />
          <div className="overflow-auto p-8">{renderContent()}</div>
        </div>

        {/* Logout Confirmation Modal */}
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

export default DoctorDashboard;