import React, { useEffect, useState, useRef } from "react";
import { allAppointmentToday } from "../../redux/Action/receptionistaction";

const TOKEN_MAP_KEY = "appointment_token_map";

const ShowAppointment: React.FC = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [groupedAppointments, setGroupedAppointments] = useState<Record<string, IAppointment[]>>({});
  const tokenMapRef = useRef<Record<string, number>>({});
  const pollerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load tokens from localStorage once
  useEffect(() => {
    const storedMap = localStorage.getItem(TOKEN_MAP_KEY);
    if (storedMap) {
      tokenMapRef.current = JSON.parse(storedMap);
    }
  }, []);

  const saveTokenMapToStorage = () => {
    localStorage.setItem(TOKEN_MAP_KEY, JSON.stringify(tokenMapRef.current));
  };

  const assignTokens = (fetched: IAppointment[]) => {
    const updatedMap = { ...tokenMapRef.current };
    let maxToken = Math.max(0, ...Object.values(updatedMap));

    const withTokens = fetched.map((appointment) => {
      if (!updatedMap[appointment._id]) {
        updatedMap[appointment._id] = ++maxToken;
      }
      return { ...appointment, token: updatedMap[appointment._id] };
    });

    tokenMapRef.current = updatedMap;
    saveTokenMapToStorage();
    return withTokens;
  };

  const fetchAppointments = async (isInitial = false) => {
    try {
      const data = await allAppointmentToday();
      const fetched = (data?.appointments || []).sort(
        (a: IAppointment, b: IAppointment) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      if (fetched.length === 0) {
        setAppointments([]);
        setGroupedAppointments({});
        console.log("No appointments. Stopping further polling.");
        localStorage.removeItem(TOKEN_MAP_KEY);
        // Stop polling forever
        if (pollerRef.current) clearInterval(pollerRef.current);
        pollerRef.current = null;
        return;
      }

      // If this was the initial fetch and data exists, start polling
      if (isInitial && !pollerRef.current) {
        pollerRef.current = setInterval(() => {
          fetchAppointments();
        }, 60000); // 1 min
      }

      const withTokens = assignTokens(fetched);
      setAppointments(withTokens);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    fetchAppointments(true); // Initial fetch

    return () => {
      if (pollerRef.current) clearInterval(pollerRef.current);
    };
  }, []);

  useEffect(() => {
    const grouped = appointments.reduce((acc: Record<string, IAppointment[]>, appointment) => {
      const doctor = appointment.doctor;
      if (!acc[doctor]) acc[doctor] = [];
      acc[doctor].push(appointment);
      return acc;
    }, {});
    setGroupedAppointments(grouped);
  }, [appointments]);

  const removeAppointment = (doctorName: string, appointmentId: string) => {
    setGroupedAppointments((prev) => {
      const updated = prev[doctorName].filter((a) => a._id !== appointmentId);
      return { ...prev, [doctorName]: updated };
    });

    setAppointments((prev) => prev.filter((a) => a._id !== appointmentId));
    // Token remains in tokenMapRef for consistency
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
