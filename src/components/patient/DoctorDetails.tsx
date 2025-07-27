import { addDays } from "date-fns";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { bookAppointment, cancelAppointment } from "../../redux/Action/appointmentaction";
import { findDocID } from "../../redux/Action/doctoraction";
import Loader from "../Loader";
import { loadpatient } from "../../redux/Action/patientaction";
import { useAppDispatch } from "../../redux/hooks/custom";
import { loadpatientinfo } from "../../redux/slice/patientSlice";

const DoctorDetails: React.FC<{ id: string }> = ({ id }) => {
  // const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<IDoctor | null>(null);
  const dispatch=useAppDispatch()
  const [isBooked, setIsBooked] = useState(false);
  const [appointmentid, setAppointmentid] = useState("");
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [doctorAvailability, setDoctorAvailability] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Memoize available dates calculation to avoid recomputing on every render
  const availableDates = useMemo(() => {
    if (!doctorAvailability || doctorAvailability.length === 0) return [];
    
    const today = new Date();
    const availableDatesList: Date[] = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(today, i);
      const dayOfWeek = day.toLocaleString("en-US", { weekday: "long" });

      if (doctorAvailability.includes(dayOfWeek)) {
        availableDatesList.push(day);
      }
    }

    return availableDatesList;
  }, [doctorAvailability]);

  // Create a lookup map for date filtering to optimize the DatePicker
  const availableDateMap = useMemo(() => {
    const map = new Map();
    availableDates.forEach(date => {
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      map.set(key, true);
    });
    return map;
  }, [availableDates]);

  // Memoize the filter function to avoid recreation on every render
  const isDateAvailable = useCallback((date: Date) => {
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return availableDateMap.has(key);
  }, [availableDateMap]);

  const handleDateChange = useCallback((date: Date | null) => {
    setSelectedDate(date);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const fetchDoctorData = async () => {
      try {
        const data = await findDocID(id!);
        if (isMounted) {
          setDoctor(data.doctor);
          setDoctorAvailability(data.doctor.availability);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          navigate("/");
          toast.error("Doctor not found.");
        }
      }
    };

    fetchDoctorData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const handleBookAppointment = useCallback(async () => {
    if (!selectedDate || !doctor) return;

    const doctorId = id;
    const formdata = {
      "date": selectedDate,
      "doctorId": doctorId,
      "time": doctor.availableHours?.start!,
      "specialization": doctor.specialization!
    };
    console.log(formdata);
    
    try {
      let data = await bookAppointment(formdata);
      toast.success("Appointment booked successfully!");
      setIsBooked(true);
      setAppointmentid(data.appointment._id);
      data=await loadpatient()
      dispatch(loadpatientinfo(data))
    } catch (e: any) {
      console.error("Error booking appointment:", e);
      toast.error(e.message);
    }
  }, [selectedDate, doctor, id]);

  const handleCancelAppointment = useCallback(async () => {
    if (!appointmentid) return;
    
    try {
      const formdata = {
        "appointmentId": appointmentid
      };
      await cancelAppointment(formdata);
      setIsBooked(false);
      const data=await loadpatient()
      dispatch(loadpatientinfo(data))
      toast.success("Appointment cancelled successfully!");
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error("Failed to cancel appointment.");
    }
  }, [appointmentid]);

  if (loading) return <Loader />;

  return (
    <div className="w-full max-w-4xl p-8 bg-white/30 backdrop-blur-lg rounded-xl shadow-2xl">
      {/* Doctor Info */}
      <div className="flex flex-col md:flex-row items-center mb-8">
        <img
          src={doctor?.avatar.url}
          alt={doctor?.name}
          className="w-36 h-36 rounded-full object-cover shadow-md border-4 border-blue-300"
        />
        <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-gray-800">
            {doctor?.name}
          </h2>
          <p className="text-lg text-blue-600 font-medium">
            {doctor?.specialization.join(", ")}
          </p>
          <p className="text-gray-600 mt-2">
            <span className="font-semibold">Email:</span> {doctor?.email}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Phone:</span> {doctor?.phone}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Fees:</span> {doctor?.fees}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Available Hours:</span>{" "}
            {doctor?.availableHours.start} - {doctor?.availableHours.end}
          </p>
          <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
            {doctor?.availability.map((day, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-600 font-medium rounded-full shadow"
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Date Picker */}
      <div className="text-center">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          minDate={new Date()}
          filterDate={isDateAvailable}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          className="px-4 py-2 w-full max-w-xs border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Actions */}
      <div className="mt-8 text-center">
        {isBooked ? (
          <button
            onClick={handleCancelAppointment}
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Cancel Appointment
          </button>
        ) : (
          <button
            onClick={handleBookAppointment}
            disabled={!selectedDate}
            className={`px-6 py-2 ${!selectedDate ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white font-semibold rounded-lg shadow-md transition`}
          >
            Book Appointment
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorDetails;