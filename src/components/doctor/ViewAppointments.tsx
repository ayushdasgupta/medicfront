import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { completedAppointment, rescheduleAppointment } from "../../redux/Action/appointmentaction";
import { loadDoc } from "../../redux/Action/doctoraction";
import { loaddoctorinfo } from "../../redux/slice/doctorSlice";
import { Copy } from "lucide-react";
import ConfirmationModal from "../ConfirmModal";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/custom";


const DoctorAppointmentsTable: React.FC = () => {
    const { doctor } = useAppSelector((state) => state.doctor);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [sortField, setSortField] = useState<keyof IAppointment | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const dispatch=useAppDispatch()
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    appointmentId: "",
    actionType: "" as "Completed" | "Reschedule",
    title: "",
    message: ""
  });

  useEffect(() => {
    if(doctor && doctor.appointments){
      setAppointments(doctor.appointments);

          // Initialize statuses
          const statusMap = appointments.reduce((acc, appointment: IAppointment) => {
            acc[appointment._id] = appointment.status;
            return acc;
          }, {} as Record<string, string>);
          setStatuses(statusMap);
    }
    // let isMounted = true;

    // loadDoc()
    //   .then((data) => {
    //     if (isMounted) {
    //       const appointmentData: IAppointment[] = data.doctor?.appointments || [];
    //       setAppointments(appointmentData);

    //       // Initialize statuses
    //       const statusMap = appointmentData.reduce((acc, appointment: IAppointment) => {
    //         acc[appointment._id] = appointment.status;
    //         return acc;
    //       }, {} as Record<string, string>);
    //       setStatuses(statusMap);

    //       loaddoctorinfo(data);
    //     }
    //   })
    //   .catch((error) => toast.error(error.message));

    // return () => {
    //   isMounted = false;
    // };
  }, [doctor]);

  const rowsPerPage = 5;
  const totalPages = Math.ceil(appointments.length / rowsPerPage);
  const today = new Date().toISOString().split("T")[0];
  // Sorting logic
  const sortedAppointments = [...appointments]
  .filter((appt) => appt.date.toLocaleString().split("T")[0] === today) // Filter only today's appointments
  .sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue! < bValue!) return sortDirection === "asc" ? -1 : 1;
    if (aValue! > bValue!) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
  // Pagination logic
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedAppointments = sortedAppointments.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (field: keyof IAppointment) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const openConfirmationModal = (action: "Completed" | "Reschedule", id: string) => {
    const patientName = appointments.find(a => a._id === id)?.patient || "this patient";
    
    const modalDetails = {
      appointmentId: id,
      actionType: action,
      title: action === "Completed" ? "Complete Appointment" : "Reschedule Appointment",
      message: action === "Completed" 
        ? `Are you sure you want to mark ${patientName}'s appointment as completed? This action cannot be undone.` 
        : `Are you sure you want to reschedule ${patientName}'s appointment? This will require setting a new date.`
    };
    
    setModalData(modalDetails);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (newStatus: string, id: string) => {
    if (newStatus === "Completed" || newStatus === "Reschedule") {
      openConfirmationModal(newStatus as "Completed" | "Reschedule", id);
    } else {
      // For non-critical status changes, update directly
      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [id]: newStatus,
      }));
    }
  };

  const handleConfirmAction = async () => {
    const { appointmentId, actionType } = modalData;
    
    setStatuses((prevStatuses) => ({
      ...prevStatuses,
      [appointmentId]: actionType,
    }));

    try {
      const formData = { appointmentId };
      if (actionType === "Completed") {
        await completedAppointment(formData);
        toast.success("Appointment marked as Completed!");
        loadDoc().then((data)=>{
          dispatch(loaddoctorinfo(data))
        })
      } else if (actionType === "Reschedule") {
        await rescheduleAppointment(formData);
        toast.success("Appointment Rescheduled!");
        loadDoc().then((data)=>{
          dispatch(loaddoctorinfo(data))
        })
      }
    } catch (error: any) {
      toast.error("Failed to update appointment.");
      // Revert the status change
      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [appointmentId]: "Pending",
      }));
    }
    
    setIsModalOpen(false);
  };

  const handleCancelAction = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Patient Appointments</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-500/80 text-white">
              <th className="px-4 py-2 border border-gray-300 cursor-pointer">
                Patient id
              </th>
              <th className="px-4 py-2 border border-gray-300 cursor-pointer" onClick={() => handleSort("patient")}>
                Patient Name {sortField === "patient" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-2 border border-gray-300 cursor-pointer" onClick={() => handleSort("date")}>
                Date {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-2 border border-gray-300 cursor-pointer" onClick={() => handleSort("time")}>
                Time {sortField === "time" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-2 border border-gray-300 cursor-pointer" onClick={() => handleSort("status")}>
                Status {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>

            </tr>
          </thead>
          <tbody>
            {paginatedAppointments.length > 0 ? (
              paginatedAppointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-100 transition">
                  <td className="px-4 py-2 border border-gray-300 flex items-center gap-2">
                    {appointment.patientId._id}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(appointment.patientId._id);
                        toast.success("Copied!");
                      }}
                      className="p-1 bg-gray-200 hover:bg-gray-300 rounded-md"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">{appointment.patient}</td>
                  <td className="px-4 py-2 border border-gray-300">{appointment.date.toLocaleString().split("T")[0]}</td>
                  <td className="px-4 py-2 border border-gray-300">{appointment.time}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <select
                      value={statuses[appointment._id]}
                      onChange={(e) => handleStatusUpdate(e.target.value, appointment._id)}
                      disabled={statuses[appointment._id] === "Completed"}
                      className={`px-3 py-1 rounded-lg ${statuses[appointment._id] === "Completed" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                        }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reschedule">Reschedule</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-600 py-4">
                  No appointments available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <p className="text-gray-700">
          Page {currentPage} of {totalPages || 1}
        </p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title={modalData.title}
        message={modalData.message}
        actionType={modalData.actionType as "Completed" | "Reschedule"}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
    </div>
  );
};

export default DoctorAppointmentsTable;