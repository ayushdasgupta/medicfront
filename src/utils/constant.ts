export const APPNAME: string = "Medireon";

export const predefinedRemarks = [
  "Appointment successfully completed",
  "Patient condition stable",
  "Prescription provided",
  "Follow-up not needed",
];
export const specializations = [
  "Cardiologist", "Dermatologist", "Neurologist", "Orthopedic",
  "Pediatrician", "Psychiatrist", "Radiologist", "General Physician", "ENT Specialist",
];

export const medicineCategories = [
  "Other",
  "Antibiotic",
  "Painkiller",
  "Supplement",
  "Antiviral",
  "Antifungal",
  "Vaccine",
  "Antidepressant",
  "Anti-inflammatory",
  "Antihistamine",
  "Cardiovascular",
  "Diuretic",
  "Hormone Therapy",
  "Insulin",
  "Sedative",
  "Stimulant",
  "Antipsychotic",
  "Antacid",
  "Laxative",
  "Cough Suppressant"
];

export const dateFormater = (date: Date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Kolkata"
  })
}

export const timeFormater = (date: Date) => {
  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).split(",")[1]
}