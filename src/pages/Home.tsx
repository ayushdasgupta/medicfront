import React, { useState } from "react";
import Modal from "../components/Modal";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom"; 

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate=useNavigate()

  return (
   <>
   <Menu onClick={()=>setIsModalOpen(true)} className="hidden md:block absolute top-2 right-2"/>
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col items-center justify-center">
      {/* Hero Section */}
      
      <header className="w-full text-center py-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900">
          Welcome to <span className="text-primary">MedicaPro</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 mt-4">
          Your one-stop solution for hospital management.
        </p>
        <button onClick={() =>navigate('/patient/login') } className="mt-8 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
          Get Started
        </button>
      </header>

      {/* Features Section */}
      <main className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 lg:px-16 py-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="glass-card p-6 rounded-lg shadow-lg backdrop-blur-md"
          >
            <div className="text-primary text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {feature.title}
            </h3>
            <p className="text-gray-600 mt-2">{feature.description}</p>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 backdrop-blur-lg text-center">
        <p className="text-gray-800">
          &copy; {new Date().getFullYear()} MedicaPro. All rights reserved.
        </p>
      </footer>
      {/* Modal */}
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </div>
   </>
  );
};

export default Home;


const features = [
  {
    icon: "📅",
    title: "Book Appointments",
    description: "Easily book appointments with our specialists.",
  },
  {
    icon: "👨‍⚕️",
    title: "Doctor Directory",
    description: "Access detailed profiles of all our expert doctors.",
  },
  {
    icon: "📂",
    title: "Medical Records",
    description: "Securely manage and access your medical history.",
  },
];
