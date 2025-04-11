import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const PatientHistory: React.FC = () => {
  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState<IPatient | null>(null);
  const [loading, setLoading] = useState(false);


  const handleSearch = async () => {
    if (!patientId.trim()) {
      toast.error("Please enter a valid Patient ID");
      return;
    }
    
    setLoading(true);
    try {
      const {data} = await axios.get(`/api/v1/patient/info/${patientId}`,{
        headers:{
          "Content-Type":"application/json"
        }
      });
      setPatient(data.patient);
      toast.success("Patient details fetched successfully!");
    } catch (error) {
      toast.error("Patient not found!");
      setPatient(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur-md shadow-lg rounded-lg p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Patient History</h2>

      {/* Search Input & Button */}
      <div className="flex gap-2">
        <input
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Enter Patient ID"
          className="px-4 py-2 border border-gray-300 rounded-lg flex-1"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Display Patient Details */}
      {patient && (
        <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800">{patient.name}</h3>
          <p className="text-gray-600">Age: {patient.age}</p>
          <p className="text-gray-600">Gender: {patient.gender}</p>
          <p className="text-gray-600">Blood Group: {patient.bloodgroup}</p>
          <h4 className="text-lg font-medium mt-3">Allergies:</h4>
          <ul className="list-disc list-inside text-gray-700">
          {patient.allergies.length > 0 ? (
            patient.allergies.map((item, index) => <li key={index}>`${item.name}:${item.causes}`</li>)
          ) : (
            <p className="text-gray-500">No allergies history available.</p>
          )}
          </ul>
          <h4 className="text-lg font-medium mt-3">Medical Records:</h4>
          <ul className="list-disc list-inside text-gray-700">
          {patient.medicalRecord.length > 0 ? (
              patient.medicalRecord.map((item, index) => <li key={index}>{item.record}</li>)
            ) : (
              <p className="text-gray-500">No medical history available.</p>
            )}
          </ul>
          <h4 className="text-lg font-medium mt-4">Previous Appointments:</h4>
          {/* <ul className="list-disc list-inside text-gray-700">
            {patient.appointment.length > 0 ? (
              patient.appointment
                .filter((appt) => new Date(appt.date) < new Date()) // Only past appointments
                .filter((appt) => appt.doctor === doctorName) // Match doctor name
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by latest first
                .map((appt, index) => (
                  <li key={index} className="py-2">
                    <span className="font-medium">{new Date(appt.date).toLocaleDateString()}</span> - {appt.status}
                  </li>
                ))
            ) : (
              <p className="text-gray-500">No previous appointments.</p>
            )}
          </ul> */}
          
        </div>
      )}
    </div>
  );
};

export default PatientHistory;
