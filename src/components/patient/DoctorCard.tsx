import React from "react";


const DoctorCard: React.FC<DoctorCardProps> = ({ name, specialization, image, onViewMore }) => {
  return (
    <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg p-6  hover:shadow-xl transition-shadow">
      {/* Doctor Image */}
      <div className="w-full flex items-center justify-center h-48 rounded-t-lg overflow-hidden">
        <img
          src={image}
          alt={image}
          className="w-1/2 object-cover"
        />
      </div>

      {/* Doctor Info */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        <p className="text-gray-800 mt-2">
          <span className="font-bold">Specialization:</span> {specialization.join(', ')}
        </p>
      </div>

      {/* View More Button */}
      <div className="mt-6 text-center">
        <button
          onClick={onViewMore}
          className="px-6 py-2 bg-blue-500/80 text-white rounded-lg shadow-md hover:bg-blue-500 transition"
        >
          View More
        </button>
      </div>
    </div>

  );
};

export default DoctorCard;
