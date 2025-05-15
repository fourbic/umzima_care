// Type definitions for Umzima v2

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse';
  avatar?: string;
};

export type Patient = {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  contactNumber: string;
  address: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    contactNumber: string;
  };
  medicalHistory?: {
    allergies: string[];
    chronicConditions: string[];
    medications: string[];
  };
  registrationDate: string;
};

export type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type: 'new-consultation' | 'follow-up' | 'checkup' | 'referral';
  reason: string;
};

export type Consultation = {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  date: string;
  vitalSigns?: {
    temperature?: number;
    bloodPressure?: {
      systolic: number;
      diastolic: number;
    };
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
  };
  chiefComplaint: string;
  symptoms: string;
  diagnosis: string;
  treatmentPlan: string;
  medications?: string;
  followUpNeeded: boolean;
  followUpDate?: string;
  notes?: string;
};

export type DashboardStats = {
  appointmentsToday: number;
  appointmentsThisWeek: number;
  newPatientsToday: number;
  newPatientsThisWeek: number;
  completedConsultationsToday: number;
  upcomingAppointments: Appointment[];
};