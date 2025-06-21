/// <reference types="vite/client" />

interface IDoctor {
  _id: string;
  name: string;
  specialization: string;
  fees: number;
  phone: string;
  email: string;
  avatar: {
    url: string;
  };
  availability: [string];
  availableHours: {
    start: string;
    end: string;
  };
  password?:string,
  appointments: IAppointment[];
  maxAppointmentsPerDay: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IBeds {
  _id: string;
  bednumber: number;
  floornumber: number;
  ward: string;
  category: string;
  perDayCharge: number;
  tax?:number
  status: string;
  patient?: IPatient | null;
  admissionDate?: Date | null;
  dischargeDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  isPaid:?boolean;
}

interface IAppointment {
  _id: string;
  date: Date;
  status: string;
  fees: number;
  time: string;
  doctor: string;
  patient: string;
  doctorId: IDoctor;
  tax?:number
  specialization: string;
  patientId: IPatient
  ispaid: boolean;
  token?: number;
  createdAt: Date;
  updatedAt: Date;
  isPaid:?boolean;
}

interface IPatient {
  _id: string;
  name: string;
  gender: string;
  phone: number;
  email: string,
  bloodgroup: string | null;
  allergies: {
    name: string | null,
    causes: string | null,
  }[],
  medicalRecord: {
    record: string
  }[],
  age: number;
  identification: {
    type: string | null,
    number: string | null,
  };
  insurance: {
    provider: string | null,
    number: string | null,
  };
  appointment: IAppointment[]
  invoice: IInvoice[];
  beds: IBeds[],
  medicine:IMedicine[],
  tests:ITest[];
  reports:IReport[]
  createdAt: Date;
  updatedAt: Date;
}
interface IPharmacist {
  _id:string;
  name:string;
  email:string
  phone:number;
  avatar: {
    url: string;
  };
  password?:string
  createdAt: Date;
  updatedAt: Date;
}
interface ILaboratorian {
  _id:string;
  name:string;
  email:string
  avatar: {
    url: string;
  };
  password?:string
  phone:number;
  createdAt: Date;
  updatedAt: Date;
}

interface IInvoice {
  _id?:string;
  patient:{
    name:string,
    phone:number,
    email:string
  };
  appointments?:IAppointment[];
  beds?:IBeds[];
  medicine?:IMedicine[]
  test?:ITest[]
  total:number;
  paid:number;
  remaining:number
  isClose?:boolean
  type?:'appointment' | 'medicine' | 'test' | 'bed';
  createdAt?: Date;
  updatedAt?: Date;
}

interface ITest {
  name:string;
  quantity:number;
  cost:number;
  tax:number
  isPaid?:boolean
}
interface IReport {
  name: string;       
  url: string;        
  uploadDate: Date;   
  uploadedBy: ILaboratorian; 
}

interface IMedicine{
  _id:string;
  name:string;
  quantity:number;
  newStock?:number;
  perUnitCost:number;
  tax:number;
  category:string;
  createdAt: Date;
  updatedAt: Date;
  isPaid:?boolean
}

interface IReceptionist {
  _id: string;
  name: string;
  email: string;
  phone: number;
  password?:string;
  avatar: {
    url: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface FormProps {
  title: string;
  fields: FormField[];
  buttonText: string;
  onSubmit: (e: React.FormEvent) => void;
}

interface FormField {
  name: string;
  type: "text" | "email" | "password" | "number" | "select";
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: { label: string; value: string }[];
}

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  actionType: "Completed" | "Reschedule" | "Canceled" | "logout" | "Delete";
  onConfirm: () => void;
  onCancel: () => void;
}


interface DoctorCardProps {
  _id: string;
  image: string;
  name: string;
  specialization: string;
  onViewMore: () => void;
}