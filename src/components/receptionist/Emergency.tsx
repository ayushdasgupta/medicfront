import React, { useEffect, useState } from "react";
import { allEmergencyBeds, dischargePatient, emergencyAssignPatient } from "../../redux/Action/receptionistaction";
import toast from "react-hot-toast";

const Emergency: React.FC = () => {
    const [patients, setPatients] = useState<IBeds[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    useEffect(() => {
        allEmergencyBeds()
            .then((data) => {
                if (data?.bed) {
                    // Filter out beds where patient is null

                    setPatients(data.bed);
                } else {
                    console.error("Unexpected data format:", data);
                    setPatients([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching emergency beds:", error);
                setPatients([]);
            });
    }, []);

    const filteredPatients = patients.filter(
        (patient) =>
            // patient.bednumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.bednumber.toString().includes(searchQuery) ||
            patient.floornumber.toString().includes(searchQuery) ||
            patient.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);
    const handleAssign = async (id: string) => {
        console.log(id);
        const formdata = {
            "bedId": id
        }
        try {
            const data = await emergencyAssignPatient(formdata)
            toast.success(data.message)

        } catch (error: any) {
            toast.error(error.message)
        }

    }
    const handledischarge =async (id: string) => {
        const formdata={
            "bedId":id
        }
        try {
            const data = await dischargePatient(formdata)
            toast.success(data.message)
        } catch (error:any) {
            toast.error(error.message)
        }
    }

    return (
        <div className="bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Emergency Beds</h2>
            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search Beds by bed no, category and  floor no with a space"
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
                            <th className="px-4 py-2 border border-gray-300">#</th>
                            <th className="px-4 py-2 border border-gray-300">Bed No</th>
                            <th className="px-4 py-2 border border-gray-300">Floor No</th>
                            <th className="px-4 py-2 border border-gray-300">Ward</th>
                            <th className="px-4 py-2 border border-gray-300">Category</th>
                            <th className="px-4 py-2 border border-gray-300">Status</th>
                            <th className="px-4 py-2 border border-gray-300">Charge</th>
                            <th className="px-4 py-2 border border-gray-300">Action</th>

                        </tr>
                    </thead>
                    <tbody>
                        {paginatedPatients.length > 0 ? (
                            paginatedPatients.map((patient, index) => (
                                <tr key={patient._id} className="hover:bg-gray-100">
                                    <td className="px-4 py-2 border border-gray-300 text-center">
                                        {startIndex + index + 1}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{patient.bednumber}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{patient.floornumber}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{patient.ward}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{patient.category}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{patient.status}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{patient.perDayCharge.toString()}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">
                                        {
                                            patient.status === "Available" ? <button
                                                onClick={() => handleAssign(patient._id)}
                                                className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition mr-2"
                                            >
                                                Assign
                                            </button> : <button
                                                onClick={() => handledischarge(patient._id)}
                                                className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition mr-2"
                                            >
                                                Discharge
                                            </button>
                                        }
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-gray-500">
                                    No Beds found.
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
        </div>
    );
};

export default Emergency;
