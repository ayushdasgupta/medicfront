import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getInvoice } from "../redux/Action/invoiceaction.js";
import Loader from "./Loader.js";

// import logo from '/app.svg'

const Invoice: React.FC = () => {
  const printPdf = useRef<HTMLDivElement>(null);
  const [invoice, setInvoice] = useState<IInvoice | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();


useEffect(() => {
  if (!id) {
    setError("Invoice ID is missing");
    setIsLoading(false);
    return;
  }

  setIsLoading(true);
    getInvoice(id)
      .then((data) => {
        setInvoice(data.invoice);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error("Error fetching invoice:", e);
        setError(e.message || "Failed to load invoice");
        setIsLoading(false);
      });
  }, [id]);
  // const pdfDownloadHandler = async () => {
  //   const inputData = printPdf.current;
  //   if (!inputData) return;

  //   try {
  //     const dataUrl = await domtoimage.toPng(inputData, {
  //       quality: 1,
  //       bgcolor: "#ffffff",
  //       style: {  transformOrigin: "top left" }
  //       });
  //     const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });

  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();

  //     const img = new Image();
  //     img.src = dataUrl;
  //     img.onload = () => {
  //       const imgWidth = img.width;
  //       const imgHeight = img.height;
  //       const scaleFactor = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  //       pdf.addImage(img, "PNG", (pdfWidth - imgWidth * scaleFactor) / 2, 10, imgWidth * scaleFactor, imgHeight * scaleFactor);
  //       const pdfBlob = pdf.output("bloburl");
  //       window.open(pdfBlob, "_blank");
  //       // pdf.save("Hospital_Invoice.pdf");
  //     };
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //   }
  // };

  const pdfDownloadHandler = async () => {
    if (!printPdf.current) {
      return
    }
    const content = printPdf.current.outerHTML;

    const htmlContent = `<html>
      <head>
       <script src="https://cdn.tailwindcss.com"></script>
      </head>
      ${content}
    </html>`

    console.log(htmlContent);

    const { data } = await axios.post("/api/generate-pdf", { htmlContent }, {

      headers: { "Content-Type": "application/json" },
    });


    if (data.success) {
      window.open(data.pdfUrl, "_blank"); 
    }
  };
  // const pdfDownloadHandler = async () => {
  //   const inputData = printPdf.current;
  //   try {
  //     const canvas = await html2canvas(inputData!, { scale: 5 });
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF({ orientation: "portrait", unit: "em", format: "a4" });

  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();
  //     const imgProperties = pdf.getImageProperties(imgData);
  //     const imgWidth = imgProperties.width;
  //     const imgHeight = imgProperties.height;
  //     const scaleFactor = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  //     const scaledWidth = imgWidth * scaleFactor;
  //     const scaledHeight = imgHeight * scaleFactor;
  //     const xOffset = (pdfWidth - scaledWidth) / 2;
  //     const yOffset = (pdfHeight - scaledHeight) / 2;

  //     pdf.addImage(imgData, "PNG", xOffset, yOffset, scaledWidth, scaledHeight);
  //     const pdfBlob = pdf.output("bloburl");
  //   window.open(pdfBlob, "_blank");
  //     // pdf.save("Hospital_Invoice.pdf");
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //   }
  // };

  
  // console.log(invoice);
  
  const calculateTotalDaysForBed = (bed: IBeds):number => {
    const startDate = new Date(bed.admissionDate!);
    const endDate = new Date(bed.dischargeDate!);
    const diffInMs = endDate.getTime() - startDate.getTime(); // Difference in milliseconds
    console.log(diffInMs);
    
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // Convert to days and round up
  };
  const calculateTotal = () => {
    if (!invoice) return 0;
    const appointmentTotal = invoice.appointments?.reduce(
      (sum, app) => sum + app.fees + (app.fees * app.tax!) / 100,
      0
    ) || 0;

    const bedTotal = invoice!.beds!.reduce(
      (sum, bed) => sum + (bed.perDayCharge * calculateTotalDaysForBed(bed)) + ((bed.perDayCharge * calculateTotalDaysForBed(bed)) * bed.tax!) / 100,
      0
    ) || 0;

    const medicineTotal = invoice!.medicine!.reduce(
      (sum, med) => sum + (med.quantity * med.perUnitCost) + ((med.quantity * med.perUnitCost) * med.tax) / 100,
      0
    ) || 0;
    const testTotal = invoice!.test!.reduce(
      (sum, report) => sum + (report.quantity * report.cost) + ((report.quantity * report.cost) *report.tax) / 100,
      0
    ) || 0;

    return (appointmentTotal + bedTotal + medicineTotal+testTotal).toFixed(2);
  };
  if (isLoading) {
    return <Loader/>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  if (!invoice) {
    return <div className="flex justify-center items-center min-h-screen">No invoice data found</div>;
  }

  
  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 flex flex-col items-center">
      <div ref={printPdf} className="bg-white shadow-lg rounded-lg p-4 md:p-6 w-full max-w-3xl">
        <div className="p-4 md:p-8 bg-white border border-gray-200">
          <div className="flex w-full justify-between">
            <div className="flex w-1/2 flex-col mb-4">
              <img className="w-1/6" src="/app.png" alt="logo" />
              <h1 className="text-primary font-bold text-4xl">MedicaPro</h1>
            </div>
            <h1 className="self-end font-bold">Date : {invoice.createdAt?.toLocaleString().split("T")[0]}</h1>
          </div>
          <hr className="border-2" />
          <div className="mt-2">
            <h1 className="text-gray-800 text-2xl font-medium mb-2">Type : Invoice</h1>
            <p className="text-gray-800">Patient: {invoice?.patient.name}</p>
            <p className="text-gray-800">Phone: {invoice?.patient.phone}</p>
            <p className="text-gray-800 mb-6">Email: {invoice?.patient.email}</p>
          </div>

          {invoice?.appointments?.length!==0 && <>
            <h2 className="text-lg font-semibold mb-2">Appointments</h2>
            <table className="w-full mb-6 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-sm md:text-base">
                  <th className="border p-2 text-center">Doctor</th>
                  <th className="border p-2 text-center">Specialization</th>
                  <th className="border p-2 text-center">Date</th>
                  <th className="border p-2 text-center">Fee</th>
                  <th className="border p-2 text-center">GST</th>
                  <th className="border p-2 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.appointments?.map((app, index) => {
                  const taxAmount = app.fees * (app.tax! / 100);
                  const total = app.fees + taxAmount;
                  return (
                    <tr key={index} className="text-sm md:text-base">
                      <td className="border p-2 text-center">{app.doctor}</td>
                      <td className="border p-2 text-center">{app.specialization}</td>
                      <td className="border p-2 text-center">{app.date.toLocaleString().split("T")[0]}</td>
                      <td className="border p-2 text-center">₹{app.fees.toFixed(2)}</td>
                      <td className="border p-2 text-center">₹{taxAmount.toFixed(2)}</td>
                      <td className="border p-2 text-center">₹{total.toFixed(2)}</td>
                    </tr>
                  );
                })}
                <tr className="text-sm md:text-base">
                  <td className=" p-2 font-bold text-center">Total</td>
                  <td className=" p-2 font-bold text-center"></td>
                  <td className=" p-2 font-bold text-center"></td>
                  <td className=" p-2 font-bold text-center"></td>
                  <td className=" p-2 font-bold text-center"></td>
                  <td className=" p-2 font-bold text-center">₹{invoice.appointments?.reduce(
                    (sum, app) => sum + app.fees + (app.fees * app.tax!) / 100,
                    0
                  ).toFixed(2) || 0}</td>
                </tr>
              </tbody>
            </table>
          </>}

          {invoice?.beds?.length!==0 && <>
            <h2 className="text-lg font-semibold mb-2">Bed Charges</h2>
            <table className="w-full mb-6 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-sm md:text-base">
                  <th className="border p-2 text-center">Bed No</th>
                  <th className="border p-2 text-center">Ward</th>
                  <th className="border p-2 text-center">Days</th>
                  <th className="border p-2 text-center">Rate</th>
                  <th className="border p-2 text-center">GST</th>
                  <th className="border p-2 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice?.beds?.map((bed, index) => {
                  const totalWithoutGST = bed.perDayCharge * calculateTotalDaysForBed(bed);
                  const gstAmount = totalWithoutGST * (bed.tax! / 100);
                  const totalWithGST = totalWithoutGST + gstAmount;
                  return (
                    <tr key={index} className="text-sm md:text-base">
                      <td className="border p-2 text-center">{bed.bednumber}</td>
                      <td className="border p-2 text-center">{bed.ward}</td>
                      <td className="border p-2 text-center">{calculateTotalDaysForBed(bed)}</td>
                      <td className="border p-2 text-center">₹{bed.perDayCharge.toFixed(2)}</td>
                      <td className="border p-2 text-center">₹{gstAmount.toFixed(2)}</td>
                      <td className="border p-2 text-center">₹{totalWithGST.toFixed(2)}</td>
                    </tr>
                  );
                })}
                <tr className="text-sm md:text-base">
                  <td className=" p-2 font-bold text-center">Total</td>
                  <td className=" p-2 font-bold text-center"></td>
                  <td className=" p-2 font-bold text-center"></td>
                  <td className=" p-2 font-bold text-center"></td>
                  <td className=" p-2 font-bold text-center"></td>
                  <td className=" p-2 font-bold text-center">₹{invoice.beds?.reduce(
                    (sum, bed) => sum + (bed.perDayCharge * calculateTotalDaysForBed(bed)) + ((bed.perDayCharge * calculateTotalDaysForBed(bed)) * bed.tax!) / 100,
                    0
                  ).toFixed(2) || 0}</td>
                </tr>
              </tbody>
            </table>
          </>
          }
          {invoice?.medicine?.length!==0 && <>
            <h2 className="text-lg font-semibold mb-2">Medicine Charges</h2>
            <table className="w-full mb-6 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-sm md:text-base">
                  <th className="border p-2 text-center">Name</th>
                  <th className="border p-2 text-center">Quantiy</th>
                  <th className="border p-2 text-center">Unit Cost</th>
                  <th className="border p-2 text-center">GST</th>
                  <th className="border p-2 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice?.medicine?.map((med, index) => {
                  const totalWithoutGST = med.perUnitCost * med.quantity;
                  const gstAmount = totalWithoutGST * (med.tax / 100);
                  const totalWithGST = totalWithoutGST + gstAmount;
                  return (
                    <tr key={index} className="text-sm md:text-base">
                      <td className="border p-2 text-center">{med.name}</td>
                      <td className="border p-2 text-center">{med.quantity}</td>
                      <td className="border p-2 text-center">{med.perUnitCost}</td>
                      <td className="border p-2 text-center">₹{gstAmount.toFixed(2)}</td>
                      <td className="border p-2 text-center">₹{totalWithGST.toFixed(2)}</td>
                    </tr>
                  );
                })}
                <tr className="text-sm  md:text-base">
                  <td className=" p-2 font-bold text-center">Total</td>
                  <td className=" p-2 font-bold text-center"></td>
                  <td className=" p-2 font-bold text-center"></td>
                  <td className=" p-2 font-bold text-center"></td>
                  <td className=" p-2 font-bold text-center">₹{invoice.medicine?.reduce(
                    (sum, med) => sum + (med.quantity * med.perUnitCost) + ((med.quantity * med.perUnitCost) * med.tax) / 100,
                    0
                  ).toFixed(2) || 0}</td>
                </tr>
              </tbody>
            </table>
          </>
          }
          {invoice?.test?.length!==0 && <>
            <h2 className="text-lg font-semibold mb-2">Report and Test Charges</h2>
            <table className="w-full mb-6 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-sm md:text-base">
                  <th className="border p-2 text-center">Name</th>
                  <th className="border p-2 text-center">Quantiy</th>
                  <th className="border p-2 text-center">Unit Cost</th>
                  <th className="border p-2 text-center">GST</th>
                  <th className="border p-2 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice?.test?.map((rep, index) => {
                  const totalWithoutGST = rep.cost * rep.quantity;
                  const gstAmount = totalWithoutGST * (rep.tax / 100);
                  const totalWithGST = totalWithoutGST + gstAmount;
                  return (
                    <tr key={index} className="text-sm md:text-base">
                      <td className="border p-2 text-center">{rep.name}</td>
                      <td className="border p-2 text-center">{rep.cost}</td>
                      <td className="border p-2 text-center">{rep.quantity}</td>
                      <td className="border p-2 text-center">₹{gstAmount.toFixed(2)}</td>
                      <td className="border p-2 text-center">₹{totalWithGST.toFixed(2)}</td>
                    </tr>
                  );
                })}
                <tr className="text-sm  md:text-base">
                  <td className=" p-2 font-bold text-center">Total</td>
                  <td className=" p-2 font-bold text-center"></td>
                  <td className=" p-2 font-bold text-center"></td>
                  <td className=" p-2 font-bold text-center"></td>
                  <td className=" p-2 font-bold text-center">₹{invoice.test?.reduce(
                    (sum, rep) => sum + (rep.quantity * rep.cost) + ((rep.quantity * rep.cost) * rep.tax) / 100,
                    0
                  ).toFixed(2) || 0}</td>
                </tr>
              </tbody>
            </table>
          </>
          }

          <div className="font-bold text-lg text-right">Grand Total: ₹{calculateTotal()}</div>
          <div className="font-bold text-lg text-right">Paid: ₹{invoice!.paid.toFixed(2)}</div>
        </div>
      </div>
      <button onClick={pdfDownloadHandler} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Download PDF</button>
    </div>
  );
};

export default Invoice;
