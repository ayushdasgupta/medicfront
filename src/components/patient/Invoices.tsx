import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/custom";
import { format } from "date-fns";

const Invoices: React.FC = () => {
  const { patient } = useAppSelector((state) => state.patient);
  const [invoice, setInvoice] = useState<IInvoice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof IInvoice | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();
  const itemsPerPage = 5;

  useEffect(() => {
    if (patient && patient.invoice) {
      setInvoice(patient.invoice);
    }
  }, [patient]);

  // Sorting logic
  const sortedInvoices = [...invoice].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue! < bValue!) return sortDirection === "asc" ? -1 : 1;
    if (aValue! > bValue!) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInvoices = sortedInvoices.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const handleSort = (field: keyof IInvoice) => {
    setSortField(field);
    setSortDirection(sortField === field ? (sortDirection === "asc" ? "desc" : "asc") : "asc");
  };

  const handleInvoice = (id: string) => {
    navigate(`/invoice/${id}`);
  };

  return (
    <div className="bg-white/30 backdrop-blur-md p-4 md:p-6 rounded-lg shadow-lg max-w-full md:max-w-5xl mx-auto">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">Your Invoices</h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-500/80 text-white">
              {["Date", "Action"].map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-2 border border-gray-300 cursor-pointer"
                  onClick={() => handleSort(header.toLowerCase() as keyof IInvoice)}
                >
                  {header} {sortField === header.toLowerCase() && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentInvoices.length > 0 ? (
              currentInvoices.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-gray-100 transition">
                  <td className="px-4 py-2 border border-gray-300">
                    {invoice.createdAt ? format(new Date(invoice.createdAt), "yyyy-MM-dd HH:mm:ss") : "N/A"}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <button
                      onClick={() => handleInvoice(invoice._id!)}
                      className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center text-gray-600 py-4">
                  No invoice available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Previous
        </button>
        <p className="text-gray-700">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Invoices;
