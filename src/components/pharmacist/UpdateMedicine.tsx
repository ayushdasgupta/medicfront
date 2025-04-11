import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { updateMedicine } from "../../redux/Action/pharmacistaction";

// Update interface to include newStock

const UpdateMedicine: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<IMedicine>({
        defaultValues: {
            name: "",
            quantity: 0,
            newStock: 0,
            perUnitCost: 0,
            tax: 0,
            category: ""
        },
    });

    const [medicineId, setMedicineId] = useState("");
    const [medicine, setMedicine] = useState<IMedicine | null>(null);
    const [loading, setLoading] = useState(false);
    const [originalQuantity, setOriginalQuantity] = useState(0);

    // Watch the newStock value to update quantity
    const newStock = watch("newStock") || 0;

    const handleSearch = async () => {
        if (!medicineId.trim()) {
            toast.error("Please enter a valid Patient ID");
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.get(`/api/v1/pharmacist/medicine/${medicineId}`, {
                headers: { "Content-Type": "application/json" },
            });

            setMedicine(data.medicine);
            toast.success(data.message);

            // Store the original quantity
            setOriginalQuantity(data.medicine.quantity);

            // Populate form fields with fetched data
            Object.entries(data.medicine).forEach(([key, value]) => {
                setValue(key as any, value);
            });

            // Initialize newStock as 0
            setValue("newStock", 0);

            // Set quantity to be the original value
            setValue("quantity", data.medicine.quantity);

        } catch (error: any) {
            toast.error(error.medicalFields);
            setMedicine(null);
        } finally {
            setLoading(false);
        }
    };

    // Update the quantity whenever newStock changes
    React.useEffect(() => {
        if (medicine) {
            setValue("quantity", originalQuantity + newStock);
        }
    }, [newStock, originalQuantity, medicine, setValue]);

    const onSubmit = async (formData: IMedicine) => {
        try {
            // Calculate the final quantity as the sum of original and new stock
            const dataToSubmit = {
                ...formData,
                quantity: originalQuantity + formData.newStock!,
            };
            
            console.log(dataToSubmit);

            await updateMedicine(medicineId, dataToSubmit);
            toast.success("Update successful!");
        } catch {
            toast.error("Update failed!");
        }
    };

    return (
        <div className="bg-white/30 backdrop-blur-md shadow-lg rounded-lg p-8 max-w-full mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Update medicine details</h2>

            {/* Search Input & Button */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={medicineId}
                    onChange={(e) => setMedicineId(e.target.value)}
                    placeholder="Enter Medicine ID"
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

            {/* Display Medicine Details with react-hook-form */}
            {medicine && (
                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 p-4 bg-white shadow-md rounded-lg">
                    <div className="md:grid md:grid-cols-5 md:gap-x-4 max-w-full">
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
                            <label className="block text-gray-700 font-medium">Current Quantity</label>
                            <input
                                type="number"
                                readOnly
                                value={originalQuantity}
                                className="border w-full p-3 mt-2 mb-5 bg-gray-100 rounded-md shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">New Stock</label>
                            <input
                                type="number"
                                {...register("newStock", { required: "New stock is required", valueAsNumber: true })}
                                className="border w-full p-3 mt-2 mb-5 bg-white/60 backdrop-blur-md rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                            />
                            {errors.newStock && <p className="text-red-500 text-sm">{errors.newStock.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Total Quantity</label>
                            <input
                                type="number"
                                readOnly
                                {...register("quantity")}
                                className="border w-full p-3 mt-2 mb-5 bg-gray-100 rounded-md shadow-sm"
                            />
                            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Unit Cost</label>
                            <input
                                type="number"
                                {...register("perUnitCost", { required: "Unit cost is required", valueAsNumber: true })}
                                className="border w-full p-3 mt-2 mb-5 bg-white/60 backdrop-blur-md rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                            />
                            {errors.perUnitCost && <p className="text-red-500 text-sm">{errors.perUnitCost.message}</p>}
                        </div>
                    </div>

                    <div className="md:grid md:grid-cols-5 md:gap-x-4 max-w-full">
                        <div>
                            <label className="block text-gray-700 font-medium">Tax</label>
                            <select
                                {...register("tax", { required: "tax is required" })}
                                className="border w-full p-3 mt-2 bg-white/60 backdrop-blur-md rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="0">NILL</option>
                                <option value="5">5 %</option>
                                <option value="12">12 %</option>
                                <option value="18">18 %</option>
                                <option value="28">28 %</option>
                                <option value="30">30 %</option>
                            </select>
                            {errors.tax && <p className="text-red-500 text-sm">{errors.tax.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Category</label>
                            <select
                                {...register("category", { required: "Category is required" })}
                                className="border w-full p-3 mt-2 bg-white/60 backdrop-blur-md rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="Other">Other</option>
                                <option value="Antibiotic">Antibiotic</option>
                                <option value="Painkiller">Painkiller</option>
                                <option value="Supplement">Supplement</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
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

export default UpdateMedicine;