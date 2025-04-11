import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { loadpatient, patientUpdate } from "../../redux/Action/patientaction";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/custom";
import { loadpatientinfo } from "../../redux/slice/patientSlice";



const UpdateInformation: React.FC = () => {
    const { patient } = useAppSelector((state) => state.patient);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IPatient>();
  // dispatch(loadpatientinfo(data));

  // Load patient data and set default form values
  useEffect(() => {
    if (patient) {
      reset(patient)
    }
  }, [patient]);

  // Submit function
  const onSubmit = async (formData: IPatient) => {
    try {
      await patientUpdate(
        formData
      );
    const data=await loadpatient()
      dispatch(loadpatientinfo(data));
      toast.success("Update successful!");
    } catch {
      toast.error("Update failed!");
    }
  };
//67a62ee298af9ae8fd0e3f01
  return (
    <div className="bg-white/30 backdrop-blur-md p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Update Information</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-medium">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full p-3 mt-2 bg-white/60 backdrop-blur-md rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full p-3 mt-2 bg-white/60 backdrop-blur-md rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 font-medium">Phone</label>
          <input
            type="number"
            {...register("phone", {
              required: "Phone is required",
              valueAsNumber: true,
            })}
            className="w-full p-3 mt-2 bg-white/60 backdrop-blur-md rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>

        {/* Age */}
        <div>
          <label className="block text-gray-700 font-medium">Age</label>
          <input
            type="number"
            {...register("age", {
              required: "Age is required",
              valueAsNumber: true,
            })}
            className="w-full p-3 mt-2 bg-white/60 backdrop-blur-md rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
          />
          {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-gray-700 font-medium">Gender</label>
          <select
            {...register("gender", { required: "Gender is required" })}
            className="w-full p-3 mt-2 bg-white/60 backdrop-blur-md rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {isSubmitting ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateInformation;
