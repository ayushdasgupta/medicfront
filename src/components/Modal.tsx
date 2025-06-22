import { useNavigate } from "react-router-dom";

interface ModalProps {
    onClose: () => void;
  }
  
  const Modal: React.FC<ModalProps> = ({ onClose }) => {
    const navigate=useNavigate()
    
    const handleRoleClick = (roleName: string) => {
        navigate(`/${roleName.toLowerCase()}/login`)
      };
    return (
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
        onClick={onClose} // Close when clicking on the backdrop
      >
        {/* Modal Content */}
        <div
          className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Choose Your Role
          </h2>
          <div className="grid grid-cols-3 gap-4">
          {roles.map((role, index) => (
            <button
              key={index}
              className="flex flex-col items-center justify-center gap-2 p-2 bg-white text-black font-semibold rounded-lg border border-blue-300 hover:bg-blue-300 transition duration-300"
              onClick={() => handleRoleClick(role.name)}
            >
              <span className="text-2xl">{role.icon}</span>
              <span className="text-md">{role.name}</span>
            </button>
          ))}
          </div>
        </div>
      </div>
    );
  };
export default Modal;
  const roles = [
    { icon: "👨‍⚕️", name: "Doctor" },
//pro
    { icon: "👨‍💻", name: "Receptionist" },
//plus
    { icon: "💊", name: "Pharmacist" },
    { icon: "🥼", name: "Laboratorian" },
//end
    { icon: "🛠️", name: "Admin" },

  ];
  