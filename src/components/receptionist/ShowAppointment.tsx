import React, { useEffect, useState } from "react";
import { allAppointmentToday } from "../../redux/Action/receptionistaction";

const ShowAppointment: React.FC = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [groupedAppointments, setGroupedAppointments] = useState<Record<string, IAppointment[]>>({});

  useEffect(() => {
    allAppointmentToday()
      .then((data) => {
        const sortedAppointments = (data?.appointments || []).sort(
          (a: IAppointment, b: IAppointment) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        console.log("all appointment "+sortedAppointments);
        
        setAppointments(sortedAppointments);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
      });
  }, []);

  useEffect(() => {
    if (appointments.length > 0) {
      const grouped = appointments.reduce((acc: Record<string, IAppointment[]>, appointment, index) => {
        const doctorName = appointment.doctor;
        const appointmentWithToken = { ...appointment, token: index + 1 };

        if (!acc[doctorName]) {
          acc[doctorName] = [];
        }

        acc[doctorName].push(appointmentWithToken);
        return acc;
      }, {});

      setGroupedAppointments(grouped);
      
    }
    // console.log(groupedAppointments);
  }, [appointments]);

  const removeAppointment = (doctorName: string, appointmentId: string) => {
    setGroupedAppointments((prevGrouped) => {
      const updatedAppointments = prevGrouped[doctorName].filter((app) => app._id !== appointmentId);

      return { ...prevGrouped, [doctorName]: updatedAppointments };
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Today's Appointments</h2>
      {Object.keys(groupedAppointments).length === 0 ? (
        <p className="text-gray-600">No appointments today.</p>
      ) : (
        Object.entries(groupedAppointments).map(([doctorName, doctorAppointments]) => (
          <div key={doctorName} className="mb-6">
            <h3 className="text-lg font-bold text-blue-600">{doctorName}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="py-2 px-4 text-left">Token No</th>
                    <th className="py-2 px-4 text-left">Patient</th>
                    <th className="py-2 px-4 text-left">Time</th>
                    <th className="py-2 px-4 text-left">Fees</th>
                    <th className="py-2 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorAppointments.slice(0, 2).map((appointment) => (
                    <tr key={appointment._id} className="border-b">
                      <td className="py-2 px-4">{appointment.token}</td>
                      <td className="py-2 px-4">{appointment.patient}</td>
                      <td className="py-2 px-4">{appointment.time}</td>
                      <td className="py-2 px-4">{appointment.fees.toFixed(2)}</td>
                      <td className="py-2 px-4 text-center">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-green-600"
                          onClick={() => alert(`Generating bill for ${appointment.patient}`)}
                        >
                          Generate Bill
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                          onClick={() => removeAppointment(doctorName, appointment._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {doctorAppointments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-3 text-center text-gray-500">
                        No appointments available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ShowAppointment;
