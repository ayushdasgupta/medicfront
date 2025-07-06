import { axiosInstance as axios } from '../../utils/axiosinstance'
import { X } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { uploadReportForPatient } from "../../redux/Action/laboratorianaction";

interface IReport {
    name: string;
    file: File | null;
}

const UploadReport: React.FC = () => {
    const {
        setValue,
    } = useForm();

    const [patientId, setPatientId] = useState("");
    const [patient, setPatient] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [reports, setReports] = useState<IReport[]>([]);

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
            if (data.patient.reports && Array.isArray(data.patient.reports)) {
                setReports(data.patient.reports);
            } else {
                setReports([]);
            }
        } catch (error: any) {
            toast.error(error.medicalFields);
            setPatient(null);
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    const addReport = () => {
        setReports([...reports, { name: "", file: null }]); // New report appears at the bottom
    };

    const removeReport = (index: number) => {
        setReports(reports.filter((_, i) => i !== index)); // Remove report by index
    };

    const handleReportNameChange = (index: number, value: string) => {
        const updatedReports = [...reports];
        updatedReports[index].name = value;
        setReports(updatedReports);
    };

    const handleFileChange = (index: number, file: File | null) => {
        const updatedReports = [...reports];
        updatedReports[index].file = file;
        setReports(updatedReports);
    };

    const onSubmit = async () => {
        console.log("Reports:", reports);

        // Validate reports before submission
        for (let i = 0; i < reports.length; i++) {
            const report = reports[i];
            if (!report.name.trim()) {
                toast.error(`Report ${i + 1} must have a name`);
                return;
            }

            if (!report.file) {
                toast.error(`Report ${i + 1} must have a file uploaded`);
                return;
            }
        }

        // Upload reports one by one
        try {
            for (let i = 0; i < reports.length; i++) {
                const report = reports[i];

                // Create FormData for single report
                const formData = new FormData();
                formData.append("name", report.name);
                formData.append("file", report.file!);

                // Upload individual report
                await uploadReportForPatient(patientId, formData);
                toast.success(`Report "${report.name}" uploaded successfully`);
            }

            // Clear reports after successful upload
            setReports([]);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="bg-white/30 backdrop-blur-md shadow-lg rounded-lg p-8 max-w-full mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload Reports</h2>

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

                    {/* Reports List */}
                    {reports.map((report, index) => (
                        <div key={index} className="border p-4 mb-4 rounded-md bg-gray-50">
                            <div className="flex justify-between mb-3">
                                <h1 className="text-lg font-semibold">Report no: {index + 1}</h1>
                                <button
                                    onClick={() => removeReport(index)}
                                    className="flex justify-between items-center bg-red-500 text-white px-2 py-1 rounded-md text-sm hover:bg-red-600 transition"
                                >
                                    <X size={20} /> Remove
                                </button>
                            </div>

                            <div className="w-full space-y-4">
                                <div className="w-full">
                                    <label className="text-gray-700 font-medium">Report Name</label>
                                    <input
                                        type="text"
                                        value={report.name}
                                        onChange={(e) => handleReportNameChange(index, e.target.value)}
                                        className="border w-full p-2 mt-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                                        placeholder="Enter report name"
                                    />
                                </div>

                                <div className="w-full">
                                    <label className="text-gray-700 font-medium">Upload PDF</label>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => handleFileChange(index, e.target.files ? e.target.files[0] : null)}
                                        className="border w-full p-2 mt-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                                    />
                                    {report.file && (
                                        <p className="mt-1 text-sm text-green-600">
                                            File selected: {report.file.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Button to Add a New Report */}
                    <div className="flex justify-end">
                        <button
                            onClick={addReport}
                            className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
                        >
                            + Add Report
                        </button>
                    </div>

                    <div className="mt-5 text-center">
                        <button
                            onClick={onSubmit}
                            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition"
                        >
                            Upload Reports
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadReport;