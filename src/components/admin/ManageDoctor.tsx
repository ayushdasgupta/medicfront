import React, { useEffect, useState } from "react";
import { allDoctor, changeDocPassAdmin, deleteDocAdmin, updateDocAdmin, } from "../../redux/Action/adminaction";
import toast from "react-hot-toast";
import ConfirmationModal from "../ConfirmModal";
import { specializations } from "../../utils/constant";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const ManageDoctor: React.FC = () => {
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [ispass, setIspass] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    id: "",
    actionType: "" as "Delete",
    title: "",
    message: ""
  });
  const [specialization, setSpecialization] = useState<string[]>([]);
  const [customSpec, setCustomSpec] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleDayChange = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };
  const itemsPerPage = 10;

  useEffect(() => {
    allDoctor()
      .then((data) => {
        if (data?.doctors) {
          setDoctors(data.doctors);
        } else {
          console.error("Unexpected data format:", data);
          setDoctors([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      });
  }, []);

  const filteredDoctor = doctors.filter((doctor) => {
    const searchWords = searchQuery.toLowerCase().split(" ");

    return searchWords.every((word) =>
      doctor.name.toLowerCase().includes(word) ||
      doctor.email.toLowerCase().includes(word) ||
      doctor.phone.toString().includes(word)
    );
  });
  const openConfirmationModal = (action: "Delete", id: string) => {
    const doctorName = doctors.find(a => a._id === id)?.name;

    const modalDetails = {
      id: id,
      actionType: action,
      title: "Delete Doctor",
      message: `Are you sure that you want to delete doctor named ${doctorName} ? This process cannot be undone.`
    };

    setModalData(modalDetails);
    setIsModalOpen(true);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredDoctor.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDoctors = filteredDoctor.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id: string) => {
    openConfirmationModal("Delete", id);
  }

  const handleConfirmAction = async () => {
    try {
      const data = await deleteDocAdmin(modalData.id)
      toast.success(data.message)
      setIsModalOpen(false);
      // Refresh medicine list after deletion
      const updatedPatient = await allDoctor();
      if (updatedPatient?.doctors) {
        setDoctors(updatedPatient.doctors);
      }
    } catch (error: any) {
      toast.error(error.message)
      setIsModalOpen(false);
    }
  }

  const handleCancelAction = () => {
    setIsModalOpen(false);
  };
  const handleUpdate = (doctor: IDoctor) => {
    setSelectedDoctor(doctor);
    setSelectedDays([...doctor.availability]);
    setSpecialization([...doctor.specialization]);
    setIsEditing(true);
  };
  const handleChange = (doctor: IDoctor) => {
    setSelectedDoctor(doctor);
    setIspass(true);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    const formData = {
      id: selectedDoctor._id,
      specialization: specialization,
      maxAppointmentsPerDay: selectedDoctor.maxAppointmentsPerDay,
      availableHoursStart: selectedDoctor.availableHours.start,
      availableHoursEnd: selectedDoctor.availableHours.end,
      availability: [...selectedDays],
    };
    
    updateDocAdmin(formData)
      .then(() => {
        toast.success("Doctor updated successfully!");
        setIsEditing(false);
        setSelectedDoctor(null);
      })
      .catch((error) => {
        toast.error(error.message);
        console.error(error);
      });
  };
  const handlePassSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDoctor) return;
    const formData = {
      id: selectedDoctor._id,
      password: selectedDoctor.password
    }
    changeDocPassAdmin(formData)
      .then(() => {
        toast.success("Update Password Successfully !!!")
        setIspass(false);
        setSelectedDoctor(null);
      })
      .catch((e) => toast.error(e.message))
  }

  const closeModal = () => {
    setIsEditing(false);
    setIspass(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="bg-white/30 min-h-[50vh] backdrop-blur-md p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Doctors</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search doctors by name, email, and phone with a space"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="px-4 py-2 border border-gray-300">#</th>
              <th className="px-4 py-2 border border-gray-300">Name</th>
              <th className="px-4 py-2 border border-gray-300">Email</th>
              <th className="px-4 py-2 border border-gray-300">Phone</th>
              <th className="px-4 py-2 border border-gray-300">Specialization</th>
              <th className="px-4 py-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDoctors.length > 0 ? (
              paginatedDoctors.map((doctor, index) => (
                <tr key={doctor._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border border-gray-300 text-center">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">{doctor.name}</td>
                  <td className="px-4 py-2 border border-gray-300">{doctor.email}</td>
                  <td className="px-4 py-2 border border-gray-300">{doctor.phone}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center">
                    {Array.isArray(doctor.specialization)
                      ? doctor.specialization.join(", ")
                      : doctor.specialization}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 text-center">
                    <button
                      onClick={() => handleUpdate(doctor)}
                      className="bg-lime-500 text-white px-4 py-1 rounded-lg hover:bg-lime-600 transition mr-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleChange(doctor)}
                      className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition mr-2"
                    >
                      Change Password
                    </button>
                    <button
                      onClick={() => handleDelete(doctor._id)}
                      className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-800 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No doctors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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

      {/* Improved Update Doctor Details Modal */}
      {isEditing && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl lg:max-w-none lg:w-[60vw]">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-semibold text-blue-700">Update Doctor Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-6">
              {/* First Row: 4 Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="specialization" className="text-gray-700 text-sm block mb-1">
                    Specializations
                  </label>

                  {/* Dropdown selection */}
                  <div className="flex gap-2 mb-2">
                    <select
                      id="specialization-select"
                      className="border rounded px-2 py-1 w-full"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") return;

                        if (value === "Other") {
                          setShowCustomInput(true);
                        } else if (!specialization.includes(value)) {
                          setSpecialization((prev) => [...prev, value]);
                        }

                        // Reset dropdown
                        e.target.value = "";
                      }}
                    >
                      <option value="">Select specialization</option>
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Custom input for 'Other' */}
                  {showCustomInput && (
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Enter custom specialization"
                        className="border rounded px-2 py-1 w-full"
                        value={customSpec}
                        onChange={(e) => setCustomSpec(e.target.value)}
                      />
                      <button
                        type="button"
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() => {
                          const trimmed = customSpec.trim();
                          if (trimmed && !specialization.includes(trimmed)) {
                            setSpecialization((prev) => [...prev, trimmed]);
                          }
                          setCustomSpec("");
                          setShowCustomInput(false);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  )}

                  {/* Display selected specializations */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {specialization.map((spec) => (
                      <span
                        key={spec}
                        className="bg-gray-200 text-sm px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        {spec}
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 text-xs"
                          onClick={() =>
                            setSpecialization((prev) => prev.filter((s) => s !== spec))
                          }
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>



                <div>
                  <label className="block mb-1 font-medium text-gray-700">Max Appointments/Day</label>
                  <input
                    type="number"
                    value={selectedDoctor.maxAppointmentsPerDay}
                    onChange={(e) =>
                      setSelectedDoctor((prev) =>
                        prev
                          ? { ...prev, maxAppointmentsPerDay: Number(e.target.value) }
                          : null
                      )
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none transition-shadow"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">Start Time</label>
                  <input
                    type="time"
                    value={selectedDoctor.availableHours.start}
                    onChange={(e) =>
                      setSelectedDoctor((prev) =>
                        prev
                          ? { ...prev, availableHours: { ...prev.availableHours, start: e.target.value } }
                          : null
                      )
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none transition-shadow"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">End Time</label>
                  <input
                    type="time"
                    value={selectedDoctor.availableHours.end}
                    onChange={(e) =>
                      setSelectedDoctor((prev) =>
                        prev
                          ? { ...prev, availableHours: { ...prev.availableHours, end: e.target.value } }
                          : null
                      )
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none transition-shadow"
                  />
                </div>
              </div>

              {/* Second Row: Available Days */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">Available Days</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 bg-gray-50 p-4 rounded-lg">
                  {daysOfWeek.map((day) => (
                    <label key={day} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value={day}
                        checked={selectedDays.includes(day)}
                        onChange={() => handleDayChange(day)}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Improved Password Change Modal */}
      {ispass && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-semibold text-green-700">Update Doctor Password</h3>
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
                  value={selectedDoctor.password}
                  onChange={(e) =>
                    setSelectedDoctor((prev) =>
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

export default ManageDoctor;