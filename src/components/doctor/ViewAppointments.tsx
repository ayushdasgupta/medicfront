import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { bulkCancelFutureAppointments, bulkRescheduleFutureAppointments, completedAppointment, getNextAvailableDayAndAppointmentCount, rescheduleAppointment } from "../../redux/Action/appointmentaction";
import { loadDoc } from "../../redux/Action/doctoraction";
import { loaddoctorinfo } from "../../redux/slice/doctorSlice";
import { Copy } from "lucide-react";
import ConfirmationModal from "../ConfirmModal";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/custom";
import { dateFormater, predefinedRemarks } from "../../utils/constant";


const DoctorAppointmentsTable: React.FC = () => {
  const { doctor } = useAppSelector((state) => state.doctor);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [sortField, setSortField] = useState<keyof IAppointment | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const dispatch = useAppDispatch()
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [futureAppointmentCount, setFutureAppointmentCount] = useState({
    nextAvailableDay: null,
    appointmentCount: 0,
    maxAppointmentsAllowed: 0
  })
  const [modalData, setModalData] = useState({
    appointmentId: "",
    actionType: "" as "Completed" | "Reschedule",
    title: "",
    message: ""
  });

  const [bulkAction, setBulkAction] = useState<"Cancel" | "Reschedule" | null>(null);
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [isFinalModalOpen, setIsFinalModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const [remark, setRemark] = useState("");
  const [previousStatus, setPreviousStatus] = useState<{ id: string; status: string } | null>(null);

  useEffect(() => {
    if (doctor && doctor.appointments) {
      setAppointments(doctor.appointments);

      // Initialize statuses
      const statusMap = appointments.reduce((acc, appointment: IAppointment) => {
        acc[appointment._id] = appointment.status;
        return acc;
      }, {} as Record<string, string>);
      setStatuses(statusMap);

    }
    const fetchFutureAppointmentData = async () => {
      try {
        const result = await getNextAvailableDayAndAppointmentCount(doctor?._id!);
        setFutureAppointmentCount(result);
        console.log(result);

      } catch (error) {
        console.error("Failed to fetch future appointment data", error);
      }
    };

    fetchFutureAppointmentData();
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
    if (newStatus === "Completed") {
      const currentStatus = "Pending"
      setPreviousStatus({ id, status: currentStatus });
      setSelectedAppointmentId(id);
      setIsRemarkModalOpen(true);
      return;
    } else if (newStatus === "Reschedule") {
      openConfirmationModal("Reschedule", id);
    } else {
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
      const formData = { appointmentId, remark };
      if (actionType === "Completed") {
        await completedAppointment(formData);
        toast.success("Appointment marked as Completed!");
        loadDoc().then((data) => {
          dispatch(loaddoctorinfo(data))
        })
      } else if (actionType === "Reschedule") {
        await rescheduleAppointment(formData);
        toast.success("Appointment Rescheduled!");
        loadDoc().then((data) => {
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
    if (previousStatus) {
      setStatuses((prev) => ({
        ...prev,
        [previousStatus.id]: previousStatus.status,
      }));
      setPreviousStatus(null);
    }
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
                  <td className="px-4 py-2 border border-gray-300">{dateFormater(appointment.date)}</td>
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
      {futureAppointmentCount.nextAvailableDay &&
        futureAppointmentCount.appointmentCount !== 0 &&
        futureAppointmentCount.maxAppointmentsAllowed !== 0 && (
          <div className="mt-6 p-4 bg-blue-100 border border-blue-300 rounded-md text-blue-800 shadow-md">
            <h3 className="text-lg font-semibold mb-2">Next Available Appointment Info</h3>
            <p><strong>Next Available Day:</strong> {futureAppointmentCount.nextAvailableDay}</p>
            <p><strong>Appointments Booked:</strong> {futureAppointmentCount.appointmentCount}</p>
            <p><strong>Max Appointments Allowed:</strong> {futureAppointmentCount.maxAppointmentsAllowed}</p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  setBulkAction("Cancel");
                  setIsFirstModalOpen(true);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Cancel All
              </button>
              <button
                onClick={() => {
                  setBulkAction("Reschedule");
                  setIsFirstModalOpen(true);
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Reschedule All
              </button>
            </div>
          </div>
        )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title={modalData.title}
        message={modalData.message}
        actionType={modalData.actionType as "Completed" | "Reschedule"}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
      {/* Step 1: First Confirmation Modal */}
      <ConfirmationModal
        isOpen={isFirstModalOpen}
        title={`Confirm Bulk ${bulkAction}`}
        message={`Are you sure you want to ${bulkAction?.toLowerCase()} all upcoming appointments?`}
        actionType={bulkAction === "Cancel" ? "Completed" : "Reschedule"}
        onConfirm={() => {
          setIsFirstModalOpen(false);
          setIsReasonModalOpen(true);
        }}
        onCancel={() => setIsFirstModalOpen(false)}
      />


      {isReasonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Reason for {bulkAction}</h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4 resize-none"
              rows={4}
              placeholder="Enter reason here..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsReasonModalOpen(false);
                  setBulkAction(null);
                  setReason("");
                }}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsReasonModalOpen(false);
                  setIsFinalModalOpen(true);
                }}
                disabled={!reason.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Final Confirmation + Loader */}
      <ConfirmationModal
        isOpen={isFinalModalOpen}
        title={`Final Confirmation`}
        message={`Are you sure you want to proceed with bulk ${bulkAction?.toLowerCase()}?`}
        actionType={bulkAction === "Cancel" ? "Completed" : "Reschedule"}
        onConfirm={async () => {
          setIsLoading(true);
          setIsFinalModalOpen(false);

          try {
            // Simulate async operation (replace with actual API call)
            await new Promise((res) => setTimeout(res, 2000));

            // TODO: Replace with real logic:
            // await bulkRescheduleOrCancelAppointments(doctor._id, bulkAction, reason);
            if (bulkAction === "Cancel") {
              const data = {
                doctorId: doctor?._id!,
                targetDay: futureAppointmentCount.nextAvailableDay,
                reason,
              }
              const { message } = await bulkCancelFutureAppointments(data)
              toast.success(message)
            }
            if (bulkAction === "Reschedule") {
              const data = {
                doctorId: doctor?._id!,
                targetDate: futureAppointmentCount.nextAvailableDay,
                reason
              }
              const { message } = await bulkRescheduleFutureAppointments(data);
              toast.success(message)
            }

            // toast.success(`All appointments ${bulkAction === "Cancel" ? "cancelled" : "rescheduled"} successfully!`);

            // Refresh doctor data
            const data = await loadDoc();
            dispatch(loaddoctorinfo(data));
          } catch (error) {
            toast.error(`Failed to ${bulkAction?.toLowerCase()} appointments${error}`);
            console.log(error);

          } finally {
            setIsLoading(false);
            setReason("");
            setBulkAction(null);
          }
        }}
        onCancel={() => {
          setIsFinalModalOpen(false);
          setReason("");
          setBulkAction(null);
        }}
      />

      {/* Optional: Global Button Loader Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-blue-600 font-semibold">Processing...</span>
          </div>
        </div>
      )}
      {isRemarkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30  flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w- shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Add Remark for Completion</h2>

            <div className="flex flex-wrap gap-2 mb-4">
              {predefinedRemarks.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setRemark(r)}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200"
                >
                  {r}
                </button>
              ))}
            </div>

            <textarea
              className="w-full p-2 border border-gray-300 rounded-md mb-4 resize-none"
              rows={1}
              placeholder="Enter custom remark here..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsRemarkModalOpen(false);
                  setRemark("");
                  setSelectedAppointmentId("");
                  if (previousStatus) {
                    setStatuses((prev) => ({
                      ...prev,
                      [previousStatus.id]: previousStatus.status,
                    }));
                    setPreviousStatus(null);
                  }
                }}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsRemarkModalOpen(false);
                  setModalData({
                    appointmentId: selectedAppointmentId,
                    actionType: "Completed",
                    title: "Confirm Completion",
                    message: `Are you sure you want to complete this appointment with the following remark?\n\n"${remark}"`,
                  });
                  setIsModalOpen(true);
                }}
                disabled={!remark.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointmentsTable;