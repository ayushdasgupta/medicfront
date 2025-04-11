import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {allAppointment ,deleteAppointmentAdmin } from "../../redux/Action/adminaction";

const ManageAppointment: React.FC = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    allAppointment().then((data) => {
      if (data?.appointments) {
        setAppointments(data.appointments)
        console.log(appointments);

      } else {
        console.error("Unexpected data format:", data);
        setAppointments([]);
      }
    }).catch((error) => {
      console.error("Error fetching doctors:", error);
      setAppointments([]);
    });
  }, [])

  const filteredAppointment = appointments.filter(
    (appointment) =>
      appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.date.toISOString().split("T")[0].includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredAppointment.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointment = filteredAppointment.slice(startIndex, startIndex + itemsPerPage);

  // Delete a patient
  const handleDelete = (id: string) => {
    deleteAppointmentAdmin(id).then((data) => {
      toast.success(data.message)
    }).catch((e) => {
      toast.error(e.message)
    })
  };

  return (
    <div className="bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Appointments</h2>
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search appointment by patient,doctor and date"
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
              <th className="px-4 py-2 border border-gray-300">Date</th>
              <th className="px-4 py-2 border border-gray-300">Doctor</th>
              <th className="px-4 py-2 border border-gray-300">Patient</th>
              <th className="px-4 py-2 border border-gray-300">Status</th>
              <th className="px-4 py-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAppointment.length > 0 ? (
              paginatedAppointment.map((appointment, index) => (
                <tr key={appointment._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border border-gray-300 text-center">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">{appointment.date.toLocaleString().split("T")[0]}</td>
                  <td className="px-4 py-2 border border-gray-300">{appointment.doctor}</td>
                  <td className="px-4 py-2 border border-gray-300">{appointment.patient}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center">{appointment.status}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center">
                    <button
                      onClick={() => handleDelete(appointment._id)}
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
                  No appointments found.
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

export default ManageAppointment;
