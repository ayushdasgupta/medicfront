import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import { loadpatient, patientUpdate } from "../../redux/Action/patientaction";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/custom";
import { loadpatientinfo } from "../../redux/slice/patientSlice";

// Patient Interface


const UpdateMedicalInfo: React.FC = () => {
    const dispatch = useAppDispatch();
    const { patient } = useAppSelector((state) => state.patient);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { isSubmitting },
    } = useForm<IPatient>({
        defaultValues: {
            bloodgroup: null,
            allergies: [{ name: null, causes: null }],
            medicalRecord: [], // Ensure it's initialized as an array
            identification: { type: null, number: null },
            insurance: { provider: null, number: null },
        },
    });

    // Manage Allergy Fields
    const { fields: allergyFields, append: addAllergy, remove: removeAllergy } =
        useFieldArray({ control, name: "allergies" });

    // Manage Medical Records Field (Fix Applied)
    const { fields: medicalFields, append: addMedical, remove: removeMedical } =
        useFieldArray({ control, name: "medicalRecord" });

    useEffect(() => {
        if (patient) {
            reset({
                ...patient,
                allergies: patient?.allergies || [{ name: null, causes: null }],
                medicalRecord: patient.medicalRecord || [],
            });
        }
        // loadpatient()
        //     .then((data) => {
        //         dispatch(loadpatientinfo(data));
        //         reset({
        //             ...data.patient,
        //             allergies: data.patient?.allergies || [{ name: null, causes: null }],
        //             medicalRecord: data.patient?.medicalRecord?.map((record: string) => (record)) || [],
        //         });
        //     })
        //     .catch(() => toast.error("Failed to load patient data"));
    }, [patient]);

    const onSubmit = async (formData: IPatient) => {
        try {
            await patientUpdate(formData);
            const data = await loadpatient()
            dispatch(loadpatientinfo(data));
            toast.success("Update successful!");
        } catch {
            toast.error("Update failed!");
        }
    };

    return (
        <div className="bg-white/30 backdrop-blur-md p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Medical Information</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Blood Group */}
                <div>
                    <label className="block text-gray-700 font-medium">Blood Group</label>
                    <select
                        {...register("bloodgroup")}
                        className="w-full p-3 mt-2 bg-white/60 backdrop-blur-md rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
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

                {/* Allergies */}
                <div>
                    <label className="block text-gray-700 font-medium">Allergies</label>
                    {allergyFields.map((field, index) => (
                        <div key={field.id} className="space-y-2">
                            <input
                                type="text"
                                placeholder="Allergy Name"
                                {...register(`allergies.${index}.name`)}
                                className="w-full p-2 bg-white/60 rounded-md"
                            />
                            <input
                                type="text"
                                placeholder="Causes"
                                {...register(`allergies.${index}.causes`)}
                                className="w-full p-2 bg-white/60 rounded-md"
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

                {/* Medical Records (Fixed) */}
                <div>
                    <label className="block text-gray-700 font-medium">Medical Records</label>
                    {medicalFields.map((field, index) => (
                        <div key={field.id} className="flex items-center space-x-2">
                            <input
                                type="text"
                                {...register(`medicalRecord.${index}.record`)}
                                className="w-full p-2 bg-white/60 rounded-md"
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
                        className="w-full border p-3 mt-2 bg-white/60 backdrop-blur-md rounded-md"
                    />
                </div>

                {/* Insurance */}
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
                        className="border w-full p-3 mt-2 bg-white/60 backdrop-blur-md rounded-md"
                    />
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

export default UpdateMedicalInfo;
