import React, { useEffect, useState } from "react";
import {allBeds, deleteBeds } from "../../redux/Action/adminaction";
import toast from "react-hot-toast";
import ConfirmationModal from "../ConfirmModal";

const ManageBeds: React.FC = () => {
  const [beds, setBeds] = useState<IBeds[]>([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const [modalData, setModalData] = useState({
      id: "",
      actionType: "" as "Delete",
      title: "",
      message: ""
    });
  useEffect(()=>{
    allBeds().then((data:any)=>{
      if(data?.beds){
        setBeds(data.beds)
      }else{
        console.error("Unexpected data format:", data);
        setBeds([]);
      }
    }) .catch((error:any) => {
      console.error("Error fetching beds:", error);
      setBeds([]);
    });
  },[])
 
  const filteredBeds = beds.filter(
    (beds) =>
      // beds.bednumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      beds.bednumber.toString().includes(searchQuery) ||
      beds.floornumber.toString().includes(searchQuery) ||
      beds.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredBeds.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredBeds.slice(startIndex, startIndex + itemsPerPage);
  const openConfirmationModal = (action: "Delete", id: string) => {
    const status = beds.find(a => a._id === id)?.status;

    const modalDetails = {
      id: id,
      actionType: action,
      title: "Delete Bed",
      message: `Are you sure that you want to delete bed which is ${status} ? This process cannot be undone.`
    };

    setModalData(modalDetails);
    setIsModalOpen(true);
  };
  // Delete a bed
  const handleDelete = (id: string) => {
    openConfirmationModal("Delete", id)
  
  };
  const handleConfirmAction = async () => {
    try {
      const data = await deleteBeds(modalData.id)
      toast.success(data.message)
      setIsModalOpen(false);
      // Refresh medicine list after deletion
      const updatedBeds = await allBeds();
      if (updatedBeds?.beds) {
        setBeds(updatedBeds.beds);
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
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Beds</h2>
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Beds by catagory, floor no"
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
              <th className="px-4 py-2 border border-gray-300">Catagory</th>
              <th className="px-4 py-2 border border-gray-300">Charge</th>
              <th className="px-4 py-2 border border-gray-300">Status</th>
              <th className="px-4 py-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPatients.length > 0 ? (
              paginatedPatients.map((beds, index) => (
                <tr key={beds._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border border-gray-300 text-center">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 text-center">{beds.bednumber}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center">{beds.floornumber}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center">{beds.ward}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center">{beds.category}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center">{beds.perDayCharge.toString()}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center">{beds.status}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center">
                    <button
                      onClick={() => handleDelete(beds._id)}
                      className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No beds found.
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
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
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
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
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

export default ManageBeds;
