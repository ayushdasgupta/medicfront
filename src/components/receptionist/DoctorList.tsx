import React, { useEffect, useState } from "react";
import { addDays } from "date-fns";
import { allDocReception, bookAppointmentByReception } from "../../redux/Action/receptionistaction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

// const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DoctorList: React.FC = () => {
    const [doctors, setDoctors] = useState<IDoctor[]>([]);
    const [docId, setDocId] = useState<string | null>("")
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableDates, setAvailableDates] = useState<Date[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [phone, setPhone] = useState(0);
    const [isBook, setIsBook] = useState(false);
    const [doctorAvailability, setDoctorAvailability] = useState<string[]>([]);

    const calculateAvailableDates = () => {
        const today = new Date();
        const availableDatesList: Date[] = [];

        for (let i = 0; i < 7; i++) {
            const day = addDays(today, i);
            const dayOfWeek = day.toLocaleString("en-US", { weekday: "long" });

            if (doctorAvailability?.includes(dayOfWeek)) {
                availableDatesList.push(day);
            }
        }

        setAvailableDates(availableDatesList);
    };
    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    const itemsPerPage = 10;

    useEffect(() => {
        allDocReception()
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

    const filteredDoctor = doctors.filter(
        (doctor) =>
            doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.phone.toString().includes(searchQuery)
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredDoctor.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDoctors = filteredDoctor.slice(startIndex, startIndex + itemsPerPage);


    const handleBook = async(e: React.FormEvent) => {
        e.preventDefault()
        console.log({docId,phone,selectedDate});
        if (selectedDate) {
            const date1 = new Date(selectedDate!).toString();
            const date=new Date(date1)
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); 
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            const formdata = {
                "date": formattedDate,
                "id": docId,
                "phone":phone
              }
              try {
                const data = await bookAppointmentByReception(formdata);
                toast.success(data.message);
                
              } catch (e:any) {
                toast.error(e.message);
              } 
        }
    }

    return (
        <div className="bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Doctor's List</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search doctors by name, email, or phone"
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
                            <th className="px-4 py-2 border border-gray-300">Time</th>
                            <th className="px-4 py-2 border border-gray-300">Fees</th>
                            <th className="px-4 py-2 border border-gray-300">Available</th>
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
                                    <td className="px-4 py-2 border border-gray-300 text-center">{doctor.name}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{doctor.email}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{doctor.phone}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">
                                        {doctor.specialization}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{doctor.availableHours.start}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">{doctor.fees}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">
                                        {doctor.availability.length > 0
                                            ? doctor.availability.join(", ")
                                            : "Not Available"}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-300 text-center">
                                        <button
                                            onClick={() => {
                                                setIsBook(true)
                                                setDocId(doctor._id)
                                                setDoctorAvailability(doctor.availability)
                                                calculateAvailableDates()
                                            }}
                                            className="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-800 transition"
                                        >
                                            Book
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
            {isBook && doctorAvailability.length>0 && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Create patient</h3>
                        <form onSubmit={handleBook} className="space-y-4">

                            <div>
                                <label className="block mb-1">Phone no</label>
                                <input
                                    type="number"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(Number(e.target.value))
                                    }
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div className="text-center">
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={handleDateChange}
                                    minDate={new Date()}
                                    filterDate={(date: Date) =>
                                        availableDates.some((availableDate) => {
                                            const normalizeDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
                                            return normalizeDate(date).getTime() === normalizeDate(availableDate).getTime();
                                        })
                                    }

                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Select a date"
                                    className="px-4 py-2 w-full max-w-xs border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsBook(false);
                                    }}
                                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Book
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


        </div>
    );
};

export default DoctorList;
