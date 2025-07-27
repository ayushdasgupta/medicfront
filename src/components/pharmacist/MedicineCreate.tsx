import React, { useState } from "react";
import toast from "react-hot-toast";
import { createMedicine } from "../../redux/Action/pharmacistaction";
import { medicineCategories } from "../../utils/constant";

const MedicineCreate: React.FC = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<string>("");
  const [perUnitCost, setPerUnitCost] = useState<string>("");
  const [tax, setTax] = useState<string>("")
  const [category, setCategory] = useState("Other");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, quantity, perUnitCost, category });
    const formData = new FormData();
    formData.append("name", name);
    formData.append("quantity", quantity);
    formData.append("perUnitCost", perUnitCost);
    formData.append("tax", tax);
    formData.append("category", category);

    try {
      const data = await createMedicine(formData)
      toast.success(data.message)
    } catch (error: any) {
      toast.error(error.message)
    }

    setName("");
    setQuantity("");
    setPerUnitCost("");
    setCategory("");
    setTax("")
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
            placeholder="Enter name here"
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
            placeholder="Enter Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
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
            placeholder="Enter here"
            value={perUnitCost}
            onChange={(e) => setPerUnitCost(e.target.value)}
            className="w-full px-2 py-1 mt-1 border rounded focus:outline-none"
            required
          />
        </div>

        {/* tax */}
        <div>
          <label htmlFor="tax" className="text-gray-700 text-sm">
            Tax
          </label>
          <select onChange={(e) => { setTax(e.target.value)}} className="w-full px-2 py-1 mt-1 border rounded focus:outline-none" name="" id="" value={tax}>
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
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-2 py-1 mt-1 border rounded focus:outline-none"
            value={category}
          >
            {medicineCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
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
