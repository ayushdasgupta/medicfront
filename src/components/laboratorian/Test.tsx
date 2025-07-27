import { axiosInstance as axios } from '../../utils/axiosinstance'
import { X } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createTestForPatient } from "../../redux/Action/laboratorianaction";


const Test: React.FC = () => {
    const {
        setValue,
    } = useForm();

    const [patientId, setPatientId] = useState("");
    const [patient, setPatient] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [tests, setTests] = useState<ITest[]>([]);

    const handleSearch = async () => {
        if (!patientId.trim()) {
            toast.error("Please enter a valid Patient ID");
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.get(`/api/v1/laboratorian/patient/${patientId}`, {
                headers: { "Content-Type": "application/json" },
            });

            setPatient(data.patient);
            toast.success(data.message);

            Object.entries(data.patient).forEach(([key, value]) => {
                setValue(key as any, value);
            });
            setTests([]);
        } catch (error: any) {
            toast.error(error.medicalFields);
            setPatient(null);
            setTests([]);
        } finally {
            setLoading(false);
        }
    };

    const addTest = () => {
        setTests([...tests, { name: "", quantity: 0, cost: 0, tax: 0 }]); // New test appears at the bottom
    };

    const removeTest = (index: number) => {
        setTests(tests.filter((_, i) => i !== index)); // Remove test by index
    };

    const handleTestChange = <K extends keyof ITest>(
        index: number,
        field: K,
        value: ITest[K]
    ) => {
        const updatedTests = [...tests];
        updatedTests[index][field] = value;
        setTests(updatedTests);
    };

    const onSubmit = async () => {
        console.log("Tests:", tests);
        try {
            const data = await createTestForPatient(patientId, { tests })
            toast.success(data.message);
            setTests([])
        } catch (error: any) {
            toast.error(error.message);
        }

    };

    return (
        <div className="bg-white/30 backdrop-blur-md shadow-lg rounded-lg p-8 max-w-full mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Test Form</h2>

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

            {patient && (
                <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
                    {/* Patient Details */}
                    <div className="mb-4 p-4 bg-gray-100 rounded-md">
                        <p className="text-lg font-semibold">Patient Details</p>
                        <p><strong>Name:</strong> {patient.name || "None"}</p>
                        <p><strong>Email:</strong> {patient.email || "None"}</p>
                        <p><strong>Phone:</strong> {patient.phone || "None"}</p>
                    </div>

                    {/* Tests List - New Tests Appear at the Top */}
                    {tests.map((test, index) => (
                        <div key={index} className="border p-4 mb-4 rounded-md bg-gray-50 ">
                            <div className="flex justify-between mb-3">
                                <h1 className="text-lg font-semibold">Test no: {index + 1}</h1>
                                <button
                                    onClick={() => removeTest(index)}
                                    className=" flex justify-between items-center bg-red-500 text-white px-2 py-1 rounded-md text-sm hover:bg-red-600 transition"
                                >
                                    <X size={20} /> Remove
                                </button>
                            </div>

                            <div className="w-full flex space-x-4">
                                <div className="w-full">
                                    <label className="text-gray-700 font-medium">Test Name</label>
                                    <input
                                        type="text"
                                        value={test.name}
                                        onChange={(e) => handleTestChange(index, "name", e.target.value)}
                                        className="border w-full p-2 mt-2 mb-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <div className="w-full">
                                    <label className="text-gray-700 font-medium">Quantity</label>
                                    <input
                                        type="number"
                                        value={test.quantity}
                                        onChange={(e) => handleTestChange(index, "quantity", Number(e.target.value))}
                                        className="border w-full p-2 mt-2 mb-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="text-gray-700 font-medium">Unit Cost</label>
                                    <input
                                        type="number"
                                        value={test.cost}
                                        onChange={(e) => handleTestChange(index, "cost", Number(e.target.value))}
                                        className="border w-full p-2 mt-2 mb-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <div className="w-full">
                                    <label className=" text-gray-700 font-medium">Tax</label>
                                    <select
                                        value={test.tax}
                                        onChange={(e) => handleTestChange(index, "tax", Number(e.target.value))}
                                        className="border w-full p-2 mt-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                                    >
                                        <option value="0">NILL</option>
                                        <option value="5">5 %</option>
                                        <option value="12">12 %</option>
                                        <option value="18">18 %</option>
                                        <option value="28">28 %</option>
                                        <option value="30">30 %</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Button at the Bottom to Add a New Test */}
                    <div className="flex justify-end">
                        <button
                            onClick={addTest}
                            className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
                        >
                            + Add Test
                        </button>
                    </div>

                    <div className="mt-5 text-center">
                        <button
                            onClick={onSubmit}
                            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition"
                        >
                            Create Test
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Test;
