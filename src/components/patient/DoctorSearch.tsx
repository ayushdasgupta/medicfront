import { useEffect, useState, Suspense, lazy } from "react";
import { allDoctor } from "../../redux/Action/doctoraction";
import Loader from "../Loader";

// Lazy load components
const DoctorCard = lazy(() => import("../patient/DoctorCard"));
const DoctorDetails = lazy(() => import("../patient/DoctorDetails"));


const DoctorSearch: React.FC = () => {
  const [allDoctors, setAllDoctors] = useState<IDoctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<IDoctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  const handleViewMore = (doctorId: string) => {
    setSelectedDoctorId(doctorId); // Set the doctor ID to display details
  };

  const closeModal = () => {
    setSelectedDoctorId(null); // Close the modal
  };

  useEffect(() => {
    allDoctor().then((data) => {
      setAllDoctors(data.doctors);
      setFilteredDoctors(data.doctors); // Initially, show all doctors
    });
  }, []);

 const handleSearch = (query: string) => {
  setSearchQuery(query);
  const lowerQuery = query.toLowerCase();

  const filtered = allDoctors.filter((doc) =>
    doc.name.toLowerCase().includes(lowerQuery) ||
    doc.specialization.some((spec) =>
      spec.toLowerCase().includes(lowerQuery)
    )
  );

  setFilteredDoctors(filtered);
};


  return (
    <div className="bg-white/30 backdrop-blur-md shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Doctor Search</h2>
      <p className="text-gray-600 mb-4">Search and browse available doctors here.</p>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or specialization"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      {/* Doctor Grid */}
      <Suspense fallback={<Loader />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDoctors.map((doc) => (
            <DoctorCard
              key={doc._id}
              _id={doc._id}
              name={doc.name}
              image={doc.avatar.url}
              specialization={doc.specialization}
              onViewMore={() => handleViewMore(doc._id)}
            />
          ))}
        </div>
      </Suspense>

      {/* No Results Found */}
      {filteredDoctors.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No doctors found matching your search.</p>
      )}

      {selectedDoctorId && (
        <Suspense fallback={<Loader />}>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-3xl flex items-center justify-center z-50"
            onClick={closeModal} // Close modal on background click
          >
            <div
              className="relative w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside the modal
            >
              {/* Render DoctorDetails */}
              <DoctorDetails id={selectedDoctorId} />
            </div>
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default DoctorSearch;
