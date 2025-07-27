import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { cancelAppointment } from "../../redux/Action/appointmentaction";
import { loadpatient } from "../../redux/Action/patientaction";
import { loadpatientinfo } from "../../redux/slice/patientSlice";
import { createOrder, verifyOrder } from "../../redux/Action/razorpayaction";
import ConfirmationModal from "../ConfirmModal";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/custom";
import { APPNAME, dateFormater } from "../../utils/constant";


const AppointmentsTable: React.FC = () => {
  const { patient } = useAppSelector((state) => state.patient);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof IAppointment | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    appointmentId: "",
    actionType: "Canceled",
    title: "",
    message: ""
  });
  const dispatch = useAppDispatch()
  const itemsPerPage = 5;

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = src;
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const onPayment = async (appointmentId: string) => {
    try {
      const data = await createOrder({ appointmentId })
      console.log(data);

      const paymentObject = new (window as any).Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: APPNAME,
        description: "Appointment Payment",
        order_id: data.order.id,
        
        handler: function (response: any) {
          console.log(response);
          const options = {
            appointmentId,
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature
          }
          verifyOrder(options).then((data) => {
            if (data.success) {
              toast.success(data.message)
              // Update local state to reflect paid status
              setAppointments(prevAppointments => prevAppointments.map(app =>
                app._id === appointmentId ? { ...app, ispaid: true } : app
              ));
              loadpatient().then((data) => {
                setAppointments(data?.patient?.appointment || []);
                dispatch(loadpatientinfo(data));
              }).catch(e => toast.error(e.message))
            }
            else {
              toast.error("Payment Failed")
            }
          })
        },

      })
      paymentObject.open()
    } catch (error) {
      console.log(error);
      toast.error("Failed to process payment");
    }
  }

  useEffect(() => {
    if (patient && patient.appointment) {
      setAppointments(patient.appointment)
      const initialStatuses: Record<string, string> = {};
      patient.appointment.forEach((appointment: IAppointment) => {
        initialStatuses[appointment._id] = appointment.status;
      });
      setStatuses(initialStatuses);
    }
    loadScript('https://checkout.razorpay.com/v1/checkout.js')
  }, [patient]);

  // Sorting logic
  const sortedAppointments = [...appointments].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue! < bValue!) return sortDirection === "asc" ? -1 : 1;
    if (aValue! > bValue!) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAppointments = sortedAppointments.slice(startIndex, startIndex + itemsPerPage);

  // Change Page
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const openConfirmationModal = (action: "Canceled", id: string) => {
    const appointment = appointments.find(a => a._id === id);
    const doctorName = appointment?.doctor || "the doctor";

    let title = "";
    let message = "";

    if (action === "Canceled") {
      title = "Cancel Appointment";
      message = `Are you sure you want to cancel appointment with ${doctorName}? This action cannot be undone.`;
    }

    const modalDetails = {
      appointmentId: id,
      actionType: action,
      title: title,
      message: message
    };

    setModalData(modalDetails);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    const { appointmentId, actionType } = modalData;

    try {
      if (actionType === "Canceled") {
        await cancelAppointment({ appointmentId });
        toast.success("Appointment cancelled successfully!");
        loadpatient().then((data) => {
          loadpatientinfo(data)
        })

        // Update local state
        setStatuses(prev => ({
          ...prev,
          [appointmentId]: "Cancel"
        }));

        setAppointments(prevAppointments =>
          prevAppointments.map(app =>
            app._id === appointmentId ? { ...app, status: "Cancel" } : app
          )
        );
      }
    } catch (error) {
      toast.error(`Failed to ${actionType.toLowerCase()} appointment.`);
    } finally {
      // Close the modal
      setIsModalOpen(false);
    }
  };

  const handleCancelAction = () => {
    // Just close the modal without taking action
    setIsModalOpen(false);

    // If we updated the UI before confirmation, revert those changes
    const { appointmentId } = modalData;
    const originalStatus = appointments.find(a => a._id === appointmentId)?.status || "Pending";

    setStatuses(prev => ({
      ...prev,
      [appointmentId]: originalStatus
    }));
  };

  // Change Sorting
  const handleSort = (field: keyof IAppointment) => {
    setSortField(field);
    setSortDirection(sortField === field ? (sortDirection === "asc" ? "desc" : "asc") : "asc");
  };

  // Handle Status Change
  const handleStatusChange = async (id: string, newStatus: string) => {
    if (newStatus === "Cancel") {
      openConfirmationModal("Canceled", id);
    } else {
      // For other status changes that don't need confirmation
      setStatuses((prev) => ({
        ...prev,
        [id]: newStatus,
      }));

      // Here you would normally make an API call to update the status
      // But since we're only handling Cancel with confirmation, we can skip that for now
    }
  };

  // Function to render appointment cards for mobile view
  const renderAppointmentCard = (appointment: IAppointment) => {
    return (
      <div key={appointment._id} className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p className="text-gray-500 text-sm">Date</p>
            <p className="font-semibold">{dateFormater(appointment.date)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Time</p>
            <p className="font-semibold">{appointment.time}</p>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-gray-500 text-sm">Doctor</p>
          <p className="font-semibold">{appointment.doctor}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p className="text-gray-500 text-sm">Fees</p>
            <p className="font-semibold">{appointment.fees}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Specialization</p>
            <p className="font-semibold">{appointment.specialization?.join(", ")}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-gray-500 text-sm mb-1">Status</p>
            {appointment.status === "Completed" ? (
              <span className="text-green-600 font-semibold">Completed</span>
            ) : (
              <select
                value={statuses[appointment._id] || "Pending"}
                onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                disabled={statuses[appointment._id] === "Cancel"}
                className={`px-3 py-1 rounded-lg ${statuses[appointment._id] === "Cancel"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
                  }`}
              >
                <option value="Pending">Pending</option>
                <option value="Cancel">Cancel</option>
              </select>
            )}
          </div>

          <div>
            <p className="text-gray-500 text-sm mb-1">Payment</p>
            {appointment.ispaid ? (
              <span className="text-green-500 font-bold">Paid</span>
            ) : (
              <button onClick={() => onPayment(appointment._id)} className="bg-red-500 text-white px-3 py-1 rounded">Pay</button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/30 backdrop-blur-md p-3 md:p-6 rounded-lg shadow-lg max-w-full md:max-w-5xl mx-auto">
      <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mb-3 md:mb-6">Your Appointments</h2>

      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table-auto w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-500/80 text-white">
              {["Date", "Time", "Doctor", "Fees", "Specialization", "Status", "Action"].map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-2 border border-gray-300 cursor-pointer"
                  onClick={() => handleSort(header.toLowerCase() as keyof IAppointment)}
                >
                  {header} {sortField === header.toLowerCase() && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentAppointments.length > 0 ? (
              currentAppointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-100 transition">
                  <td className="px-4 py-2 border border-gray-300">{dateFormater(appointment.date)}</td>
                  <td className="px-4 py-2 border border-gray-300">{appointment.time}</td>
                  <td className="px-4 py-2 border border-gray-300">{appointment.doctor}</td>
                  <td className="px-4 py-2 border border-gray-300">{appointment.fees}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    {appointment.specialization?.join(", ")}
                  </td>

                  <td className="px-4 py-2 border border-gray-300">
                    {appointment.status === "Completed" ? (
                      <span className="text-green-600 font-semibold">Completed</span>
                    ) : (
                      <select
                        value={statuses[appointment._id] || "Pending"}
                        onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                        disabled={statuses[appointment._id] === "Cancel"}
                        className={`px-3 py-1 rounded-lg ${statuses[appointment._id] === "Cancel"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                          }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Cancel">Cancel</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {appointment.ispaid ? (
                      <span className="text-green-500 font-bold">Paid</span>
                    ) : (
                      <button onClick={() => onPayment(appointment._id)} className="bg-red-500 text-white px-2 py-1 rounded">Pay</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center text-gray-600 py-4">No appointments available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View - Shown only on mobile */}
      <div className="md:hidden">
        {currentAppointments.length > 0 ? (
          currentAppointments.map(appointment => renderAppointmentCard(appointment))
        ) : (
          <div className="text-center text-gray-600 py-4">No appointments available.</div>
        )}
      </div>

      {/* Pagination - Responsive */}
      <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 md:px-4 md:py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Previous
        </button>
        <p className="text-sm md:text-base text-gray-700">Page {currentPage} of {totalPages || 1}</p>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-3 py-1 md:px-4 md:py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition ${(currentPage === totalPages || totalPages === 0) ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Next
        </button>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        title={modalData.title}
        message={modalData.message}
        actionType={modalData.actionType as "Completed" | "Reschedule" | "Canceled"}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
    </div>
  );
};

export default AppointmentsTable;