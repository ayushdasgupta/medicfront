import React, { useState } from "react";
import toast from "react-hot-toast";
import { createPharmacistAdmin } from "../../redux/Action/adminaction";

const PharmacistCreate: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(0);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<ArrayBuffer | undefined>();
  const [imagePreview,] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        if (reader.readyState === FileReader.DONE && reader.result) {
          setAvatar(reader.result as ArrayBuffer);
        }
      };

      reader.onerror = () => {
        console.error("Error reading file");
      };
    } else {
      console.warn("No file selected");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, phone, password });
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone.toString());
    formData.append("password", password);
    if (avatar) {
      const blob = new Blob([avatar], { type: "image/*" });
      formData.append("avatar", blob, "avatar.png");
    }
    try {
      setLoading(true)
      const data = await createPharmacistAdmin(formData)
      toast.success(data.message)
      setLoading(false)
    } catch (error: any) {
      toast.error(error.message)
      setLoading(false)
    }

    // Optional: Reset the form fields
    // setName("");
    // setEmail("");
    // setPhone(0);
    // setPassword("");
    // setAvatar(undefined);
    // setImagePreview(null);
  };
  return (

    <div className="bg-gradient-to-bl from-blue-100 via-white to-gray-100 p-4 rounded-lg shadow-lg w-full ">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-left">
        Create Pharmacists
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4"
        style={{ height: "100%" }}
      >
        {/* name */}
        <div>
          <label htmlFor="name" className="text-gray-700 text-sm">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-2 py-1 mt-1 border rounded focus:outline-none"
            required
          />
        </div>

        {/* email */}
        <div>
          <label htmlFor="email" className="text-gray-700 text-sm">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-2 py-1 mt-1 border rounded focus:outline-none"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="Phone" className="text-gray-700 text-sm">
            Phone
          </label>
          <input
            type="number"
            id="Phone"
            value={phone}
            onChange={(e) => setPhone(Number(e.target.value))}
            className="w-full px-2 py-1 mt-1 border rounded focus:outline-none"
            required
          />
        </div>

        {/* password */}
        <div>
          <label htmlFor="password" className="text-gray-700 text-sm">
            Password
          </label>
          <input
            type="text"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-2 py-1 mt-1 border rounded focus:outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="avatar" className="text-gray-700 text-sm">
            Pharmacist Image
          </label>
          <input
            type="file"
            id="avatar"
            onChange={handleImageChange}
            className="w-full px-2 py-1 mt-1 border rounded"
            accept="image/*"
          />
          {imagePreview && (
            <div className="mt-1">
              <img
                src={imagePreview}
                alt="Doctor Preview"
                className="w-10 h-10 object-cover rounded-full"
              />
            </div>
          )}
        </div>
        {/* Submit Button */}
        <div className="col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Create Pharamacist
          </button>
        </div>
      </form>
    </div>

  );
};

export default PharmacistCreate;
