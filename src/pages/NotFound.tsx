
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <h1 className="text-6xl font-extrabold text-gray-800">404</h1>
      <p className="mt-4 text-lg text-gray-600">
        Oops! The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-6 py-2 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 transition-all"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
