// API service for OpenMRS integration
import axios, { AxiosInstance } from 'axios';
import { User, Patient, Appointment, Consultation, DashboardStats } from '../types';

// This is a service for interacting with the OpenMRS REST API
// It maps between Umzima data models and OpenMRS data models

class OpenMRSAPI {
  private api: AxiosInstance;
  private user: User | null = null;
  private mockMode: boolean = true; // Set to true for development without OpenMRS server

  constructor() {
    // This would be set to the actual OpenMRS REST API endpoint
    const baseURL = import.meta.env.VITE_OPENMRS_API_URL || 'https://demo.openmrs.org/openmrs/ws/rest/v1';
    
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      // Timeout after 10 seconds
      timeout: 10000,
      // Allow credentials (cookies) to be sent
      withCredentials: true
    });

    // Add request interceptor for Basic Auth
    this.api.interceptors.request.use(
      (config) => {
        // OpenMRS uses Basic Auth for the session endpoint
        const username = localStorage.getItem('umzima_username');
        const password = localStorage.getItem('umzima_password');
        
        if (username && password) {
          // Create Basic Auth header
          const auth = btoa(`${username}:${password}`);
          config.headers.Authorization = `Basic ${auth}`;
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );
  } // Properly close the constructor here

  // Authentication methods
  async login(username: string, password: string): Promise<User> {
    try {
      if (this.mockMode) {
        // Mock authentication for development without OpenMRS server
        console.log('Mock login attempt with:', username);
        
        // Store credentials for future API calls
        localStorage.setItem('umzima_username', username);
        localStorage.setItem('umzima_password', password);
        
        // Create a mock user
        const user: User = {
          id: 'mock-user-id',
          name: username === 'admin' ? 'Administrator' : 'Test User',
          email: `${username}@example.com`,
          role: username === 'admin' ? 'admin' : username === 'doctor' ? 'doctor' : 'nurse',
          avatar: '/assets/default-avatar.png',
        };
        
        // Store user data
        localStorage.setItem('umzima_user', JSON.stringify(user));
        
        this.user = user;
        return user;
      } else {
        // Real OpenMRS authentication
        console.log('Login attempt with:', username);
        
        // Store credentials for future API calls
        localStorage.setItem('umzima_username', username);
        localStorage.setItem('umzima_password', password);
        
        // OpenMRS REST API uses Basic Auth for authentication
        const response = await this.api.get('/session');
        
        // Extract user data from the response
        const userData = response.data;
        
        if (!userData.authenticated) {
          throw new Error('Authentication failed');
        }
        
        // OpenMRS session would return user details that we'd map to our User type
        const user: User = {
          id: userData.user.uuid,
          name: `${userData.user.display || 'OpenMRS User'}`,
          email: username, // OpenMRS might not have email directly
          role: this.mapOpenMRSRoleToUmzima(userData.user.roles || []),
          avatar: '/assets/default-avatar.png',
        };
        
        // Store user data
        localStorage.setItem('umzima_user', JSON.stringify(user));
        
        this.user = user;
        return user;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Authentication failed. Please check your credentials.');
    }
  }

  logout(): void {
    // Clear local storage
    localStorage.removeItem('umzima_username');
    localStorage.removeItem('umzima_password');
    localStorage.removeItem('umzima_user');
    this.user = null;
    
    if (!this.mockMode) {
      // Call the OpenMRS logout endpoint
      try {
        this.api.delete('/session');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  }

  getCurrentUser(): User | null {
    if (this.user) return this.user;
    
    const userStr = localStorage.getItem('umzima_user');
    if (userStr) {
      try {
        this.user = JSON.parse(userStr);
        return this.user;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // Patient methods
  async getPatients(searchTerm?: string): Promise<Patient[]> {
    try {
      if (this.mockMode) {
        // Return mock patient data
        return this.getMockPatients(searchTerm);
      }
      
      // OpenMRS endpoint would be something like /patient with query params
      const response = await this.api.get('/patient', {
        params: {
          q: searchTerm,
          v: 'full',
        },
      });
      
      // Map OpenMRS patients to our Patient type
      return response.data.results.map(this.mapOpenMRSPatientToUmzima);
    } catch (error) {
      console.error('Error fetching patients:', error);
      if (this.mockMode) {
        return this.getMockPatients(searchTerm);
      }
      throw new Error('Failed to fetch patients');
    }
  }
  
  // Helper method to generate mock patient data
  private getMockPatients(searchTerm?: string): Patient[] {
    const mockPatients: Patient[] = [
      {
        id: 'patient-001',
        name: 'John Doe',
        gender: 'male',
        dateOfBirth: '1985-05-15',
        contactNumber: '+1234567890',
        address: '123 Main St, Anytown',
        registrationDate: '2023-01-15',
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          contactNumber: '+1987654321'
        },
        medicalHistory: {
          allergies: ['Penicillin'],
          chronicConditions: ['Hypertension'],
          medications: ['Lisinopril']
        }
      },
      {
        id: 'patient-002',
        name: 'Mary Smith',
        gender: 'female',
        dateOfBirth: '1990-08-22',
        contactNumber: '+2345678901',
        address: '456 Oak Ave, Somewhere',
        registrationDate: '2023-02-20',
        medicalHistory: {
          allergies: [],
          chronicConditions: ['Diabetes'],
          medications: ['Metformin']
        }
      },
      {
        id: 'patient-003',
        name: 'Robert Johnson',
        gender: 'male',
        dateOfBirth: '1975-12-10',
        contactNumber: '+3456789012',
        address: '789 Pine St, Nowhere',
        registrationDate: '2023-03-05'
      }
    ];
    
    if (!searchTerm) {
      return mockPatients;
    }
    
    const term = searchTerm.toLowerCase();
    return mockPatients.filter(patient => 
      patient.name.toLowerCase().includes(term) || 
      patient.contactNumber.includes(term)
    );
  }

  async getPatientById(id: string): Promise<Patient> {
    try {
      const response = await this.api.get(`/patient/${id}?v=full`);
      return this.mapOpenMRSPatientToUmzima(response.data);
    } catch (error) {
      console.error(`Error fetching patient ${id}:`, error);
      throw new Error('Failed to fetch patient details');
    }
  }

  async registerPatient(patient: Omit<Patient, 'id' | 'registrationDate'>): Promise<Patient> {
    try {
      // This would map our patient model to OpenMRS patient representation
      const openMRSPatient = this.mapUmzimaPatientToOpenMRS(patient);
      
      const response = await this.api.post('/patient', openMRSPatient);
      
      return this.mapOpenMRSPatientToUmzima(response.data);
    } catch (error) {
      console.error('Error registering patient:', error);
      throw new Error('Failed to register patient');
    }
  }

  // Appointment methods
  async getAppointments(params?: { date?: string, doctorId?: string, patientId?: string }): Promise<Appointment[]> {
    try {
      if (this.mockMode) {
        // Return mock appointment data
        return this.getMockAppointments(params);
      }
      
      // OpenMRS would have an appointment module with endpoints
      const response = await this.api.get('/appointmentscheduling/appointment', {
        params
      });
      
      return response.data.results.map(this.mapOpenMRSAppointmentToUmzima);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      if (this.mockMode) {
        return this.getMockAppointments(params);
      }
      throw new Error('Failed to fetch appointments');
    }
  }
  
  // Helper method to generate mock appointment data
  private getMockAppointments(params?: { date?: string, doctorId?: string, patientId?: string }): Appointment[] {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const mockAppointments: Appointment[] = [
      {
        id: 'appt-001',
        patientId: 'patient-001',
        patientName: 'John Doe',
        doctorId: 'doctor-001',
        doctorName: 'Dr. Sarah Johnson',
        date: today,
        time: '09:00',
        duration: 30,
        status: 'scheduled',
        type: 'checkup',
        reason: 'Annual physical examination'
      },
      {
        id: 'appt-002',
        patientId: 'patient-002',
        patientName: 'Mary Smith',
        doctorId: 'doctor-001',
        doctorName: 'Dr. Sarah Johnson',
        date: today,
        time: '10:00',
        duration: 30,
        status: 'scheduled',
        type: 'follow-up',
        reason: 'Diabetes follow-up'
      },
      {
        id: 'appt-003',
        patientId: 'patient-003',
        patientName: 'Robert Johnson',
        doctorId: 'doctor-002',
        doctorName: 'Dr. Michael Brown',
        date: today,
        time: '14:00',
        duration: 45,
        status: 'scheduled',
        type: 'new-consultation',
        reason: 'Chest pain'
      },
      {
        id: 'appt-004',
        patientId: 'patient-001',
        patientName: 'John Doe',
        doctorId: 'doctor-002',
        doctorName: 'Dr. Michael Brown',
        date: tomorrowStr,
        time: '11:00',
        duration: 30,
        status: 'scheduled',
        type: 'follow-up',
        reason: 'Blood pressure check'
      }
    ];
    
    // Filter by params if provided
    return mockAppointments.filter(appointment => {
      if (params?.date && appointment.date !== params.date) {
        return false;
      }
      if (params?.doctorId && appointment.doctorId !== params.doctorId) {
        return false;
      }
      if (params?.patientId && appointment.patientId !== params.patientId) {
        return false;
      }
      return true;
    });
  }

  async scheduleAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
    try {
      const openMRSAppointment = this.mapUmzimaAppointmentToOpenMRS(appointment);
      
      const response = await this.api.post('/appointmentscheduling/appointment', openMRSAppointment);
      
      return this.mapOpenMRSAppointmentToUmzima(response.data);
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      throw new Error('Failed to schedule appointment');
    }
  }

  // Consultation methods
  async saveConsultation(consultation: Omit<Consultation, 'id'>): Promise<Consultation> {
    try {
      // In OpenMRS, this would create an encounter with observations
      const openMRSEncounter = this.mapUmzimaConsultationToOpenMRS(consultation);
      
      const response = await this.api.post('/encounter', openMRSEncounter);
      
      return this.mapOpenMRSEncounterToUmzima(response.data);
    } catch (error) {
      console.error('Error saving consultation:', error);
      throw new Error('Failed to save consultation notes');
    }
  }

  async getConsultations(patientId: string): Promise<Consultation[]> {
    try {
      const response = await this.api.get('/encounter', {
        params: {
          patient: patientId,
          encounterType: 'Consultation', // Assuming we've configured this encounter type
          v: 'full'
        }
      });
      
      return response.data.results.map(this.mapOpenMRSEncounterToUmzima);
    } catch (error) {
      console.error(`Error fetching consultations for patient ${patientId}:`, error);
      throw new Error('Failed to fetch consultation records');
    }
  }

  // Dashboard methods
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      
      // Get appointments for today
      const appointmentsResponse = await this.getAppointments({ date: today });
      
      // Generate dashboard stats
      return {
        appointmentsToday: appointmentsResponse.length,
        appointmentsThisWeek: this.mockMode ? 12 : appointmentsResponse.length * 5, // Simulated weekly data
        newPatientsToday: this.mockMode ? 3 : Math.floor(Math.random() * 5),
        newPatientsThisWeek: this.mockMode ? 15 : Math.floor(Math.random() * 20),
        completedConsultationsToday: this.mockMode ? 2 : Math.floor(appointmentsResponse.length * 0.7),
        upcomingAppointments: appointmentsResponse.slice(0, 5),
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      
      if (this.mockMode) {
        // Return mock data if there's an error
        return this.getMockDashboardStats();
      }
      
      throw new Error('Failed to load dashboard statistics');
    }
  }
  
  // Helper method to generate mock dashboard stats
  private getMockDashboardStats(): DashboardStats {
    return {
      appointmentsToday: 3,
      appointmentsThisWeek: 12,
      newPatientsToday: 2,
      newPatientsThisWeek: 8,
      completedConsultationsToday: 1,
      upcomingAppointments: this.getMockAppointments().slice(0, 3),
    };
  }

  // Helper methods for mapping between Umzima and OpenMRS data models
  private mapOpenMRSRoleToUmzima(roles: any[]): User['role'] {
    // Simplified role mapping - would need to be customized based on actual OpenMRS roles
    if (roles.some(r => r.name.includes('Admin'))) return 'admin';
    if (roles.some(r => r.name.includes('Doctor') || r.name.includes('Physician'))) return 'doctor';
    return 'nurse'; // Default role
  }

  private mapOpenMRSPatientToUmzima(patient: any): Patient {
    // This is a simplified mapping - would need customization for actual OpenMRS API
    return {
      id: patient.uuid,
      name: patient.person?.display || `${patient.person?.names[0]?.givenName} ${patient.person?.names[0]?.familyName}`,
      gender: patient.person?.gender.toLowerCase(),
      dateOfBirth: patient.person?.birthdate,
      contactNumber: patient.person?.attributes?.find((a: any) => a.attributeType.display === 'Phone Number')?.value || '',
      address: patient.person?.addresses[0] ? 
        `${patient.person.addresses[0].address1}, ${patient.person.addresses[0].cityVillage}` : '',
      registrationDate: patient.auditInfo?.dateCreated || new Date().toISOString(),
      // Other fields would be mapped from the right OpenMRS properties
    };
  }

  private mapUmzimaPatientToOpenMRS(patient: Omit<Patient, 'id' | 'registrationDate'>): any {
    // This would create the proper format for OpenMRS patient creation
    // Simplified example:
    return {
      person: {
        names: [{
          givenName: patient.name.split(' ')[0],
          familyName: patient.name.split(' ').slice(1).join(' '),
        }],
        gender: patient.gender,
        birthdate: patient.dateOfBirth,
        addresses: [{
          address1: patient.address.split(',')[0],
          cityVillage: patient.address.split(',')[1]?.trim() || '',
        }],
        attributes: [{
          attributeType: '14d4f066-15f5-102d-96e4-000c29c2a5d7', // Phone number attribute type - would need real UUID
          value: patient.contactNumber,
        }],
      },
      identifiers: [{
        identifierType: '1a339fe9-38bc-4ab3-b180-320988c0b968', // Patient Identifier Type - would need real UUID
        location: '8d6c993e-c2cc-11de-8d13-0010c6dffd0f', // Location - would need real UUID
        preferred: true,
        identifier: `UMZIMA-${new Date().getTime()}`, // Generating a temp identifier
      }],
    };
  }

  private mapOpenMRSAppointmentToUmzima(appointment: any): Appointment {
    // Simplified mapping
    return {
      id: appointment.uuid,
      patientId: appointment.patient.uuid,
      patientName: appointment.patient.display,
      doctorId: appointment.provider.uuid,
      doctorName: appointment.provider.display,
      date: appointment.timeSlot.startDate.split('T')[0],
      time: appointment.timeSlot.startDate.split('T')[1].substring(0, 5),
      duration: 30, // Default duration
      status: this.mapOpenMRSStatusToUmzima(appointment.status),
      type: this.mapOpenMRSAppointmentTypeToUmzima(appointment.appointmentType.display),
      reason: appointment.reason || '',
    };
  }

  private mapUmzimaAppointmentToOpenMRS(appointment: Omit<Appointment, 'id'>): any {
    // Simplified conversion
    return {
      patient: appointment.patientId,
      provider: appointment.doctorId,
      appointmentType: this.getOpenMRSAppointmentTypeUuid(appointment.type),
      status: this.mapUmzimaStatusToOpenMRS(appointment.status),
      reason: appointment.reason,
      timeSlot: {
        startDate: `${appointment.date}T${appointment.time}:00.000+0000`,
        endDate: this.calculateEndTime(appointment.date, appointment.time, appointment.duration),
      },
    };
  }

  private mapOpenMRSEncounterToUmzima(encounter: any): Consultation {
    // This would extract observations from the encounter and map to our model
    // Simplified example:
    return {
      id: encounter.uuid,
      patientId: encounter.patient.uuid,
      doctorId: encounter.provider.uuid,
      date: encounter.encounterDatetime,
      chiefComplaint: this.getObsValue(encounter.obs, 'CHIEF_COMPLAINT'),
      symptoms: this.getObsValue(encounter.obs, 'SYMPTOMS'),
      diagnosis: this.getObsValue(encounter.obs, 'DIAGNOSIS'),
      treatmentPlan: this.getObsValue(encounter.obs, 'TREATMENT_PLAN'),
      medications: this.getObsValue(encounter.obs, 'MEDICATIONS'),
      followUpNeeded: this.getObsValue(encounter.obs, 'FOLLOW_UP_NEEDED') === 'true',
      notes: this.getObsValue(encounter.obs, 'NOTES'),
    };
  }

  private mapUmzimaConsultationToOpenMRS(consultation: Omit<Consultation, 'id'>): any {
    // This would create an encounter with observations
    // Simplified example:
    return {
      patient: consultation.patientId,
      encounterType: 'Consultation', // Would need the actual UUID
      encounterProviders: [{
        provider: consultation.doctorId,
        encounterRole: 'a0b03050-c99b-11e0-9572-0800200c9a66', // Would need actual encounter role UUID
      }],
      encounterDatetime: consultation.date,
      location: '8d6c993e-c2cc-11de-8d13-0010c6dffd0f', // Would need actual location UUID
      obs: [
        this.createObs('CHIEF_COMPLAINT', consultation.chiefComplaint),
        this.createObs('SYMPTOMS', consultation.symptoms),
        this.createObs('DIAGNOSIS', consultation.diagnosis),
        this.createObs('TREATMENT_PLAN', consultation.treatmentPlan),
        this.createObs('MEDICATIONS', consultation.medications || ''),
        this.createObs('FOLLOW_UP_NEEDED', consultation.followUpNeeded.toString()),
        this.createObs('NOTES', consultation.notes || ''),
      ],
    };
  }

  // Helper methods
  private mapOpenMRSStatusToUmzima(status: string): Appointment['status'] {
    const statusMap: Record<string, Appointment['status']> = {
      'SCHEDULED': 'scheduled',
      'COMPLETED': 'completed',
      'CANCELLED': 'cancelled',
      'MISSED': 'no-show',
    };
    return statusMap[status] || 'scheduled';
  }

  private mapUmzimaStatusToOpenMRS(status: Appointment['status']): string {
    const statusMap: Record<Appointment['status'], string> = {
      'scheduled': 'SCHEDULED',
      'completed': 'COMPLETED',
      'cancelled': 'CANCELLED',
      'no-show': 'MISSED',
    };
    return statusMap[status];
  }

  private mapOpenMRSAppointmentTypeToUmzima(type: string): Appointment['type'] {
    if (type.includes('New') || type.includes('Initial')) return 'new-consultation';
    if (type.includes('Follow')) return 'follow-up';
    if (type.includes('Check')) return 'checkup';
    if (type.includes('Refer')) return 'referral';
    return 'new-consultation';
  }

  private getOpenMRSAppointmentTypeUuid(type: Appointment['type']): string {
    // These would be real UUIDs in a production system
    const typeMap: Record<Appointment['type'], string> = {
      'new-consultation': '7b0f5697-27e3-40c4-8bae-f4049abfb4ed',
      'follow-up': '7b0f5697-27e3-40c4-8bae-f4049abfb4ee',
      'checkup': '7b0f5697-27e3-40c4-8bae-f4049abfb4ef',
      'referral': '7b0f5697-27e3-40c4-8bae-f4049abfb4eg',
    };
    return typeMap[type];
  }

  private calculateEndTime(date: string, startTime: string, durationMinutes: number): string {
    const startDateTime = new Date(`${date}T${startTime}:00.000+0000`);
    const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);
    return endDateTime.toISOString();
  }

  private getObsValue(obs: any[], conceptName: string): string {
    const observation = obs.find(o => o.concept.display === conceptName);
    return observation ? observation.value : '';
  }

  private createObs(conceptName: string, value: string): any {
    // This would need to use the actual concept UUIDs in a real implementation
    const conceptMap: Record<string, string> = {
      'CHIEF_COMPLAINT': '160531AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      'SYMPTOMS': '160531AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      'DIAGNOSIS': '160532AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      'TREATMENT_PLAN': '160533AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      'MEDICATIONS': '160534AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      'FOLLOW_UP_NEEDED': '160535AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      'NOTES': '160536AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    };
    
    return {
      concept: conceptMap[conceptName] || conceptName,
      value: value,
    };
  }

  // For SMS notifications (this would be handled by a custom module in OpenMRS or external service)
  async sendSmsReminder(appointmentId: string): Promise<boolean> {
    try {
      // This would call a custom endpoint or external SMS service API
      await this.api.post('/custom/sms/appointment', { appointmentId });
      return true;
    } catch (error) {
      console.error('Error sending SMS reminder:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
const openMRSAPI = new OpenMRSAPI();
export default openMRSAPI;