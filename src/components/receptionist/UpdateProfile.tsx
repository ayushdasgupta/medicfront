import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { loadReceptionist, receptionistupdateInfo } from "../../redux/Action/receptionistaction";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/custom";
import { loadreceptionistinfo } from "../../redux/slice/receptionist";



const ReceptionistProfile: React.FC = () => {
    const { receptionist } = useAppSelector((state) => state.receptionist);
      const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<IReceptionist>();
  
  
  useEffect(() => {
    if(receptionist){
        reset(receptionist)
    }
  }, [receptionist]);

  const onSubmit = async (formData: IReceptionist) => {
    try {
      await receptionistupdateInfo(formData);
      const data=await loadReceptionist()
      dispatch(loadreceptionistinfo(data));
      toast.success("Update successful !!!");
    } catch (error) {
      toast.error("Update failed!");
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Update Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Phone</label>
          <input
            type="number"
            {...register("phone", {
              required: "Phone is required",
              valueAsNumber: true
            })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
        >
          {isSubmitting ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default ReceptionistProfile;