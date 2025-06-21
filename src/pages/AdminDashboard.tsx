import React, { Suspense, lazy, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { loadnAdmin, loagoutnAdmin } from "../redux/Action/adminaction";
import { useAppDispatch, useAppSelector } from "../redux/hooks/custom";
import { loadadmininfo, logout } from "../redux/slice/adminSlice";
import CreateWrapper from "../components/admin/wrapper/Createwrapper"
import ConfirmationModal from "../components/ConfirmModal";
import { APPNAME } from "../utils/constant";


// Lazy load components
const Navbar = lazy(() => import("../components/Navbar"));
const Sidebar = lazy(() => import("../components/Sidebar"));
const RoleWrapper = lazy(() => import("../components/admin/wrapper/Rolewrapper"))
const Reports = lazy(() => import("../components/admin/Reports"));
const ManageUsers = lazy(() => import("../components/admin/ManagePatients"));
const ManageAppointment = lazy(() => import("../components/admin/ManageAppointment"));

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("managePatient");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    loadnAdmin()
      .then((data) => {
        dispatch(loadadmininfo(data));
        setLoading(false);
      })
      .catch((e) => {
        navigate("/");
        toast.error(e.message);
      });
  }, []);

  const { admin } = useAppSelector((state) => state.admin);
  const adminName = admin?.name;

  const handleLogout = () => {
    setIsModalOpen(true);

  };
  const handleConfirmLogout = () => {
    loagoutnAdmin()
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
      case "managePatient":
        return <ManageUsers />;
      case "manageUsers":
        return <RoleWrapper />;
      case "manageAppointment":
        return <ManageAppointment />;
      case "hospitalSettings":
        return <CreateWrapper />;
      case "reports":
        return <Reports />;
      default:
        return <ManageUsers />;
    }
  };

  return loading === true ? (
    <Loader />
  ) : (
    <Suspense fallback={<Loader />}>
      <div className="overflow-auto flex h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={[
            { id: "managePatient", label: "Manage Patient" },
            { id: "manageUsers", label: "Manage Users" },
            { id: "manageAppointment", label: "Manage Appointment" },
            { id: "hospitalSettings", label: "Create Role" },

            { id: "reports", label: "Reports" },
          ]}
          name={adminName}
          logout={handleLogout}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Navbar
            websiteName={`${APPNAME} Admin`}
            patientName={adminName}
            onLogout={handleLogout}
          />
          <div className="overflow-auto p-8">{renderContent()}</div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Logout"
        message="Are you sure you want to log out of your account?"
        actionType="logout"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </Suspense>
  );
};

export default AdminDashboard;
