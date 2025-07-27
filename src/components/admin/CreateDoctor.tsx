import React, { useState } from "react";
import { createDoctor } from "../../redux/Action/adminaction";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { specializations } from "../../utils/constant";

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];



const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const CreateDoctor: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(0);
  const [fees, setFees] = useState(0);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [specialization, setSpecialization] = useState<string[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customSpec, setCustomSpec] = useState("");
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
          setImagePreview(reader.result as string);
        }
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password
    if (!passwordRegex.test(password)) {
      setPasswordError("Password must be at least 8 characters with uppercase, lowercase, number, and special character.");
      toast.error("Password does not meet the required conditions.");
      return;
    } else {
      setPasswordError("");
    }
    setLoading(true)
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone.toString());
    formData.append("fees", fees.toString());
    formData.append("password", password);
    specialization.forEach((spec) => {
      formData.append("specialization", spec);
    });
    formData.append("availableHoursStart", availableHours.start);
    formData.append("availableHoursEnd", availableHours.end);
    formData.append("maxAppointmentsPerDay", maxAppointmentsPerDay.toString());
    selectedDays.forEach((day) => formData.append("availability", day));

    if (avatar) {
      const blob = new Blob([avatar], { type: "image/*" });
      formData.append("avatar", blob, "avatar.png");
    }

    try {
      await createDoctor(formData);
      toast.success("Doctor created successfully!");
      // Reset form
      setName(""); setEmail(""); setPhone(0); setFees(0); setPassword("");
      setSpecialization([]); setAvailableHours({ start: "", end: "" });
      setMaxAppointmentsPerDay(20); setAvatar(undefined); setImagePreview(null);
      setSelectedDays([]); setPasswordError("");
      setLoading(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong.");
      setLoading(false)
    }
  };

  return (
    <div className="bg-gradient-to-bl from-blue-100 via-white to-gray-100 p-4 rounded-lg shadow-lg w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-left">
        Create Doctor
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="text-gray-700 text-sm">Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-2 py-1 mt-1 border rounded" required />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="text-gray-700 text-sm">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-2 py-1 mt-1 border rounded" required />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="text-gray-700 text-sm">Phone</label>
          <input type="number" id="phone" value={phone} onChange={(e) => setPhone(Number(e.target.value))} className="w-full px-2 py-1 mt-1 border rounded" required />
        </div>

        {/* Fees */}
        <div>
          <label htmlFor="fees" className="text-gray-700 text-sm">Fees</label>
          <input type="number" id="fees" value={fees} onChange={(e) => setFees(Number(e.target.value))} className="w-full px-2 py-1 mt-1 border rounded" required />
        </div>

        {/* Password */}
        <div className="relative">
          <label htmlFor="password" className="text-gray-700 text-sm">Password</label>
          <div className="flex items-center relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-2 py-1 mt-1 border rounded pr-10"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 cursor-pointer text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {passwordError && (
            <p className="text-red-500 text-xs mt-1">{passwordError}</p>
          )}
        </div>

        {/* Specialization */}
        <div>
          <label htmlFor="specialization" className="text-gray-700 text-sm block mb-1">Specializations</label>

          {/* Dropdown selection */}
          <div className="flex gap-2 mb-2">
            <select
              id="specialization-select"
              className="border rounded px-2 py-1 w-full"
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") return;

                if (value === "Other") {
                  setShowCustomInput(true);
                } else if (!specialization.includes(value)) {
                  setSpecialization((prev) => [...prev, value]);
                }

                // Reset dropdown
                e.target.value = "";
              }}
            >
              <option value="">Select specialization</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Custom input for 'Other' */}
          {showCustomInput && (
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Enter custom specialization"
                className="border rounded px-2 py-1 w-full"
                value={customSpec}
                onChange={(e) => setCustomSpec(e.target.value)}
              />
              <button
                type="button"
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => {
                  const trimmed = customSpec.trim();
                  if (trimmed && !specialization.includes(trimmed)) {
                    setSpecialization((prev) => [...prev, trimmed]);
                  }
                  setCustomSpec("");
                  setShowCustomInput(false);
                }}
              >
                Add
              </button>
            </div>
          )}

          {/* Display selected specializations */}
          <div className="flex flex-wrap gap-2 mt-2">
            {specialization.map((spec) => (
              <span
                key={spec}
                className="bg-gray-200 text-sm px-2 py-1 rounded-full flex items-center gap-1"
              >
                {spec}
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 text-xs"
                  onClick={() =>
                    setSpecialization((prev) => prev.filter((s) => s !== spec))
                  }
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>


        {/* Avatar */}
        <div>
          <label htmlFor="avatar" className="text-gray-700 text-sm">Doctor Image</label>
          <input type="file" id="avatar" onChange={handleImageChange} accept="image/*" className="w-full px-2 py-1 mt-1 border rounded" />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="w-10 h-10 object-cover rounded-full mt-2" />
          )}
        </div>

        {/* Start Time */}
        <div>
          <label htmlFor="start" className="text-gray-700 text-sm">Start Time</label>
          <input type="time" id="start" value={availableHours.start} onChange={(e) => setAvailableHours((prev) => ({ ...prev, start: e.target.value }))} className="w-full px-2 py-1 mt-1 border rounded" required />
        </div>

        {/* End Time */}
        <div>
          <label htmlFor="end" className="text-gray-700 text-sm">End Time</label>
          <input type="time" id="end" value={availableHours.end} onChange={(e) => setAvailableHours((prev) => ({ ...prev, end: e.target.value }))} className="w-full px-2 py-1 mt-1 border rounded" required />
        </div>

        {/* Max Appointments */}
        <div>
          <label htmlFor="maxAppointmentsPerDay" className="text-gray-700 text-sm">Max Appointments</label>
          <input type="number" id="maxAppointmentsPerDay" value={maxAppointmentsPerDay} onChange={(e) => setMaxAppointmentsPerDay(Number(e.target.value))} className="w-full px-2 py-1 mt-1 border rounded" required />
        </div>

        {/* Days */}
        <div className="col-span-2">
          <label className="text-gray-700 text-sm block mb-1">Available Days</label>
          <div className="flex flex-wrap gap-4">
            {daysOfWeek.map((day) => (
              <label key={day} className="flex items-center space-x-2">
                <input type="checkbox" checked={selectedDays.includes(day)} onChange={() => handleDayChange(day)} />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-lg transition 
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"}`}
          >
            {loading ? "Creating..." : "Create Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDoctor;
