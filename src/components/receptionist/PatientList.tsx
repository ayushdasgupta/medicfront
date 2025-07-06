import React, { useEffect, useState } from "react";
import { allPatientReception, createPatientByReception } from "../../redux/Action/receptionistaction";
import toast from "react-hot-toast";
import { Copy } from "lucide-react";

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [isPatient, setIsPatient] = useState(false);
  const [phone, setPhone] = useState(0);
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [createdPatientId, setCreatedPatientId] = useState<string | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    allPatientReception().then((data) => {
      if (data?.patients) {
        setPatients(data.patients);
      } else {
        console.log("Unexpected data format:", data);
        setPatients([]);
      }
    }).catch((error) => {
      console.error("Error fetching patients:", error);
      setPatients([]);
    });
  }, []);

  const newPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone.toString());
    formData.append("bloodgroup", bloodGroup);

    createPatientByReception(formData)
      .then((res) => {
        toast.success("Patient created");
        const newId = res?.patient?._id || res?._id;
        if (newId) {
          setCreatedPatientId(newId);
        }
        return allPatientReception();
      })
      .then((data) => {
        if (data?.patients) setPatients(data.patients);
        setIsPatient(false);
        setName("");
        setPhone(0);
        setBloodGroup("");
      })
      .catch((e) => toast.error(e.message));
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient._id.toString().includes(searchQuery.toLowerCase()) ||
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.phone && patient.phone.toString().includes(searchQuery))
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg">
      <div className="flex justify-between mb-3">
        <h2 className="text-2xl font-semibold text-gray-800">Patient's List</h2>
        <button
          onClick={() => setIsPatient(true)}
          className="px-4 py-2 bg-green-500/80 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition"
        >
          Add Patient
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search patients by name, or phone"
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
              <th className="px-4 py-2 border border-gray-300">Patient ID</th>
              <th className="px-4 py-2 border border-gray-300">Name</th>
              <th className="px-4 py-2 border border-gray-300">Email</th>
              <th className="px-4 py-2 border border-gray-300">Phone</th>
              <th className="px-4 py-2 border border-gray-300">Age</th>
              <th className="px-4 py-2 border border-gray-300">Blood Group</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPatients.length > 0 ? (
              paginatedPatients.map((patient) => (
                <tr key={patient._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border border-gray-300 flex items-center gap-2">
                    {patient._id}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(patient._id);
                        toast.success("Copied!");
                      }}
                      className="p-1 bg-gray-200 hover:bg-gray-300 rounded-md"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">{patient.name}</td>
                  <td className="px-4 py-2 border border-gray-300">{patient.email || "None"}</td>
                  <td className="px-4 py-2 border border-gray-300">{patient.phone || "None"}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center">{patient.age || "None"}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center">{patient.bloodgroup || "None"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No patients found.
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

      {/* Modal to Create Patient */}
      {isPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Create patient</h3>
            <form onSubmit={newPatient} className="space-y-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1">Phone no</label>
                <input
                  type="number"
                  value={phone}
                  onChange={(e) => setPhone(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPatient(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal showing created patient ID */}
      {createdPatientId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Patient Created</h2>
            <p className="mb-2 text-gray-600">Patient ID:</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="bg-gray-100 px-3 py-1 rounded font-mono text-sm">{createdPatientId}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(createdPatientId);
                  toast.success("Patient ID copied!");
                }}
                className="bg-gray-200 hover:bg-gray-300 p-2 rounded"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setCreatedPatientId(null)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
