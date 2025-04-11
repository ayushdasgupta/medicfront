import React, { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

interface UpdatePasswordProps {
  role: "doctor" | "patient" | "receptionist" | "pharmacist" | "laboratorian";
  updatePasswordAction: (data: { oldpassword: string; newpassword: string }) => Promise<{ message: string }>;
}

const UpdatePassword: React.FC<UpdatePasswordProps> = ({ role, updatePasswordAction }) => {
  const [oldpassword, setOldpassword] = useState<string>("");
  const [newpassword, setNewpassword] = useState<string>("");
  const [checkpassword, setCheckpassword] = useState<string>("");
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newpassword === checkpassword) {
      updatePasswordAction({ oldpassword, newpassword })
        .then((data) => {
          toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)}: ${data.message}`);
        })
        .catch((e) => toast.error(e.message));
    } else {
      toast.error("New password and confirm new password should be the same", {
        duration: 5000,
      });
    }
  };

  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-md w-full max-w-xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        {role.charAt(0).toUpperCase() + role.slice(1)} - Update Password
      </h2>
      <form onSubmit={handlePasswordUpdate} className="space-y-6">
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-gray-700 font-medium mb-2"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              placeholder="Enter current password"
              value={oldpassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOldpassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>
        <div>
          <label
            htmlFor="newPassword"
            className="block text-gray-700 font-medium mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              placeholder="Enter new password"
              value={newpassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewpassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>
        <div>
          <label
            htmlFor="confirmNewPassword"
            className="block text-gray-700 font-medium mb-2"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmNewPassword"
              name="confirmNewPassword"
              placeholder="Confirm new password"
              value={checkpassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckpassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;