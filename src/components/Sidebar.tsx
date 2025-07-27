import React, { useState } from "react";
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from "../utils/ThemeContext";
interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: { id: string; label: string }[];
  name?: string;
  logout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, tabs, name, logout }) => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      {/* Large Screen Sidebar */}
      <div className="hidden md:flex z-50 w-64 bg-white/30 backdrop-blur-md rounded-r-xl shadow-lg flex-col ">
        <div className="text-center py-6 font-extrabold text-lg text-gray-800 border-b border-white/40">
          Menu
        </div>
        <div className="flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-6 py-4 transition duration-200  rounded-lg ${activeTab === tab.id ? "bg-white/40" : ""
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Small Screen Sidebar */}
      <div>
        {/* Hamburger Menu */}
        <button
          className="md:hidden fixed top-4 right-2 z-50 bg-blue-500 text-white  p-2 rounded"
          onClick={() => setMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          {isMobileSidebarOpen === false ? (<Menu />) : (<X />)}

        </button>
        <button
          onClick={toggleTheme}
          className="md:hidden fixed top-4 right-14 z-30  p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-black dark:text-white transition"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Mobile Sidebar */}
        {isMobileSidebarOpen && (
          <div className="fixed top-0 right-0 h-fit w-64 bg-white/30 backdrop-blur-md rounded-l-xl shadow-lg flex-col z-40">
            <div className="text-center py-6 font-extrabold text-lg text-gray-800 border-b border-white/40">
              {name}
            </div>
            <div className="flex-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileSidebarOpen(false); // Close sidebar on tab click
                  }}
                  className={`w-full text-left px-6 py-4 transition duration-200 hover:bg-white/20 rounded-lg ${activeTab === tab.id ? "bg-white/40" : ""
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex justify-center">
              <button className="px-4 py-2 mb-4 bg-red-500/80 hover:bg-red-500 text-white font-semibold rounded-lg shadow-md transition" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Overlay to close sidebar */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-white/50 z-30"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
