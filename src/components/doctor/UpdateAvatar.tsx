import React, { useEffect, useState } from "react";
import { doctorupdateAvatar, loadDoc } from "../../redux/Action/doctoraction";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/custom";
import { loaddoctorinfo } from "../../redux/slice/doctorSlice";

const UpdateAvatar: React.FC = () => {
  const { doctor } = useAppSelector((state) => state.doctor);
  const dispatch = useAppDispatch();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate file type and size (e.g., max size 2MB)
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size exceeds 2MB. Please select a smaller file.");
        return;
      }

      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      console.warn("No file selected");
    }
  };
  useEffect(() => {
    if (doctor) {
      setPreviewImage(doctor.avatar.url)
    }
    // loadDoc()
    //   .then((data) => {
    //     dispatch(loaddoctorinfo(data));
    //     setPreviewImage(data.doctor.avatar.url)
    //     setLoading(false);
    //   })
    //   .catch((e) => {
    //     toast.error(e.message);
    //   });
  }, [doctor])
  const handleAvatarUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedImage) {
      toast.error("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedImage);

    setLoading(true);

    try {
      await doctorupdateAvatar(formData);
      toast.success("Avatar updated successfully!");
      setPreviewImage(null); // Reset preview
      setSelectedImage(null); // Reset selected image
      const data = await loadDoc()
      dispatch(loaddoctorinfo(data));
    } catch (error: any) {
      toast.error(error.message || "Failed to update avatar. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-md w-full max-w-xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Update Avatar
      </h2>
      <form onSubmit={handleAvatarUpdate} className="space-y-6 text-center">
        <div className="flex flex-col items-center">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-indigo-500"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mb-4">
              No Image
            </div>
          )}
          <label
            htmlFor="avatar"
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-indigo-700"
          >
            {selectedImage ? "Change Avatar" : "Choose Avatar"}
          </label>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <button
          type="submit"
          className={`w-full py-3 text-white bg-indigo-600 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
            }`}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Avatar"}
        </button>
      </form>
    </div>
  );
};

export default UpdateAvatar;
