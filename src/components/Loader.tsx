
import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <div className="flex items-center space-x-2">
        <div className="w-5 h-5 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-5 h-5 bg-pink-500 rounded-full animate-bounce delay-150"></div>
        <div className="w-5 h-5 bg-green-500 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
};

export default Loader;
