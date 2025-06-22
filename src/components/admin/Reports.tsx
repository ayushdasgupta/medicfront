import React, { useEffect, useState } from "react";
import { Line, Bar, Pie, Doughnut, Radar, PolarArea } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Filler
} from "chart.js";
import {allDoctor, allAppointment, allPatient  } from "../../redux/Action/adminaction";
import { getAllInvoices } from "../../redux/Action/adminaction"; // Assuming you have this action
//pro
import {allReceptionist} from "../../redux/Action/adminaction";
//plus
import { allPharmacists,allLaboratorians } from "../../redux/Action/adminaction";
//end

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Filler
);

// Interface for Invoice data
interface Invoice {
  _id?: string;
  patient: {
    name: string;
    phone: number;
    email: string;
  };
  total: number;
  paid: number;
  remaining: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const Report: React.FC = () => {
  const [doctorCount, setDoctorCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
//pro
  const [receptionistCount, setReceptionistCount] = useState(0);
//plus
  const [pharmacistCount, setPharmacistCount] = useState(0);
  const [laboratorianCount, setLaboratorianCount] = useState(0);
//end
  const [appointmentData, setAppointmentData] = useState<number[]>([]);
  const [patientData, setPatientData] = useState<number[]>([]);
  const [appointmentStatusData, setAppointmentStatusData] = useState<number[]>([0, 0, 0]); // [pending, completed, cancelled]
  const [departmentData, setDepartmentData] = useState<number[]>([]);
  const [patientAgeData, setPatientAgeData] = useState<number[]>([0, 0, 0, 0, 0]); // Age groups

  // Invoice related states
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState<number[]>(Array(12).fill(0));
  const [monthlyPaid, setMonthlyPaid] = useState<number[]>(Array(12).fill(0));
  const [monthlyRemaining, setMonthlyRemaining] = useState<number[]>(Array(12).fill(0));
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalRemaining, setTotalRemaining] = useState(0);
  const [paymentStatusData, setPaymentStatusData] = useState<number[]>([0, 0]); // [paid, remaining]

  useEffect(() => {
    // Fetch Doctors
    allDoctor()
      .then((data) => {
        setDoctorCount(data?.doctors?.length || 0);

        // Extract department data
        const departments: Record<string, number> = {};
        data?.doctors?.forEach((doctor: any) => {
          const dept = doctor.specialization || "General";
          departments[dept] = (departments[dept] || 0) + 1;
        });

        setDepartmentData(Object.values(departments));
      })
      .catch((error) => console.error("Error fetching doctors:", error));

    // Fetch patients
    allPatient()
      .then((data) => {
        setPatientCount(data?.patients?.length || 0);

        const monthlyRegistrations = Array(12).fill(0);

        // Age distribution data
        const ageGroups = [0, 0, 0, 0, 0]; // <18, 18-30, 31-45, 46-60, >60

        data.patients.forEach((patient: any) => {
          // Monthly patient registration
          const date = new Date(patient.createdAt);
          const month = date.getMonth();
          monthlyRegistrations[month]++;

          // Age groups calculation
          if (patient.age) {
            if (patient.age < 18) ageGroups[0]++;
            else if (patient.age <= 30) ageGroups[1]++;
            else if (patient.age <= 45) ageGroups[2]++;
            else if (patient.age <= 60) ageGroups[3]++;
            else ageGroups[4]++;
          }
        });

        setPatientData(monthlyRegistrations);
        setPatientAgeData(ageGroups);
      })
      .catch((error) => console.error("Error fetching patients:", error));

    // Fetch appointments
    allAppointment()
      .then((data) => {
        const monthlyData = new Array(12).fill(0);
        const statusData = [0, 0, 0, 0]; // [pending, completed, cancelled]

        data?.appointments?.forEach((appointment: any) => {
          // Monthly appointment count
          const month = new Date(appointment.date).getMonth();
          monthlyData[month]++;

          // Status distribution
          if (appointment.status === "Pending") statusData[0]++;
          else if (appointment.status === "Completed") statusData[1]++;
          else if (appointment.status === "Cancel") statusData[2]++;
          else if (appointment.status === "Reschedule") statusData[3]++;
        });

        setAppointmentData(monthlyData);
        setAppointmentStatusData(statusData);
      })
      .catch((error) => console.error("Error fetching appointments:", error));

    // Fetch receptionists
//pro
     allReceptionist()
      .then((data) => {
        setReceptionistCount(data?.receptionists?.length || 0);
      })
      .catch((error) => console.error("Error fetching receptionists:", error));
//plus
    allPharmacists()
      .then((data) => {
        setPharmacistCount(data?.pharmacists?.length || 0);
      })
      .catch((error) => console.error("Error fetching receptionists:", error));
    allLaboratorians()
      .then((data) => {
        setLaboratorianCount(data?.laboratorians?.length || 0);
      })
      .catch((error) => console.error("Error fetching receptionists:", error));
//end 

    // Fetch invoices
    getAllInvoices()
      .then((data) => {
        const invoicesData = data?.invoices || [];
        setInvoices(invoicesData);

        // Process invoice data for financial reports
        processInvoiceData(invoicesData);
      })
      .catch((error) => console.error("Error fetching invoices:", error));

  }, []);

  // Process invoice data for reports
  const processInvoiceData = (invoices: Invoice[]) => {
    const monthlyIncomeData = Array(12).fill(0);
    const monthlyPaidData = Array(12).fill(0);
    const monthlyRemainingData = Array(12).fill(0);
    let totalIncomeSum = 0;
    let totalPaidSum = 0;
    let totalRemainingSum = 0;

    invoices.forEach(invoice => {
      // Only process invoices with valid dates
      if (invoice.createdAt) {
        const date = new Date(invoice.createdAt);
        const month = date.getMonth();

        // Accumulate monthly data
        monthlyIncomeData[month] += invoice.total || 0;
        monthlyPaidData[month] += invoice.paid || 0;
        monthlyRemainingData[month] += invoice.remaining || 0;

        // Accumulate totals
        totalIncomeSum += invoice.total || 0;
        totalPaidSum += invoice.paid || 0;
        totalRemainingSum += invoice.remaining || 0;
      }
    });

    // Update state with processed data
    setMonthlyIncome(monthlyIncomeData);
    setMonthlyPaid(monthlyPaidData);
    setMonthlyRemaining(monthlyRemainingData);
    setTotalIncome(totalIncomeSum);
    setTotalPaid(totalPaidSum);
    setTotalRemaining(totalRemainingSum);
    setPaymentStatusData([totalPaidSum, totalRemainingSum]);
  };

  // Line Chart Data
  const lineData = {
    labels: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    datasets: [
      {
        label: "Patients Registered",
        data: patientData,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
    ],
  };

  // Bar Chart Data
  const barData = {
    labels: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    datasets: [
      {
        label: "Appointments Booked",
        data: appointmentData,
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
      },
    ],
  };

  // Stacked Bar Chart - Appointment Comparison
  const stackedBarData = {
    labels: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    datasets: [
      {
        label: "Appointments",
        data: appointmentData,
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
      },
      {
        label: "Patient Registrations",
        data: patientData,
        backgroundColor: "rgba(54,162,235,0.2)",
        borderColor: "rgba(54,162,235,1)",
        borderWidth: 1,
      },
    ],
  };

  // Pie Chart Data
  const pieData = {
    labels: ["Doctors", "Patients", 
//pro
      "Receptionists",
//plus
      "Pharmacists","Laboratorians"
//end

    ],
    datasets: [
      {
        data: [doctorCount, patientCount, 
//pro
          receptionistCount,
//plus
          pharmacistCount,laboratorianCount
//end

        ],
        backgroundColor: ["#E63946", "#457B9D", 
//pro
          "#A7C957",
//plus
           "#F4A261", "#9B5DE5"
//end

          ],
      },
    ],
  };

  // Doughnut Chart - Appointment Status
  const doughnutData = {
    labels: ["Pending", "Completed", "Cancel", "Reschedule"],
    datasets: [
      {
        data: appointmentStatusData,
        backgroundColor: ["#FFD700", "#32CD32", "#DC143C", "#4169E1"],
        hoverBackgroundColor: ["#FFC107", "#28a745", "#c82333", "#3652A1"],
      },
    ],
  };

  // Radar Chart - Department Distribution
  const radarData = {
    labels: ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General"],
    datasets: [
      {
        label: "Doctor Count",
        data: departmentData.length ? departmentData : [3, 2, 4, 3, 5], // Fallback data if empty
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "rgba(75,192,192,1)",
      },
    ],
  };

  // Polar Area Chart - Patient Age Distribution
  const polarAreaData = {
    labels: ["<18 years", "18-30 years", "31-45 years", "46-60 years", ">60 years"],
    datasets: [
      {
        data: patientAgeData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
      },
    ],
  };

  // Line Chart - Monthly Invoice Data
  const financialData = {
    labels: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    datasets: [
      {
        label: "Total Billed",
        data: monthlyIncome,
        borderColor: "rgba(46, 204, 113, 1)",
        backgroundColor: "rgba(46, 204, 113, 0.1)",
        fill: true,
        yAxisID: 'y',
      },
      {
        label: "Payment Received",
        data: monthlyPaid,
        borderColor: "rgba(52, 152, 219, 1)",
        backgroundColor: "rgba(52, 152, 219, 0.1)",
        fill: true,
        yAxisID: 'y',
      },
      {
        label: "Payment Pending",
        data: monthlyRemaining,
        borderColor: "rgba(231, 76, 60, 1)",
        backgroundColor: "rgba(231, 76, 60, 0.1)",
        fill: true,
        yAxisID: 'y',
      }
    ],
  };

  // Bar Chart - Billed vs Paid vs Remaining
  const paymentBreakdownData = {
    labels: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    datasets: [
      {
        label: "Billed Amount",
        data: monthlyIncome,
        backgroundColor: "rgba(46, 204, 113, 0.6)",
        borderColor: "rgba(46, 204, 113, 1)",
        borderWidth: 1,
      },
      {
        label: "Payment Received",
        data: monthlyPaid,
        backgroundColor: "rgba(52, 152, 219, 0.6)",
        borderColor: "rgba(52, 152, 219, 1)",
        borderWidth: 1,
      },
      {
        label: "Payment Pending",
        data: monthlyRemaining,
        backgroundColor: "rgba(231, 76, 60, 0.6)",
        borderColor: "rgba(231, 76, 60, 1)",
        borderWidth: 1,
      }
    ],
  };

  // Doughnut Chart - Payment Status
  const paymentStatusChart = {
    labels: ["Payment Received", "Payment Pending"],
    datasets: [
      {
        data: paymentStatusData,
        backgroundColor: ["#3498db", "#e74c3c"],
        hoverBackgroundColor: ["#2980b9", "#c0392b"],
      },
    ],
  };

  return (
    <motion.div
      className="bg-white/30 backdrop-blur-md p-8 rounded-lg shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Reports Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Summary Cards */}
        <motion.div
          className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 50 }}
        >
          <h3 className="text-gray-500 text-sm">Total Doctors</h3>
          <p className="text-3xl font-bold text-gray-800">{doctorCount}</p>
        </motion.div>

        <motion.div
          className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 50, delay: 0.1 }}
        >
          <h3 className="text-gray-500 text-sm">Total Patients</h3>
          <p className="text-3xl font-bold text-gray-800">{patientCount}</p>
        </motion.div>

        <motion.div
          className="bg-white p-4 rounded-lg shadow border-l-4 border-green-700"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
        >
          <h3 className="text-gray-500 text-sm">Total Billed</h3>
          <p className="text-3xl font-bold text-gray-800">{formatCurrency(totalIncome)}</p>
        </motion.div>

        <motion.div
          className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 50, delay: 0.3 }}
        >
          <h3 className="text-gray-500 text-sm">Payment Pending</h3>
          <p className="text-3xl font-bold text-gray-800">{formatCurrency(totalRemaining)}</p>
        </motion.div>
      </div>

      {/* Financial Reports Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Financial Reports</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Additional Financial Cards */}
          <motion.div
            className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <h3 className="text-gray-500 text-sm">Total Payment Received</h3>
            <p className="text-3xl font-bold text-gray-800">{formatCurrency(totalPaid)}</p>
            <p className="text-sm text-gray-500 mt-2">{((totalPaid / totalIncome) * 100).toFixed(1)}% of total billed</p>
          </motion.div>

          <motion.div
            className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <h3 className="text-gray-500 text-sm">Average Invoice Amount</h3>
            <p className="text-3xl font-bold text-gray-800">
              {formatCurrency(invoices.length > 0 ? totalIncome / invoices.length : 0)}
            </p>
            <p className="text-sm text-gray-500 mt-2">Based on {invoices.length} invoices</p>
          </motion.div>

          <motion.div
            className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <h3 className="text-gray-500 text-sm">Collection Efficiency</h3>
            <p className="text-3xl font-bold text-gray-800">
              {totalIncome > 0 ? ((totalPaid / totalIncome) * 100).toFixed(1) : 0}%
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {formatCurrency(totalRemaining)} pending
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Line Chart - Monthly Income */}
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Invoice Trends (Monthly)
            </h3>
            <Line
              data={financialData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Amount (₹)'
                    }
                  }
                }
              }}
            />
          </motion.div>

          {/* Bar Chart - Income Breakdown */}
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Payment Status (Monthly)
            </h3>
            <Bar
              data={paymentBreakdownData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Amount (₹)'
                    }
                  }
                }
              }}
            />
          </motion.div>
        </div>

        {/* Payment Status Doughnut Chart */}
        {/* <div className="mt-6">
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Overall Payment Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Doughnut 
                  data={paymentStatusChart} 
                  options={{ 
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }} 
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600">Payment Received</h4>
                  <p className="text-2xl font-semibold text-blue-600">{formatCurrency(totalPaid)}</p>
                  <p className="text-sm text-gray-500">
                    {((totalPaid / totalIncome) * 100).toFixed(1)}% of total billed
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600">Payment Pending</h4>
                  <p className="text-2xl font-semibold text-red-600">{formatCurrency(totalRemaining)}</p>
                  <p className="text-sm text-gray-500">
                    {((totalRemaining / totalIncome) * 100).toFixed(1)}% of total billed
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div> */}

        <div className="mt-6 h-auto">
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Overall Payment Status
            </h3>
            <div className="flex justify-center items-center">
              <div>
                <Doughnut
                  height={400}
                  width={400}
                  data={paymentStatusChart}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600">Payment Received</h4>
                  <p className="text-2xl font-semibold text-blue-600">{formatCurrency(totalPaid)}</p>
                  <p className="text-sm text-gray-500">
                    {((totalPaid / totalIncome) * 100).toFixed(1)}% of total billed
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600">Payment Pending</h4>
                  <p className="text-2xl font-semibold text-red-600">{formatCurrency(totalRemaining)}</p>
                  <p className="text-sm text-gray-500">
                    {((totalRemaining / totalIncome) * 100).toFixed(1)}% of total billed
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Patient and Appointment Statistics */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Patient & Appointment Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Line Chart */}
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Patients Registered (Monthly)
            </h3>
            <Line data={lineData} options={{ responsive: true }} />
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Appointments Booked (Monthly)
            </h3>
            <Bar data={barData} options={{ responsive: true }} />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Pie Chart */}
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              User Distribution
            </h3>
            <Pie data={pieData} options={{ responsive: true }} />
          </motion.div>

          {/* Doughnut Chart */}
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Appointment Status
            </h3>
            <Doughnut data={doughnutData} options={{ responsive: true }} />
          </motion.div>

          {/* Polar Area Chart */}
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Patient Age Distribution
            </h3>
            <PolarArea data={polarAreaData} options={{ responsive: true }} />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stacked Bar Chart */}
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Appointments vs Registrations
            </h3>
            <Bar
              data={stackedBarData}
              options={{
                responsive: true,
                scales: {
                  x: { stacked: true },
                  y: { stacked: false }
                }
              }}
            />
          </motion.div>

          {/* Radar Chart */}
          <motion.div
            className="bg-white p-4 rounded-lg shadow"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Department Distribution
            </h3>
            <Radar data={radarData} options={{ responsive: true }} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Report;