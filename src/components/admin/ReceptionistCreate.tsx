import React, { useState } from "react";
import { createReceptionist } from "../../redux/Action/adminaction";
import toast from "react-hot-toast";

const ReceptionistCreate: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(0);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<ArrayBuffer | undefined>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);


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


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone.toString());
    formData.append("password", password);

    if (avatar) {
      const blob = new Blob([avatar], { type: "image/*" });
      formData.append("avatar", blob, "avatar.png");
    }
    createReceptionist(formData).then(() => {

      toast.success("Receptionist created Successfully !!! ")


    }).catch((e) => {
      console.log(e.message);

    })

    

    // Optional: Reset the form fields
    setName("");
    setEmail("");
    setPhone(0);
    setPassword("");
    setAvatar(undefined);
    setImagePreview(null);
  };
  return (

    <div className="bg-gradient-to-bl from-blue-100 via-white to-gray-100 p-4 rounded-lg shadow-lg w-full ">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-left">
        Create Receptionist
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4"
        style={{ height: "100%" }}
      >
        {/* Name */}
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

        {/* Email */}
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
          <label htmlFor="phone" className="text-gray-700 text-sm">
            Phone
          </label>
          <input
            type="number"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(Number(e.target.value))}
            className="w-full px-2 py-1 mt-1 border rounded focus:outline-none"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="text-gray-700 text-sm">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-2 py-1 mt-1 border rounded focus:outline-none"
            required
          />
        </div>

        {/* Avatar */}
        <div>
          <label htmlFor="avatar" className="text-gray-700 text-sm">
            Receptionist Image
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
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Create Receptionist
          </button>
        </div>
      </form>
    </div>

  );
};

export default ReceptionistCreate;
