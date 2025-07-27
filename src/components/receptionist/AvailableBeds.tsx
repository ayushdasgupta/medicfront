import React, { useEffect, useState } from "react";
import { allAvailableBeds, assignPatient, dischargePatient } from "../../redux/Action/receptionistaction";
import toast from "react-hot-toast";
import { Copy } from "lucide-react";

const AvailableBeds: React.FC = () => {
    const [beds, setBeds] = useState<IBeds[]>([]);
    const [bedId, setBedId] = useState<string>("")
    const [isBook, setIsBook] = useState(false);
    const [patientId, setPatientId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    useEffect(() => {
        allAvailableBeds()
            .then((data) => {
                if (data?.bed) {

                    setBeds(data?.bed);
                } else {
                    console.error("Unexpected data format:", data);
                    setBeds([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching beds:", error);
                setBeds([]);
            });
    }, []);

    const filteredBeds = beds.filter((beds) => {
        const searchWords = searchQuery.toLowerCase().split(" "); // Split search query into words

        return searchWords.every((word) =>
            beds.bednumber.toString().includes(word) ||
            beds.floornumber.toString().includes(word) ||
            beds.ward.toLowerCase().includes(word) ||
            beds.category.toLowerCase().includes(word) ||
            beds.status.toLowerCase().includes(word) ||  // Allow status-based filtering
            beds.perDayCharge.toString().includes(word) // Allow charge-based filtering
        );
    });

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            bedId,
            patientId
        }
        try {
            const data = await assignPatient(formData)
            allAvailableBeds().then((data) => {
                setBeds(data.bed || [])
            })
            setIsBook(false)
            setPatientId(null)
            toast.success(data.message)

        } catch (error: any) {
            toast.error(error.message)
        }


    }
    const totalPages = Math.ceil(filteredBeds.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedBeds = filteredBeds.slice(startIndex, startIndex + itemsPerPage);
    const handleAssign = (id: string) => {
        setIsBook(true)
        setBedId(id)
    }
    const handledischarge = async (id: string) => {
        const formData = {
            "bedId": id
        }
        try {
            const data = await dischargePatient(formData)
            allAvailableBeds().then((data) => {
                setBeds(data.bed || [])
            })
            toast.success(data.message)
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    return (
        <div className="bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Beds</h2>
            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search Beds by bed no, floor no, category, status and charge with a space"
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
                            <th className="px-4 py-2 border border-gray-300">Bed No</th>
                            <th className="px-4 py-2 border border-gray-300">Floor No</th>
                            <th className="px-4 py-2 border border-gray-300">Ward</th>
                            <th className="px-4 py-2 border border-gray-300">Patient</th>
                            <th className="px-4 py-2 border border-gray-300">Category</th>
                            <th className="px-4 py-2 border border-gray-300">Charge</th>
                            <th className="px-4 py-2 border border-gray-300">Status</th>
                            <th className="px-4 py-2 border border-gray-300">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedBeds.length > 0 ? (
                            paginatedBeds.map((bed) => (
                                <tr key={bed._id} className="hover:bg-gray-100">

                                    <td className="px-4 py-2 border border-gray-300 text-center">{bed.bednumber}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{bed.floornumber}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{bed.ward}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">
                                        {bed.patient === null ? "No patient" : bed.patient?._id}
                                        {bed.patient && (
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(bed.patient!._id);
                                                    toast.success("Copied!");
                                                }}
                                                className="p-1 bg-gray-200 hover:bg-gray-300 rounded-md"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>

                                    <td className="px-4 py-2 border border-gray-300 text-center">{bed.category}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{bed.perDayCharge.toString()}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{bed.status}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">
                                        {
                                            bed.status === "Available" ? <button
                                                onClick={() => handleAssign(bed._id)}
                                                className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition mr-2"
                                            >
                                                Assign
                                            </button> : <>
                                                <button
                                                    onClick={() => handledischarge(bed._id)}
                                                    className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition mr-2"
                                                >
                                                    Discharge
                                                </button>

                                            </>
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
            {isBook && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Assign Patient</h3>
                        <form onSubmit={handleBook} className="space-y-4">
                            <div>
                                <label className="block mb-1">Enter Patient ID</label>
                                <input
                                    type="text"
                                    value={patientId as string}
                                    onChange={(e) =>
                                        setPatientId(e.target.value)
                                    }
                                    placeholder="Enter here"
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsBook(false);
                                    }}
                                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    Assign
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvailableBeds;
