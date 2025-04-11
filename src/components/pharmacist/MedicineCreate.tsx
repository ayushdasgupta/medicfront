import React, { useState } from "react";
import toast from "react-hot-toast";
import { createMedicine } from "../../redux/Action/pharmacistaction";

const MedicineCreate: React.FC = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [perUnitCost, setPerUnitCost] = useState(0);
  const [tax, setTax] = useState(0)
  const [category, setCategory] = useState("Other");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, quantity, perUnitCost, category });
    const formData = new FormData();
    formData.append("name", name);
    formData.append("quantity", quantity.toString());
    formData.append("perUnitCost", perUnitCost.toString());
    formData.append("tax", tax.toString());
    formData.append("category", category);

    try {
      const data=await createMedicine(formData)
      toast.success(data.message)
    } catch (error: any) {
      toast.error(error.message)
    }

    setName("");
    setQuantity(0);
    setPerUnitCost(0);
    setCategory("");
    setTax(0)
  };
  return (

    <div className="bg-gradient-to-bl from-blue-100 via-white to-gray-100 p-4 rounded-lg shadow-lg w-full ">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-left">
        Create Medicine
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

        {/* quantity */}
        <div>
          <label htmlFor="quantity" className="text-gray-700 text-sm">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full px-2 py-1 mt-1 border rounded focus:outline-none"
            required
          />
        </div>

        {/* Per unit cost */}
        <div>
          <label htmlFor="Phone" className="text-gray-700 text-sm">
            Unit cost
          </label>
          <input
            type="number"
            id="unitcost"
            value={perUnitCost}
            onChange={(e) => setPerUnitCost(Number(e.target.value))}
            className="w-full px-2 py-1 mt-1 border rounded focus:outline-none"
            required
          />
        </div>

        {/* tax */}
        <div>
          <label htmlFor="tax" className="text-gray-700 text-sm">
            Tax
          </label>
          <select onChange={(e) => { setTax(Number(e.target.value)) }} className="w-full px-2 py-1 mt-1 border rounded focus:outline-none" name="" id="" value={tax}>
            <option value={0}>NILL</option>
            <option value={5}>5 %</option>
            <option value={12}>12 %</option>
            <option value={18}>18 %</option>
            <option value={28}>28 %</option>
            <option value={30}>30 %</option>
          </select>
        </div>
        {/* category */}
        <div>
          <label htmlFor="category" className="text-gray-700 text-sm">
            Category
          </label>
          <select onChange={(e) => { setCategory(e.target.value) }} className="w-full px-2 py-1 mt-1 border rounded focus:outline-none" name="" id="" value={category}>
            <option value="Other">Other</option>
            <option value="Antibiotic">Antibiotic</option>
            <option value="Painkiller">Painkiller</option>
            <option value="Supplement">Supplement</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Create Medicine
          </button>
        </div>
      </form>
    </div>

  );
};

export default MedicineCreate;
