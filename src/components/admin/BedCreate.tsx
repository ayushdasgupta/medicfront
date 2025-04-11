import React, { useState } from "react";
import { createBeds } from "../../redux/Action/adminaction";
import toast from "react-hot-toast";

const BedCreate: React.FC = () => {
  const [bedNumber, setBedNumber] = useState(0);
  const [floorNumber, setFloorNumber] = useState(0);
  const [ward, setWard] = useState("");
  const [tax, setTax] = useState(0);
  const [category, setCategory] = useState("");
 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({bedNumber,floorNumber,ward,category});
    const formData = new FormData();
    formData.append("bednumber", bedNumber.toString());
    formData.append("floornumber", floorNumber.toString());
    formData.append("ward", ward);
    formData.append("category", category);
    formData.append("tax",tax.toString())
    createBeds(formData).then((data) => {
      toast.success(data.message)
    }).catch((e) => {
      console.log(e.message);

    })

    // Optional: Reset the form fields
    setBedNumber(0);
    setFloorNumber(0);
    setWard("");
    setCategory("");

  };
  return (

    <div className="bg-gradient-to-bl from-blue-100 via-white to-gray-100 p-4 rounded-lg shadow-lg w-full ">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-left">
        Create Beds
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4"
        style={{ height: "100%" }}
      >
        {/* bedNumber */}
        <div>
          <label htmlFor="bedNumber" className="text-gray-700 text-sm">
            Bed No
          </label>
          <input
            type="number"
            id="bedNumber"
            value={bedNumber}
            onChange={(e) => setBedNumber(Number(e.target.value))}
            className="w-full px-2 py-1 mt-1 border rounded focus:outline-none"
            required
          />
        </div>

        {/* floorNumber */}
        <div>
          <label htmlFor="floorNumber" className="text-gray-700 text-sm">
            Floor No
          </label>
          <input
            type="number"
            id="floorNumber"
            value={floorNumber}
            onChange={(e) => setFloorNumber(Number(e.target.value))}
            className="w-full px-2 py-1 mt-1 border rounded focus:outline-none"
            required
          />
        </div>

        {/* ward */}
        <div>
          <label htmlFor="ward" className="text-gray-700 text-sm">
            Ward 
          </label>
          <input
            type="text"
            id="ward"
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            className="w-full px-2 py-1 mt-1 border rounded focus:outline-none"
            required
          />
        </div>

        {/* catagory */}
        <div>
          <label htmlFor="category" className="text-gray-700 text-sm">
            Category
          </label>
          <select onChange={(e) => { setCategory(e.target.value) }} className="w-full px-2 py-1 mt-1 border rounded focus:outline-none" name="" id="" value={category}>
            <option value="">Select</option>
            <option value="General">General</option>
            <option value="ICU">ICU</option>
            <option value="Semi-Private">Semi-Private</option>
            <option value="Private">Private</option>
            <option value="Emergency">Emergency</option>
          </select>
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

        

        {/* Submit Button */}
        <div className="col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Create Bed
          </button>
        </div>
      </form>
    </div>

  );
};

export default BedCreate;
