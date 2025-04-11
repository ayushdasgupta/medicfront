import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { adminForgotpassword } from "../redux/Action/adminaction";
import toast from "react-hot-toast";

const GlassForm: React.FC<FormProps> = ({ title, fields, buttonText, onSubmit }) => {
  const [passwordVisibility, setPasswordVisibility] = useState<{ [key: string]: boolean }>({});

  const togglePasswordVisibility = (fieldName: string) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const handleadminForgot = () => {
    adminForgotpassword()
      .then((data) => {
        toast.success(data.message);
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="glass-card w-full max-w-md p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">{title}</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {fields.map((field, index) => (
            <div key={index} className="relative">
              <label htmlFor={field.name} className="block text-gray-700 font-semibold mb-1">
                {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
              </label>

              {field.type === "select" ? (
                <select
                  name={field.name}
                  id={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full p-3 bg-white/60 backdrop-blur-md border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  {field.options?.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="relative">
                  <input
                    type={field.type === "password" && passwordVisibility[field.name] ? "text" : field.type}
                    name={field.name}
                    id={field.name}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full p-3 bg-white/60 backdrop-blur-md border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                    required
                  />
                  {field.type === "password" && (
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
                      onClick={() => togglePasswordVisibility(field.name)}
                    >
                      {passwordVisibility[field.name] ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            {buttonText}
          </button>
        </form>

        {/* Additional links based on the title */}
        {title === "Patient Registration" && (
          <>
            <p className="mt-4 text-gray-700">
              Existing user?{" "}
              <Link to="/patient/login" className="text-primary font-semibold hover:underline">
                Login
              </Link>
            </p>
            <p className="mt-4 text-gray-700">
              Forgot Password?{" "}
              <Link to="/patient/forgotpassword" className="text-primary font-semibold hover:underline">
                Click here
              </Link>
            </p>
          </>
        )}
        {title === "Patient Login" && (
          <>
            <p className="mt-4 text-gray-700">
              First user?{" "}
              <Link to="/patient/register" className="text-primary font-semibold hover:underline">
                Register
              </Link>
            </p>
            <p className="mt-4 text-gray-700">
              Forgot Password?{" "}
              <Link to="/patient/forgotpassword" className="text-primary font-semibold hover:underline">
                Click here
              </Link>
            </p>
          </>
        )}
         {title === "Doctor Login" && (
          <>
            <p className="mt-4 text-gray-700">
              Want to become a Doctor ? Contact Admin
            </p>
           
          </>
        )}

        {title === "Admin Login" && (
          <>
            <p className="mt-4 text-gray-700">
              Want to become an admin?{" "}
              <Link to="/admin/register" className="text-primary font-semibold hover:underline">
                Register
              </Link>
            </p>
            <p className="mt-4 text-gray-700">
              Forgot Password?{" "}
              <button
                onClick={handleadminForgot}
                className="p-2 text-primary font-semibold rounded-lg transition duration-300"
              >
                Click Here
              </button>
            </p>
          </>
        )}
         {title === "Receptionist Login" && (
          <>
          <p className="mt-4 text-gray-700">
            Want to become a Recptionist ? Contact Admin
          </p>
         
        </>
        )}

        <Link to={"/"} className="text-primary font-semibold hover:underline">
          Go back
        </Link>
      </div>
    </div>
  );
};

export default GlassForm;
