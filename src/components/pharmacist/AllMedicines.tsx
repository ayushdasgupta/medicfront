import { Copy } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { allMedicine, deleteMedicine, sellMedicine } from "../../redux/Action/pharmacistaction";
import ConfirmationModal from "../ConfirmModal";

const AllMedicines: React.FC = () => {
    const [medicines, setMedicines] = useState<IMedicine[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [patientId, setPatientId] = useState<string>("")
    const [quantity, setQuantity] = useState<string>("")
    const [isSell, setIsSell] = useState(false);
    const [medicineId, setMedicineId] = useState("")
    const itemsPerPage = 10;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({
        appointmentId: "",
        actionType: "" as "Delete",
        title: "",
        message: ""
    });
    useEffect(() => {
        allMedicine()
            .then((data) => {
                if (data?.medicines) {

                    setMedicines(data?.medicines);
                } else {
                    console.error("Unexpected data format:", data);
                    setMedicines([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching beds:", error);
                setMedicines([]);
            });
    }, []);
    const openConfirmationModal = (action: "Delete", id: string) => {
        const medicineName = medicines.find(a => a._id === id)?.name;

        const modalDetails = {
            appointmentId: id,
            actionType: action,
            title: "Delete Medicine",
            message: `Are you sure that you want to delete ${medicineName} medicine? This process cannot be undone.`
        };

        setModalData(modalDetails);
        setIsModalOpen(true);
    };
    const filteredMedicine = medicines.filter((medicine) => {
        const searchWords = searchQuery.toLowerCase().split(" "); // Split search query into words

        return searchWords.every((word) =>
            medicine.name.toString().includes(word) ||
            medicine.quantity.toString().includes(word) ||
            medicine.category.toLowerCase().includes(word) ||
            medicine.perUnitCost.toString().includes(word) // Allow charge-based filtering
        );
    });


    const totalPages = Math.ceil(filteredMedicine.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPatients = filteredMedicine.slice(startIndex, startIndex + itemsPerPage);
    const handleSell = async (id: string) => {
        setIsSell(true);
        setMedicineId(id)
    }

    const handleBtn = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            const formdata = {
                medicineId, patientId, quantity
            }
            const data = await sellMedicine(formdata)
            
            toast.success(data.message)
            allMedicine().then((data) => {
                setMedicines(data?.medicines);
            })
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleDelete = (id: string) => {
        openConfirmationModal("Delete", id);
    }

    const handleConfirmAction = async () => {
        try {
            const data = await deleteMedicine(modalData.appointmentId)

            toast.success(data.message)
            setIsModalOpen(false);
            // Refresh medicine list after deletion
            const updatedMedicines = await allMedicine();
            if (updatedMedicines?.medicines) {
                setMedicines(updatedMedicines.medicines);
            }
        } catch (error: any) {
            toast.error(error.message)
            setIsModalOpen(false);
        }
    }

    const handleCancelAction = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Medicines</h2>
            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search medicines by catagory, name, Quantity and Unit cost with a space"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                />
            </div>

            {/* Patients Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="px-4 py-2 border border-gray-300">Medicine ID</th>
                            <th className="px-4 py-2 border border-gray-300">Name</th>
                            <th className="px-4 py-2 border border-gray-300">Quantity</th>
                            <th className="px-4 py-2 border border-gray-300">Unit charge</th>
                            <th className="px-4 py-2 border border-gray-300">Tax</th>
                            <th className="px-4 py-2 border border-gray-300">Category</th>
                            <th className="px-4 py-2 border border-gray-300">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedPatients.length > 0 ? (
                            paginatedPatients.map((medicine) => (
                                <tr key={medicine._id} className="hover:bg-gray-100">
                                    <td className="px-4 py-2 border border-gray-300 flex items-center gap-2">
                                        {medicine._id}
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(medicine._id);
                                                toast.success("Copied!");
                                            }}
                                            className="p-1 bg-gray-200 hover:bg-gray-300 rounded-md"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{medicine.name}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{medicine.quantity}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{medicine.perUnitCost.toString()}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{medicine.tax}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{medicine.category}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">
                                        <button
                                            onClick={() => handleSell(medicine._id)}
                                            className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition mr-2"
                                        >
                                            Sell
                                        </button>
                                        <button
                                            onClick={() => handleDelete(medicine._id)}
                                            className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition mr-2"
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-gray-500">
                                    No Medicines found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg ${currentPage === 1
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                    >
                        Previous
                    </button>
                    <span className="text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg ${currentPage === totalPages
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                    >
                        Next
                    </button>
                </div>
            )}
            {isSell && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Sell medicine</h3>
                        <form onSubmit={handleBtn} className="space-y-4">
                            <div>
                                <label className="block mb-1">Enter Patient ID</label>
                                <input
                                    type="text"
                                    value={patientId}
                                    placeholder="Enter ID"
                                    onChange={(e) =>
                                        setPatientId(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Quantity</label>
                                <select value={quantity}
                                    onChange={(e) =>
                                        setQuantity(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border rounded-lg">
                                    <option value="">Select Quantity</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>

                                </select>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSell(false);
                                    }}
                                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    Sell
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <ConfirmationModal
                isOpen={isModalOpen}
                title={modalData.title}
                message={modalData.message}
                actionType={modalData.actionType as "Delete"}
                onConfirm={handleConfirmAction}
                onCancel={handleCancelAction}
            />
        </div>
    );
};

export default AllMedicines;