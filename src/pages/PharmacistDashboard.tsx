import React, { Suspense, lazy, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { loadPharmacist, logoutPharmacist, pharmacististupdatepassword } from "../redux/Action/pharmacistaction";
import { useAppDispatch, useAppSelector } from "../redux/hooks/custom";
import { loadpharmacistinfo } from "../redux/slice/pharmacistSlice";
import ConfirmationModal from "../components/ConfirmModal";
import { APPNAME } from "../utils/constant";

// Lazy load components
const Navbar = lazy(() => import("../components/Navbar"));
const Sidebar = lazy(() => import("../components/Sidebar"));
const MedicineCreate = lazy(() => import("../components/pharmacist/MedicineCreate"));
const UpdateMedicine = lazy(() => import("../components/pharmacist/UpdateMedicine"));
const AllMedicines = lazy(() => import("../components/pharmacist/AllMedicines"));
const UpdateProfilePharmacist = lazy(() => import("../components/pharmacist/Updateprofile"));
const PatientList = lazy(() => import("../components/pharmacist/PatientList"));
const UpdatePatient = lazy(() => import("../components/receptionist/UpdatePatient"));
const UpdateAvatar = lazy(() => import("../components/pharmacist/UpdateAvatar"));
const UpdatePassword = lazy(() => import("../components/Updatepassword"));


const PharmacistDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("viewAppointments");
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        loadPharmacist()
            .then((data) => {
                dispatch(loadpharmacistinfo(data));
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
    const handleConfirmLogout = async() => {
        try {
            const data = await logoutPharmacist()
            toast.success(data.message)
            navigate("/")
        } catch (error: any) {
            toast.error(error.message)
        }
        setIsModalOpen(false);
    };
    const handleCancelLogout = () => {
        setIsModalOpen(false);
    };
    const { pharmacist } = useAppSelector((state) => state.pharmacist);

    const pharmacistName = pharmacist?.name;

    const renderContent = () => {
        switch (activeTab) {
            case "allMedicine":
                return <AllMedicines />
            case "createMedicine":
                return <MedicineCreate />;
            case "updateMedicine":
                return <UpdateMedicine />;
            case "updatePatient":
                return <UpdatePatient />;
            case "updateAvatar":
                return <UpdateAvatar />;
            case "patientList":
                return <PatientList />;
            case "updateProfile":
                return <UpdateProfilePharmacist />;
            case "updatePassword":
                return (
                    <UpdatePassword role="pharmacist" updatePasswordAction={pharmacististupdatepassword} />
                );
            default:
                return <AllMedicines />;
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
                        { id: "allMedicine", label: "All Medicine" },
                        { id: "patientList", label: "Patient list" },
                        { id: "createMedicine", label: "Create Medicine" },
                        { id: "updateMedicine", label: "Update Medicine" },
                        { id: "updateProfile", label: "Update Profile" },
                        { id: "updateAvatar", label: "Update Avatar" },
                        { id: "updatePassword", label: "Update Password" },
                    ]}
                    name={pharmacistName!}
                    logout={handleLogout}
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    <Navbar
                        websiteName={`${APPNAME} Pharma`}
                        patientName={pharmacistName!}
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

export default PharmacistDashboard;
