import {axiosInstance as axios} from "../../utils/axiosinstance";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { invoiceGenerate } from "../../redux/Action/receptionistaction";
import { useNavigate } from "react-router-dom";
import { dateFormater } from "../../utils/constant";

const InvoiceGenerate: React.FC = () => {
  const [patientId, setPatientId] = useState("");
  const [invoice, setInvoice] = useState<IInvoice | null>(null);
  const [loading, setLoading] = useState<boolean>(false)
  const [invoiceId, setInvoiceId] = useState<string>("");
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<{
    appointments: IAppointment[];
    beds: IBeds[];
    medicine: IMedicine[];
    test: ITest[];
  }>({
    appointments: [],
    beds: [],
    medicine: [],
    test: []
  });
  const [calculatedTotals, setCalculatedTotals] = useState({
    selectedTotal: 0,
    paidAmount: 0,
    finalAmountToPay: 0
  });
  const toggleItemSelection = (item: any, type: keyof typeof selectedItems) => {
    setSelectedItems(prev => {
      const currentItems = prev[type];
      const isItemSelected = currentItems.includes(item);

      const updatedItems = isItemSelected
        ? currentItems.filter(selectedItem => selectedItem !== item)
        : [...currentItems, item];

      return {
        ...prev,
        [type]: updatedItems
      };
    });
  };
  useEffect(() => {
    if (invoice) {
      const calculateTotalDaysForBed = (bed: any) => {
        const startDate = new Date(bed.admissionDate);
        const endDate = new Date(bed.dischargeDate);
        const diffInMs = endDate.getTime() - startDate.getTime(); // Difference in milliseconds
        console.log(diffInMs);

        return Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // Convert to days and round up
      };
      const calculateSelectedTotal = () => {
        const sumArray = (arr: any[], costKey: string, taxKey: string, quantityKey?: string, isBed?: boolean) =>
          Array.isArray(arr) && arr.length > 0
            ? arr.reduce((sum, item) => {
              let baseCost;
              if (isBed) {
                // For beds, multiply perDayCharge by totalDaysStayed
                const totalDays = calculateTotalDaysForBed(item);
                baseCost = (item[costKey] || 0) * totalDays;
              } else {
                // Normal cost calculation
                baseCost = (item[costKey] || 0) * (quantityKey ? (item[quantityKey] || 1) : 1);
              }
              const taxAmount = (baseCost * (item[taxKey] || 0)) / 100;
              return sum + baseCost + taxAmount;
            }, 0)
            : 0;

        const selectedAppointmentsTotal = sumArray(selectedItems.appointments, "fees", "tax");
        const selectedBedsTotal = sumArray(selectedItems.beds!, "perDayCharge", "tax", undefined, true);
        const selectedMedicineTotal = sumArray(selectedItems.medicine, "perUnitCost", "tax", "quantity");
        const selectedTestsTotal = sumArray(selectedItems.test, "cost", "tax", "quantity");

        const selectedTotal =
          selectedAppointmentsTotal +
          selectedBedsTotal +
          selectedMedicineTotal +
          selectedTestsTotal;

        setCalculatedTotals({
          selectedTotal,
          paidAmount: invoice.paid,
          finalAmountToPay: selectedTotal
        });
      };

      calculateSelectedTotal();
    }
  }, [selectedItems, invoice]);

  const handleSearch = async () => {
    try {
      setLoading(true)
      if (!patientId.trim()) {
        toast.error("Please enter a valid Patient ID");
        return;
      }
      const { data } = await axios.get(`/api/v1/patient/info/${patientId}`, {
        headers: { "Content-Type": "application/json" },
      });

      // Simulating API call with dummy data
      // In real implementation, replace with actual API call

      const fetchedInvoice: IInvoice = {
        patient: {
          name: data.patient.name,
          phone: data.patient.phone,
          email: data.patient.email,
        },
        appointments: data.patient.appointment.filter((appt: IAppointment) => !appt.isPaid),
        beds: data.patient.beds.filter((bed: IBeds) => bed.dischargeDate!==null),
        medicine: data.patient.medicine.filter((med: IMedicine) => !med.isPaid),
        test: data.patient.tests.filter((test: ITest) => !test.isPaid),
        total: 0,
        paid: 0,
        remaining: 0,
      };
      const calculateTotalDaysForBed = (bed: any) => {
        const startDate = new Date(bed.admissionDate);
        const endDate = new Date(bed.dischargeDate);
        const diffInMs = endDate.getTime() - startDate.getTime(); // Difference in milliseconds
        console.log(diffInMs);

        return Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // Convert to days and round up
      };
      const calculateTotal = () => {
        const sumArray = (arr: any[], costKey: string, taxKey: string, quantityKey?: string, isBed?: boolean) =>
          Array.isArray(arr) && arr.length > 0
            ? arr.reduce((sum, item) => {
              let baseCost;
              if (isBed) {
                // For beds, multiply perDayCharge by totalDaysStayed
                const totalDays = calculateTotalDaysForBed(item);
                baseCost = (item[costKey] || 0) * totalDays;
              } else {
                // Normal cost calculation
                baseCost = (item[costKey] || 0) * (quantityKey ? (item[quantityKey] || 1) : 1);
              }
              const taxAmount = (baseCost * (item[taxKey] || 0)) / 100;
              return sum + baseCost + taxAmount;
            }, 0)
            : 0;

        return (
          sumArray(fetchedInvoice.beds!, "perDayCharge", "tax", undefined, true) + // Includes perDayCharge * days
          sumArray(fetchedInvoice.appointments!, "fees", "tax") +
          sumArray(fetchedInvoice.medicine!, "perUnitCost", "tax", "quantity") + // Includes quantity
          sumArray(fetchedInvoice.test!, "cost", "tax", "quantity") // Includes quantity
        );
      };
      fetchedInvoice.total = calculateTotal();
      fetchedInvoice.remaining = fetchedInvoice.total - fetchedInvoice.paid;
      console.log(fetchedInvoice);

      setInvoice(fetchedInvoice);
      toast.success("Invoice details fetched successfully!");
    } catch (error) {
      toast.error("Failed to fetch invoice!");
    }finally{
      setLoading(false)
    }
  };
  const calculateTotalDaysForBed = (bed: any) => {
    const startDate = new Date(bed.admissionDate);
    const endDate = new Date(bed.dischargeDate);
    const diffInMs = endDate.getTime() - startDate.getTime(); // Difference in milliseconds
    console.log(diffInMs);

    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // Convert to days and round up
  };

  const generateInvoice = async () => {
    if (!invoice) return;

    const invoiceData = {
      invoice,
      selectedTotal: calculatedTotals.selectedTotal.toFixed(2),
      selectedItems, patientId

    };

    console.log("Generating Invoice:", invoiceData);
    const data = await invoiceGenerate(invoiceData);
    setInvoiceId(data.invoice._id);
    toast.success("Invoice generated successfully!");
  };
  const buttonGnerate = () => {
    navigate(`/invoice/${invoiceId}`)
  }
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Generate Invoice</h2>

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

      {invoice && (
        <div className="bg-white shadow-md rounded-lg mt-3 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{invoice.patient.name}</h2>
            <p>Phone: {invoice.patient.phone}</p>
            <p>Email: {invoice.patient.email}</p>
          </div>

          {/* Appointments Section */}
          {invoice.appointments?.length!==0 && (
            <section className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Appointments</h3>
              {invoice.appointments?.map((appt, index) => (
                !appt.isPaid && (<div
                  key={index}
                  className={`flex justify-between items-center p-3 border-b ${selectedItems.appointments.includes(appt) ? 'bg-blue-50' : ''
                    }`}
                >
                  <div>
                    <p>{appt.doctor} - {appt.specialization?.join(", ")}</p>
                    <p>{dateFormater(appt.date)}</p>
                  </div>
                  <div>
                    <p>Fee: ₹{appt.fees}</p>
                    <p>Tax: {appt.tax}%</p>
                  </div>
                  <button
                    onClick={() => toggleItemSelection(appt, 'appointments')}
                    className={`px-4 py-2 rounded ${selectedItems.appointments.includes(appt)
                      ? 'bg-red-500 text-white'
                      : 'bg-blue-500 text-white'
                      }`}
                  >
                    {selectedItems.appointments.includes(appt) ? 'Remove' : 'Select'}
                  </button>
                </div>)
              ))}
            </section>
          )

          }

          {/* Similar sections for Beds, Medicines, Tests */}
          {/* Beds Section */}
          {invoice.beds?.length!==0 && (
            <section className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Beds</h3>
              {invoice.beds?.map((bed, index) => (
                !bed.isPaid && (<div
                  key={index}
                  className={`flex justify-between items-center p-3 border-b ${selectedItems.beds.includes(bed) ? 'bg-blue-50' : ''
                    }`}
                >
                  <div>
                    <p>Bed {bed.bednumber} - {bed.ward}</p>
                    <p>{calculateTotalDaysForBed(bed)}</p>
                  </div>
                  <div>
                    <p>Per Day: ₹{bed.perDayCharge}</p>
                    <p>Tax: {bed.tax}%</p>
                  </div>
                  <button
                    onClick={() => toggleItemSelection(bed, 'beds')}
                    className={`px-4 py-2 rounded ${selectedItems.beds.includes(bed)
                      ? 'bg-red-500 text-white'
                      : 'bg-blue-500 text-white'
                      }`}
                  >
                    {selectedItems.beds.includes(bed) ? 'Remove' : 'Select'}
                  </button>
                </div>)
              ))}
            </section>
          )

          }
          {/* Medicines Section - NEW */}
          {invoice.medicine?.length!==0 && (
            <section className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Medicines</h3>
              {invoice.medicine?.map((med, index) => (
                !med.isPaid && (<div
                  key={index}
                  className={`flex justify-between items-center p-3 border-b ${selectedItems.medicine.includes(med) ? 'bg-blue-50' : ''
                    }`}
                >
                  <div>
                    <p>{med.name}</p>
                    <p>Quantity: {med.quantity}</p>
                  </div>
                  <div>
                    <p>Per Unit Cost: ₹{med.perUnitCost}</p>
                    <p>Tax: {med.tax}%</p>
                  </div>
                  <button
                    onClick={() => toggleItemSelection(med, 'medicine')}
                    className={`px-4 py-2 rounded ${selectedItems.medicine.includes(med)
                      ? 'bg-red-500 text-white'
                      : 'bg-blue-500 text-white'
                      }`}
                  >
                    {selectedItems.medicine.includes(med) ? 'Remove' : 'Select'}
                  </button>
                </div>)
              ))}
            </section>
          )

          }

          {/* Tests Section */}
          {invoice.test?.length!==0 && (
            <section className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Tests</h3>
              {invoice.test?.map((test, index) => (
                !test.isPaid && (<div
                  key={index}
                  className={`flex justify-between items-center p-3 border-b ${selectedItems.test.includes(test) ? 'bg-blue-50' : ''
                    }`}
                >
                  <div>
                    <p>{test.name}</p>
                    <p>Quantity: {test.quantity}</p>
                  </div>
                  <div>
                    <p>Cost: ₹{test.cost}</p>
                    <p>Tax: {test.tax}%</p>
                  </div>
                  <button
                    onClick={() => toggleItemSelection(test, 'test')}
                    className={`px-4 py-2 rounded ${selectedItems.test.includes(test)
                      ? 'bg-red-500 text-white'
                      : 'bg-blue-500 text-white'
                      }`}
                  >
                    {selectedItems.test.includes(test) ? 'Remove' : 'Select'}
                  </button>
                </div>)
              ))}
            </section>
          )

          }

          {/* Total and Generation */}
          <div className="mt-6 border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-xl font-bold">Total Invoice Amount:</span>
              <span className="text-xl font-bold">₹{invoice.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xl font-bold text-green-600">Selected Total:</span>
              <span className="text-xl font-bold text-green-600">₹{calculatedTotals.selectedTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-red-600">Remaining Amount:</span>
              <span className="font-bold text-red-600">₹{(invoice.remaining - calculatedTotals.selectedTotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Paid Amount:</span>
              <span className="font-bold">₹{calculatedTotals.paidAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-2xl font-bold text-red-700">Final Amount to Pay:</span>
              <span className="text-2xl font-bold text-red-700">₹{calculatedTotals.finalAmountToPay.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={generateInvoice}
            disabled={calculatedTotals.finalAmountToPay === 0}
            className="w-full mt-6 bg-green-500 text-white py-3 rounded disabled:bg-gray-300"
          >
            Generate Invoice
          </button>
          <button
            onClick={buttonGnerate}
            disabled={invoiceId === ""}
            className="w-full mt-6 bg-green-500 text-white py-3 rounded disabled:bg-gray-300"
          >
            Goto Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerate;