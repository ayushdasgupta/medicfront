import React, { useEffect, useState } from "react";
import { allReceptionist, changeRecepPassAdmin, deleteReceptioinstAdmin, } from "../../redux/Action/adminaction";
import toast from "react-hot-toast";
import ConfirmationModal from "../ConfirmModal";

const ManageReceptionist: React.FC = () => {
  const [receptionists, setReceptionists] = useState<IReceptionist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedReceptionist, setSelectedReceptionist] = useState<IReceptionist | null>(null);

  const [ispass, setIspass] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalData, setModalData] = useState({
    id: "",
    actionType: "" as "Delete",
    title: "",
    message: ""
  });
  useEffect(() => {
    allReceptionist().then((data) => {
      if (data?.receptionists) {
        setReceptionists(data.receptionists)
      } else {
        console.error("Unexpected data format:", data);
        setReceptionists([]);
      }
    }).catch((error) => {
      console.error("Error fetching receptionist:", error);
      setReceptionists([]);
    });
  }, [])

  const filteredReceptionist = receptionists.filter((receptionist) => {
    const searchWords = searchQuery.toLowerCase().split(" ");

    return searchWords.every((word) =>
      receptionist.name.toLowerCase().includes(word) ||
      receptionist.email.toLowerCase().includes(word) ||
      receptionist.phone.toString().includes(word)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredReceptionist.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredReceptionist.slice(startIndex, startIndex + itemsPerPage);
  const openConfirmationModal = (action: "Delete", id: string) => {
    const receptionistName = receptionists.find(a => a._id === id)?.name;

    const modalDetails = {
      id: id,
      actionType: action,
      title: "Delete Receptionist",
      message: `Are you sure that you want to delete receptionist named ${receptionistName} ? This process cannot be undone.`
    };

    setModalData(modalDetails);
    setIsModalOpen(true);
  };
  // Delete a receptionist
  const handleDelete = (id: string) => {
    openConfirmationModal("Delete", id)
  };
  const handleConfirmAction = async () => {
    try {
      const data = await deleteReceptioinstAdmin(modalData.id)
      toast.success(data.message)
      setIsModalOpen(false);
      // Refresh medicine list after deletion
      const updatedRecptionist = await allReceptionist();
      if (updatedRecptionist?.receptionists) {
        setReceptionists(updatedRecptionist.receptionists);
      }
    } catch (error: any) {
      toast.error(error.message)
      setIsModalOpen(false);
    }
  }

  const handleCancelAction = () => {
    setIsModalOpen(false);
  };

  const handlePassSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReceptionist) return;
    const formData = {
      id: selectedReceptionist._id,
      password: selectedReceptionist.password
    }
    changeRecepPassAdmin(formData)
      .then(() => {
        toast.success("Update Password Successfully !!!")
        setIspass(false);
        setSelectedReceptionist(null);
      })
      .catch((e) => toast.error(e.message))
  }
  const handleChange = (receptionist: IReceptionist) => {
    setSelectedReceptionist(receptionist);
    setIspass(true);
  };
  const closeModal = () => {
    setIspass(false);
    setSelectedReceptionist(null);
  };
  return (
    <div className="bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Receptionists</h2>
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search receptionist by name, email, and phone with a space"
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
              <th className="px-4 py-2 border border-gray-300">Name</th>
              <th className="px-4 py-2 border border-gray-300">Email</th>
              <th className="px-4 py-2 border border-gray-300">Phone</th>
              <th className="px-4 py-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPatients.length > 0 ? (
              paginatedPatients.map((receptionist, index) => (
                <tr key={receptionist._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border border-gray-300 text-center">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">{receptionist.name}</td>
                  <td className="px-4 py-2 border border-gray-300">{receptionist.email}</td>
                  <td className="px-4 py-2 border border-gray-300">{receptionist.phone}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center">
                    <button
                      onClick={() => handleChange(receptionist)}
                      className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition mr-2"
                    >
                      Change Password
                    </button>
                    <button
                      onClick={() => handleDelete(receptionist._id)}
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
                  No receptionist found.
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
      {ispass && selectedReceptionist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-semibold text-green-700">Update Receptionist Password</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <form onSubmit={handlePassSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">New Password</label>
                <input
                  type="text"
                  value={selectedReceptionist.password}
                  onChange={(e) =>
                    setSelectedReceptionist((prev) =>
                      prev ? { ...prev, password: e.target.value } : null
                    )
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-300 focus:outline-none transition-shadow"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Update Password
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

export default ManageReceptionist;
