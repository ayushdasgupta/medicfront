import React, { Suspense, lazy, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { loadReceptionist, logoutReceptionist, receptionistupdatepassword } from "../redux/Action/receptionistaction";
import { useAppDispatch, useAppSelector } from "../redux/hooks/custom";
import { loadreceptionistinfo, logout } from "../redux/slice/receptionistSlice";
import ConfirmationModal from "../components/ConfirmModal";
import { APPNAME } from "../utils/constant";

// Lazy load components
const Navbar = lazy(() => import("../components/Navbar"));
const Sidebar = lazy(() => import("../components/Sidebar"));
const ShowAppointments = lazy(() => import("../components/receptionist/ShowAppointment"));
const Emergency = lazy(() => import("../components/receptionist/Emergency"));
const AvailableBeds = lazy(() => import("../components/receptionist/AvailableBeds"));
const UpdatePatient = lazy(() => import("../components/receptionist/UpdatePatient"));
const PatientList = lazy(() => import("../components/receptionist/PatientList"));
const DoctorList = lazy(() => import("../components/receptionist/DoctorList"));
const GenerateInvoice = lazy(() => import("../components/receptionist/InvoiceGenerate"));
const UpdateProfile = lazy(() => import("../components/receptionist/UpdateProfile"));
const UpdatePassword = lazy(() => import("../components/Updatepassword"));
const UpdateAvatar = lazy(() => import("../components/receptionist/UpdateAvatar"));

const ReceptionistDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("viewAppointments");
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        loadReceptionist()
            .then((data) => {
                dispatch(loadreceptionistinfo(data));
                setLoading(false);
            })
            .catch((e) => {
                navigate("/");
                toast.error(e.message);
            });
    }, [dispatch, navigate]);

    const handleLogout = () => {
        setIsModalOpen(true);

    };
    const handleConfirmLogout = () => {
        logoutReceptionist()
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
    const { receptionist } = useAppSelector((state) => state.receptionist);

    const receptionistName = receptionist?.name;

    const renderContent = () => {
        switch (activeTab) {
            case "showAppointments":
                return <ShowAppointments />;
            case "emergecy":
                return <Emergency />;
            case "bedAvailable":
                return <AvailableBeds />;
            case "generateInvoice":
                return <GenerateInvoice />;
            case "updatePatient":
                return <UpdatePatient />;
            case "patientList":
                return <PatientList />;
            case "doctorList":
                return <DoctorList />;
            case "updateProfile":
                return <UpdateProfile />;
            case "updatePassword":
                return (
                    <UpdatePassword role="receptionist" updatePasswordAction={receptionistupdatepassword} />
                );
            case "updateAvatar":
                return <UpdateAvatar />;
            default:
                return <ShowAppointments />;
        }
    };

    return loading ? (
        <Loader />
    ) : (
        <Suspense fallback={<Loader />}>
            <div className="overflow-auto flex h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100">
                {/* Sidebar */}
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    tabs={[
                        { id: "showAppointments", label: "Show Appointments" },
                        { id: "emergecy", label: "Emergency" },
                        { id: "bedAvailable", label: "Bed Available" },
                        { id: "patientList", label: "Patients list" },
                        { id: "updatePatient", label: "Update Patient" },
                        { id: "doctorList", label: "Doctors list" },
                        { id: "generateInvoice", label: "Generate Invoice" },
                        { id: "updateProfile", label: "Update Profile" },
                        { id: "updateAvatar", label: "Update Image" },
                        { id: "updatePassword", label: "Update Password" },
                    ]}
                    name={receptionistName}
                    logout={handleLogout}
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    <Navbar
                        websiteName={`${APPNAME} Reception`}
                        patientName={receptionistName}
                        onLogout={handleLogout}
                    />
                    <div className="overflow-auto p-8">{renderContent()}</div>
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

export default ReceptionistDashboard;
