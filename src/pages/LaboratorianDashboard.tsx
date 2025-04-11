import React, { Suspense, lazy, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { laboratorianupdatepassword, loadlaboratorian, logoutlaboratorian } from "../redux/Action/laboratorianaction";
import { useAppDispatch, useAppSelector } from "../redux/hooks/custom";
import { loadLaboratorianinfo } from "../redux/slice/laboratorianSlice";
import ConfirmationModal from "../components/ConfirmModal";

// Lazy load components
const Navbar = lazy(() => import("../components/Navbar"));
const Sidebar = lazy(() => import("../components/Sidebar"));
const TestForm = lazy(() => import("../components/laboratorian/Test"));
const UpdateProfilePharmacist = lazy(() => import("../components/laboratorian/Updateprofile"));
const PatientList = lazy(() => import("../components/laboratorian/PatientList"));
const UpdateAvatar = lazy(() => import("../components/laboratorian/UpdateAvatar"));
const UploadReport= lazy(() => import("../components/laboratorian/UploadReport"));
const UpdatePassword = lazy(() => import("../components/Updatepassword"));


const LaboratorianDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("patientList");
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        loadlaboratorian()
            .then((data) => {
                dispatch(loadLaboratorianinfo(data));
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
            const data = await logoutlaboratorian()
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
    const { laboratorian } = useAppSelector((state) => state.laboratorian);

    const laboratorianName = laboratorian?.name;

    const renderContent = () => {
        switch (activeTab) {
            case "testCreate":
                return <TestForm />;
            case "uploadReport":
                return <UploadReport />;
            case "patientList":
                return <PatientList />;
            case "updateProfile":
                return <UpdateProfilePharmacist />;
            case "updateAvatar":
                return <UpdateAvatar />;
            case "updatePassword":
                return (
                    <UpdatePassword role="laboratorian" updatePasswordAction={laboratorianupdatepassword} />
                );
            default:
                return <PatientList />;
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
                        { id: "patientList", label: "Patient list" },
                        { id: "testCreate", label: "Create Test" },
                        { id: "uploadReport", label: "Upload Report" },
                        { id: "updateProfile", label: "Update Profile" },
                        { id: "updateAvatar", label: "Update Avatar" },
                        { id: "updatePassword", label: "Update Password" },
                    ]}
                    name={laboratorianName!}
                    logout={handleLogout}
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    <Navbar
                        websiteName="MedicaPro Lab"
                        patientName={laboratorianName!}
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

export default LaboratorianDashboard;
