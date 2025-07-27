import React, { useState } from "react";
import Modal from "../components/Modal";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { APPNAME } from "../utils/constant";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../utils/LanguageContext";
const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
const { language, setLanguage } = useLanguage();
  const features = [
    {
      icon: "📅",
      title: t("book_appointments"),
      description: t("book_appointments_desc"),
    },
    {
      icon: "👨‍⚕️",
      title: t("doctor_directory"),
      description: t("doctor_directory_desc"),
    },
    {
      icon: "📂",
      title: t("medical_records"),
      description: t("medical_records_desc"),
    },
  ];

  return (
    <>
      <Menu onClick={() => setIsModalOpen(true)} className="hidden md:block absolute top-2 right-2" />
        <select
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
    className="px-4 py-2 border rounded"
  >
    <option value="en">English</option>
    <option value="bn">বাংলা</option>
    <option value="hi">हिन्दी</option>
  </select>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col items-center justify-center">
        <header className="w-full text-center py-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900">
            {t("welcome", { appname: APPNAME })}
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 mt-4">
            {t("subtitle")}
          </p>
          <button
            onClick={() => navigate("/patient/login")}
            className="mt-8 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            {t("get_started")}
          </button>
        </header>

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

        <footer className="w-full py-6 backdrop-blur-lg text-center">
          <p className="text-gray-800">
            &copy; {new Date().getFullYear()} {APPNAME}. {t("footer")}
          </p>
        </footer>

        {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
      </div>
    </>
  );
};

export default Home;
