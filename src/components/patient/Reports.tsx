import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks/custom";

const Reports: React.FC = () => {
  const { patient } = useAppSelector((state) => state.patient);
  const [reports, setReports] = useState<IReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof IReport | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
//   const navigate = useNavigate();
  const itemsPerPage = 5;

  useEffect(() => {
    if (patient && patient.reports) {
      setReports(patient.reports);
    }
  }, [patient]);

  // Sorting logic
  const sortedReports = [...reports].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue! < bValue!) return sortDirection === "asc" ? -1 : 1;
    if (aValue! > bValue!) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReports = sortedReports.slice(startIndex, startIndex + itemsPerPage);

  // Change Page
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  // Change Sorting
  const handleSort = (field: keyof IReport) => {
    setSortField(field);
    setSortDirection(sortField === field ? (sortDirection === "asc" ? "desc" : "asc") : "asc");
  };

  // View report
  const handleViewReport = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white/30 backdrop-blur-md p-4 md:p-6 rounded-lg shadow-lg max-w-full md:max-w-5xl mx-auto">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">Your Medical Reports</h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-500/80 text-white">
              {["name", "uploadDate",  "action"].map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-2 border border-gray-300 cursor-pointer"
                  onClick={() => handleSort(header as keyof IReport)}
                >
                  {header.charAt(0).toUpperCase() + header.slice(1)}{" "}
                  {sortField === header && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentReports.length > 0 ? (
              currentReports.map((report, index) => (
                <tr key={index} className="hover:bg-gray-100 transition">
                  <td className="px-4 py-2 border border-gray-300">{report.name}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    {new Date(report.uploadDate).toLocaleDateString()}
                  </td>
                 
                  <td className="px-4 py-2 border border-gray-300">
                    <button
                      onClick={() => handleViewReport(report.url)}
                      className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded mr-2"
                    >
                      View
                    </button>
                    
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-gray-600 py-4">
                  No reports available.
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
          Page {currentPage} of {totalPages || 1}
        </p>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition ${
            currentPage === totalPages || totalPages === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Reports;