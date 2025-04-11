import React, { useState } from 'react';
import BedCreate from '../BedCreate';
import CreateDoctor from '../CreateDoctor';
import LabratorianCreate from '../LaboratorianCreate';
import PharmacistCreate from '../PharmacistCreate';
import ReceptionistCreate from '../ReceptionistCreate';

// Type for role options
type Role = 'doctor' | 'receptionist' | 'laboratorian' | 'pharmacist' | 'bed';
const CreateWrapper: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    // Role options data
    const roles: { id: Role; label: string; icon: string; color: string }[] = [
        { id: 'doctor', label: 'Doctor', icon: '👨‍⚕️', color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
        { id: 'receptionist', label: 'Receptionist', icon: '👩‍💼', color: 'bg-green-100 hover:bg-green-200 border-green-300' },
        { id: 'laboratorian', label: 'Laboratorian', icon: '🔬', color: 'bg-purple-100 hover:bg-purple-200 border-purple-300' },
        { id: 'pharmacist', label: 'Pharmacist', icon: '💊', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
        { id: 'bed', label: 'Beds', icon: '🛏️', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' }
    ];

    // Render the appropriate component based on selected role
    const renderRoleComponent = () => {
        switch (selectedRole) {
            case 'doctor':
                return <CreateDoctor />;
            case 'receptionist':
                return <ReceptionistCreate />;
            case 'bed':
                return <BedCreate />;
            case 'laboratorian':
                return <LabratorianCreate />;
            case 'pharmacist':
                return <PharmacistCreate />;
            default:
                return (
                    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">Please select a role to view the dashboard</p>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-full mx-auto p-6">
            {/* Role selection section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Select any option which want to create</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => setSelectedRole(role.id)}
                            className={`p-2 rounded-lg border-2 transition-all duration-200 flex flex-col items-center ${role.color} ${selectedRole === role.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                                }`}
                        >
                            <span className="text-3xl mb-2">{role.icon}</span>
                            <span className="font-medium text-gray-800">{role.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Component display section */}
            <div className="transition-all duration-300">
                {renderRoleComponent()}
            </div>
        </div>
    );
};

export default CreateWrapper;