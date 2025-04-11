import React, { useState } from "react";
import { createDoctor } from "../../redux/Action/adminaction";
import toast from "react-hot-toast";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const CreateDoctor: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(0);
  const [fees, setFees] = useState(0);
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [availableHours, setAvailableHours] = useState({ start: "", end: "" });
  const [maxAppointmentsPerDay, setMaxAppointmentsPerDay] = useState(20);
  const [avatar, setAvatar] = useState<ArrayBuffer | undefined>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);


  const handleDayChange = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

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
    formData.append("fees", fees.toString());
    formData.append("password", password);
    formData.append("specialization", specialization);
    formData.append("availableHoursStart", availableHours.start);
    formData.append("availableHoursEnd", availableHours.end);
    formData.append("maxAppointmentsPerDay", maxAppointmentsPerDay.toString());
    selectedDays.forEach((day) => formData.append("availability", day))

    console.log(formData);

    if (avatar) {
      const blob = new Blob([avatar], { type: "image/*" });
      formData.append("avatar", blob, "avatar.png");
    }
    createDoctor(formData).then(() => {

      toast.success("Doctor created Successfully !!! ")


    }).catch((e) => {
      console.log(e.message);

    })

    console.log("Form submitted with values:", {
      name,
      email,
      phone,
      password,
      specialization,
      availableHours,
      maxAppointmentsPerDay,
      avatar,
    });

    // Optional: Reset the form fields
    setName("");
    setEmail("");
    setPhone(0);
    setFees(0);
    setPassword("");
    setSpecialization("");
    setAvailableHours({ start: "", end: "" });
    setMaxAppointmentsPerDay(20);
    setAvatar(undefined);
    setImagePreview(null);
  };
  return (

    <div className="bg-gradient-to-bl from-blue-100 via-white to-gray-100 p-4 rounded-lg shadow-lg w-full ">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-left">
        Create Doctor
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

        {/*Fees*/}

        <div>
          <label htmlFor="Fees" className="text-gray-700 text-sm">
            Fees
          </label>
          <input
            type="number"
            id="phone"
            value={fees}
            onChange={(e) => setFees(Number(e.target.value))}
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

        {/* Specialization */}
        <div>
          <label htmlFor="specialization" className="text-gray-700 text-sm">
            Specialization
          </label>
          <input
            type="text"
            id="specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full px-2 py-1 mt-1 border rounded focus:outline-none"
            required
          />
        </div>

        {/* Avatar */}
        <div>
          <label htmlFor="avatar" className="text-gray-700 text-sm">
            Doctor Image
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

        {/* Available Hours */}
        <div>
          <label htmlFor="start" className="text-gray-700 text-sm">
            Start Time
          </label>
          <input
            type="time"
            id="start"
            value={availableHours.start}
            onChange={(e) =>
              setAvailableHours((prev) => ({ ...prev, start: e.target.value }))
            }
            className="w-full px-2 py-1 mt-1 border rounded focus:outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="end" className="text-gray-700 text-sm">
            End Time
          </label>
          <input
            type="time"
            id="end"
            value={availableHours.end}
            onChange={(e) =>
              setAvailableHours((prev) => ({ ...prev, end: e.target.value }))
            }
            className="w-full px-2 py-1 mt-1 border rounded focus:outline-none"
            required
          />
        </div>
        {/* Date picker */}
        <div className="flex flex-wrap gap-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value={day}
                  checked={selectedDays.includes(day)}
                  onChange={() => handleDayChange(day)}
                  className="mr-2"
                />
                {day}
              </label>
            </div>
          ))}
        </div>
        {/* Max Appointments */}
        <div>
          <label
            htmlFor="maxAppointmentsPerDay"
            className="text-gray-700 text-sm"
          >
            Max Appointments
          </label>
          <input
            type="number"
            id="maxAppointmentsPerDay"
            value={maxAppointmentsPerDay}
            onChange={(e) =>
              setMaxAppointmentsPerDay(Number(e.target.value))
            }
            className="w-full px-2 py-1 mt-1 border rounded focus:outline-none"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Create Doctor
          </button>
        </div>
      </form>
    </div>

  );
};

export default CreateDoctor;
