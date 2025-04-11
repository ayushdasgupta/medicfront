import React from "react";

interface NavbarProps {
  websiteName: string;
  patientName: string | undefined;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ websiteName, patientName, onLogout }) => {
  return (
    <div className="flex justify-between items-center bg-white/30 backdrop-blur-md border-b border-white/40 px-8 py-4 shadow-lg">
      {/* Website Name */}
      <h1 className=" text-primary text-2xl font-extrabold">{websiteName}</h1>

      {/* Patient Name and Logout */}
      <div className="hidden md:flex items-center gap-4">
        <span className="text-lg font-medium text-gray-700">{patientName}</span>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white font-semibold rounded-lg shadow-md transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
