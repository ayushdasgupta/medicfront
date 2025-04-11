import axios from "axios";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const UpdatePatient: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        control,
    } = useForm<IPatient>({
        defaultValues: {
            name: "",
            email: "",
            phone: 0,
            age: 0,
            gender: "",
            bloodgroup: "",
            allergies: [{ name: "", causes: "" }],
            medicalRecord: [],
            identification: { type: "", number: "" },
            insurance: {provider:"",number:""},
        },
    });

    const [patientId, setPatientId] = useState("");
    const [patient, setPatient] = useState<IPatient | null>(null);
    const [loading, setLoading] = useState(false);

    // UseFieldArray for handling dynamic fields
    const { fields: allergyFields, append: addAllergy, remove: removeAllergy } = useFieldArray({
        control,
        name: "allergies",
    });

    const { fields: medicalFields, append: addMedical, remove: removeMedical } =
        useFieldArray({ control, name: "medicalRecord" });


    const handleSearch = async () => {
        if (!patientId.trim()) {
            toast.error("Please enter a valid Patient ID");
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.get(`/api/v1/patient/info/${patientId}`, {
                headers: { "Content-Type": "application/json" },
            });

            setPatient(data.patient);
            toast.success("Patient details fetched successfully!");

            // Populate form fields with fetched data
            Object.entries(data.patient).forEach(([key, value]) => {
                setValue(key as any, value);
            });

        } catch (error) {
            toast.error("Patient not found!");
            setPatient(null);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (formData: IPatient) => {
        try {
            console.log(formData);

            // await patientUpdate(formData);
            toast.success("Update successful!");
        } catch {
            toast.error("Update failed!");
        }
    };

    return (
        <div className="bg-white/30 backdrop-blur-md shadow-lg rounded-lg p-8 max-w-full mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Update patient details</h2>

            {/* Search Input & Button */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="Enter Patient ID"
                    className="px-4 py-2 border border-gray-300 rounded-lg flex-1"
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {/* Display Patient Details with react-hook-form */}
            {patient && (
                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 p-4 bg-white shadow-md rounded-lg">
                    <div className="md:grid md:grid-cols-4 md:gap-x-4 max-w-full">
                        <div>
                            <label className="block text-gray-700 font-medium">Name</label>
                            <input
                                type="text"
                                {...register("name", { required: "Name is required" })}
                                className="border w-full p-3 mt-2 mb-5 bg-white/60 backdrop-blur-md rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Email</label>
                            <input
                                type="email"
                                {...register("email", { required: "Email is required" })}
                                className="border w-full p-3 mt-2 mb-5 bg-white/60 backdrop-blur-md rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Phone</label>
                            <input
                                type="number"
                                {...register("phone", { required: "Phone is required", valueAsNumber: true })}
                                className="border w-full p-3 mt-2 mb-5 bg-white/60 backdrop-blur-md rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Age</label>
                            <input
                                type="number"
                                {...register("age", {
                                    required: "Age is required",
                                    valueAsNumber: true,
                                })}
                                className="border w-full p-3 mt-2 bg-white/60 backdrop-blur-md rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                            />
                            {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
                        </div>
                        <div className="md:col-span-2 md:grid md:grid-cols-2 md:gap-x-4">
                            <div>
                                <label className="block text-gray-700 font-medium">Gender</label>
                                <select
                                    {...register("gender", { required: "Gender is required" })}
                                    className="border w-full p-3 mt-2 bg-white/60 backdrop-blur-md rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium">Blood Group</label>
                                <select
                                    {...register("bloodgroup")}
                                    className="border w-full p-3 mt-2 bg-white/60 backdrop-blur-md rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="">Select Group</option>
                                    <option value="O+">O+</option>
                                    <option value="A+">A+</option>
                                    <option value="B+">B+</option>
                                    <option value="AB+">AB+</option>
                                    <option value="O-">O-</option>
                                    <option value="A-">A-</option>
                                    <option value="B-">B-</option>
                                    <option value="AB-">AB-</option>
                                </select>
                            </div>
                            {/* Identification */}
                            <div>
                                <label className="block text-gray-700 font-medium">Identification</label>
                                <select
                                    {...register("identification.type")}
                                    className="border w-full p-3 mt-2 bg-white/60 backdrop-blur-md rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="">Select</option>
                                    <option value="Aadhaar">Aadhaar</option>
                                    <option value="Passport">Passport</option>
                                    <option value="Driving Licence">Driving Licence</option>
                                    <option value="Pan">Pan</option>
                                    <option value="Other">Other</option>

                                </select>
                                <input
                                    type="text"
                                    placeholder="Number"
                                    {...register("identification.number")}
                                    className="border w-full p-3 mt-2 bg-white/60 backdrop-blur-md rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium">Insurance</label>
                                <select
                                    {...register("insurance.provider")}
                                    className="border w-full p-3 mt-2 bg-white/60 backdrop-blur-md rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="">Select Provider</option>
                                    <option value="WBHS">WBHS</option>
                                    <option value="SWASTHYA SATHI">SWASTHYA SATHI</option>
                                    <option value="Other">Other</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Number"
                                    {...register("insurance.number")}
                                    className="border w-full bord p-3 mt-2 bg-white/60 backdrop-blur-md rounded-md"
                                />
                            </div>
                        </div>

                        {/* Allergies */}
                        <div>
                            <label className="block text-gray-700 font-medium">Allergies</label>
                            {allergyFields.map((field, index) => (
                                <div key={field.id} className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Allergy Name"
                                        {...register(`allergies.${index}.name`)}
                                        className="border w-full p-2 bg-white/60 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Causes"
                                        {...register(`allergies.${index}.causes`)}
                                        className="border w-full p-2 bg-white/60 rounded-md"
                                    />
                                    <button type="button" onClick={() => removeAllergy(index)} className="text-red-500">
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addAllergy({ name: "", causes: "" })} className="text-blue-500">
                                Add Allergy
                            </button>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Medical Records</label>
                            {medicalFields.map((field, index) => (
                                <div key={field.id} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        {...register(`medicalRecord.${index}.record`)}
                                        className="border w-full p-2 bg-white/60 rounded-md"
                                    />
                                    <button type="button" onClick={() => removeMedical(index)} className="text-red-500">
                                        X
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addMedical({ record: "" })} className="text-blue-500">
                                Add Record
                            </button>
                        </div>

                    </div>
                    {/* Submit Button */}
                    <div className="mt-5 self-center text-center">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition disabled:bg-gray-400"
                        >
                            {isSubmitting ? "Updating..." : "Update"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UpdatePatient;
