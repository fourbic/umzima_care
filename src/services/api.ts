// API service for OpenMRS integration
import axios, { AxiosInstance } from 'axios';
import { User, Patient, Appointment, Consultation, DashboardStats } from '../types';

// This is a service for interacting with the OpenMRS REST API
// It maps between Umzima data models and OpenMRS data models

class OpenMRSAPI {
  private api: AxiosInstance;
  private user: User | null = null;

  constructor() {
    // Connect to OpenMRS backend via Vite proxy to avoid CORS in dev
    const baseURL = import.meta.env.VITE_OPENMRS_API_URL || '/openmrs/ws/rest/v1';
    
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
      console.log('OpenMRS login attempt with:', username);

      // Store credentials for future API calls
      localStorage.setItem('umzima_username', username);
      localStorage.setItem('umzima_password', password);

      // Create Basic Auth header
      const authHeader = 'Basic ' + btoa(`${username}:${password}`);

      try {
        // Try GET method with Basic Auth first (simpler approach)
        const response = await this.api.get('/session', {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          }
        });

        const userData = response.data;

        if (!userData.authenticated) {
          throw new Error('Authentication failed - invalid credentials');
        }

        // Create user object from OpenMRS response
        const user: User = {
          id: userData.user?.uuid || `user-${Date.now()}`,
          name: userData.user?.display || username,
          email: `${username}@umzima.local`,
          role: this.mapOpenMRSRoleToUmzima(userData.user?.roles || []),
          avatar: '/assets/default-avatar.png',
        };

        // Store user data
        localStorage.setItem('umzima_user', JSON.stringify(user));

        this.user = user;
        console.log('Login successful for user:', user.name);
        return user;

      } catch (apiError: any) {
        console.error('OpenMRS API authentication failed:', apiError);

        // If GET fails, try POST method as fallback
        try {
          console.log('Trying POST authentication method...');
          const postResponse = await this.api.post('/session', {
            username: username,
            password: password
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (postResponse.data.authenticated) {
            const userData = postResponse.data;
            const user: User = {
              id: userData.user?.uuid || `user-${Date.now()}`,
              name: userData.user?.display || username,
              email: `${username}@umzima.local`,
              role: this.mapOpenMRSRoleToUmzima(userData.user?.roles || []),
              avatar: '/assets/default-avatar.png',
            };

            localStorage.setItem('umzima_user', JSON.stringify(user));
            this.user = user;
            console.log('Login successful for user:', user.name);
            return user;
          }
        } catch (postError) {
          console.error('POST authentication also failed:', postError);
        }

        throw new Error('Authentication failed. Please check your OpenMRS credentials and ensure the server is running.');
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

    // Call the OpenMRS logout endpoint
    try {
      this.api.delete('/session');
    } catch (error) {
      console.error('Logout error:', error);
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
      console.log('Fetching patients from OpenMRS...');
      
      // Strategy 1: Try to get patients through appointments (most reliable)
      try {
        const appointmentResponse = await this.api.get('/appointment/all');
        console.log(`Found ${appointmentResponse.data.length} appointments`);

        // Extract unique patients from appointments
        const patientMap = new Map();
        const appointmentData = Array.isArray(appointmentResponse.data) ? appointmentResponse.data : [appointmentResponse.data];

        for (const appointment of appointmentData) {
          if (appointment.patient && !patientMap.has(appointment.patient.uuid)) {
            patientMap.set(appointment.patient.uuid, appointment.patient);
          }

          // Limit to requested number
          if (patientMap.size >= 50) break;
        }

        console.log(`Extracted ${patientMap.size} unique patients from appointments`);

        // Convert appointment patient data to our format
        const patients = Array.from(patientMap.values()).map(patientData => {
          return this.mapOpenMRSPatientFromAppointment(patientData);
        });

        // Filter by search term if provided
        if (searchTerm) {
          return patients.filter(patient => 
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.contactNumber.includes(searchTerm)
          );
        }

        return patients;
      } catch (appointmentError) {
        console.warn('Could not fetch patients through appointments:', appointmentError);
      }

      // Strategy 2: Try direct patient endpoint with different parameters
      try {
        const params: any = {
          limit: 50
        };

        if (searchTerm) {
          params.q = searchTerm;
        }

        const response = await this.api.get('/patient', { params });
        
        if (response.data.results && response.data.results.length > 0) {
          const patients = Array.isArray(response.data.results) ? response.data.results : [response.data];
          return patients.map(this.mapOpenMRSPatientToUmzima);
        }
      } catch (patientError) {
        console.warn('Direct patient endpoint failed:', patientError);
      }

      // Strategy 3: Try person endpoint (fallback)
      try {
        const response = await this.api.get('/person', { params: { limit: 50 } });
        
        if (response.data.results && response.data.results.length > 0) {
          const persons = Array.isArray(response.data.results) ? response.data.results : [response.data];
          return persons.map(this.mapOpenMRSPersonToUmzima);
        }
      } catch (personError) {
        console.warn('Person endpoint failed:', personError);
      }

      console.warn('All patient fetching strategies failed, returning empty array');
      return [];
    } catch (error) {
      console.error('Error fetching patients from OpenMRS:', error);
      throw new Error('Failed to fetch patients from OpenMRS API. Please check your connection and try again.');
    }
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
      
      // OpenMRS appointment endpoint - use /appointment/all since date filtering doesn't work
      const response = await this.api.get('/appointment/all');

      // Filter appointments based on provided parameters
      let filteredAppointments = response.data;

      if (params?.date) {
        // Filter by appointment date
        const targetDate = new Date(params.date).toISOString().split('T')[0];
        filteredAppointments = filteredAppointments.filter((apt: any) => {
          const aptDate = new Date(apt.startDateTime).toISOString().split('T')[0];
          return aptDate === targetDate;
        });
      }

      if (params?.doctorId) {
        // Filter by provider
        filteredAppointments = filteredAppointments.filter((apt: any) => {
          return apt.providers?.some((provider: any) => provider.uuid === params.doctorId);
        });
      }

      if (params?.patientId) {
        // Filter by patient
        filteredAppointments = filteredAppointments.filter((apt: any) => {
          return apt.patient?.uuid === params.patientId;
        });
      }

      // Handle both single appointment and list responses
      const appointmentList = Array.isArray(filteredAppointments) ? filteredAppointments : [filteredAppointments];
      return appointmentList.map((appointment) => this.mapOpenMRSAppointmentToUmzima(appointment));
    } catch (error) {
      console.error('Error fetching appointments from OpenMRS:', error);
      throw new Error('Failed to fetch appointments from OpenMRS API. Please check your connection and try again.');
    }
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
      
      return response.data.results.map((encounter: any) => this.mapOpenMRSEncounterToUmzima(encounter));
    } catch (error) {
      console.error(`Error fetching consultations for patient ${patientId}:`, error);
      throw new Error('Failed to fetch consultation records');
    }
  }

  // Dashboard methods
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      console.log('Fetching dashboard stats from OpenMRS...');
      
      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      
      // Get all appointments from OpenMRS
      const allAppointments = await this.getAppointments();
      console.log(`Total appointments found: ${allAppointments.length}`);
      
      // Get all patients
      const allPatients = await this.getPatients();
      console.log(`Total patients found: ${allPatients.length}`);
      
      // Filter appointments for today
      const appointmentsToday = allAppointments.filter(apt => {
        const aptDate = new Date(apt.date).toISOString().split('T')[0];
        return aptDate === today;
      });
      
      // Calculate stats from real OpenMRS data
      const completedToday = appointmentsToday.filter(apt => apt.status === 'completed').length;
      const newPatientsToday = allPatients.filter(p => {
        const regDate = new Date(p.registrationDate).toISOString().split('T')[0];
        return regDate === today;
      }).length;
      
      // Calculate weekly stats (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];
      
      const appointmentsThisWeek = allAppointments.filter(apt => {
        const aptDate = new Date(apt.date).toISOString().split('T')[0];
        return aptDate >= weekAgoStr && aptDate <= today;
      }).length;
      
      const newPatientsThisWeek = allPatients.filter(p => {
        const regDate = new Date(p.registrationDate).toISOString().split('T')[0];
        return regDate >= weekAgoStr && regDate <= today;
      }).length;
      
      // Get upcoming appointments (scheduled for future)
      const upcomingAppointments = allAppointments
        .filter(apt => apt.status === 'scheduled' && new Date(apt.date) > new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);
      
      console.log(`Dashboard stats calculated: ${appointmentsToday.length} appointments today, ${allPatients.length} total patients`);
      
      // Generate dashboard stats from real data
      return {
        appointmentsToday: appointmentsToday.length,
        appointmentsThisWeek: appointmentsThisWeek,
        newPatientsToday: newPatientsToday,
        newPatientsThisWeek: newPatientsThisWeek,
        completedConsultationsToday: completedToday,
        upcomingAppointments: upcomingAppointments,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats from OpenMRS:', error);
      throw new Error('Failed to fetch dashboard statistics from OpenMRS API. Please check your connection and try again.');
    }
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

  private mapOpenMRSPatientFromAppointment(patientData: any): Patient {
    // Map patient data from appointment response
    return {
      id: patientData.uuid,
      name: patientData.display || patientData.name || 'Unknown Patient',
      gender: patientData.gender?.toLowerCase() || 'unknown',
      dateOfBirth: patientData.birthdate || new Date().toISOString(),
      contactNumber: patientData.phoneNumber || patientData.contactNumber || '',
      address: patientData.address || '',
      registrationDate: patientData.dateCreated || new Date().toISOString(),
    };
  }

  private mapOpenMRSPersonToUmzima(person: any): Patient {
    // Map person data to patient format
    return {
      id: person.uuid,
      name: person.display || `${person.names?.[0]?.givenName || ''} ${person.names?.[0]?.familyName || ''}`.trim(),
      gender: person.gender?.toLowerCase() || 'unknown',
      dateOfBirth: person.birthdate,
      contactNumber: person.attributes?.find((a: any) => a.attributeType?.display === 'Phone Number')?.value || '',
      address: person.addresses?.[0] ? 
        `${person.addresses[0].address1 || ''}, ${person.addresses[0].cityVillage || ''}`.trim() : '',
      registrationDate: person.auditInfo?.dateCreated || new Date().toISOString(),
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
    // Handle the structure returned by /appointment/all endpoint
    const startDateTime = new Date(appointment.startDateTime);
    const endDateTime = new Date(appointment.endDateTime);

    // Calculate duration in minutes
    const duration = Math.round((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60));

    // Get the first provider (doctor)
    const primaryProvider = appointment.providers?.[0] || appointment.provider;

    return {
      id: appointment.uuid,
      patientId: appointment.patient?.uuid || '',
      patientName: appointment.patient?.display || appointment.patient?.name || 'Unknown Patient',
      doctorId: primaryProvider?.uuid || '',
      doctorName: primaryProvider?.display || primaryProvider?.name || 'Unknown Doctor',
      date: startDateTime.toISOString().split('T')[0],
      time: startDateTime.toTimeString().substring(0, 5),
      duration: duration,
      status: this.mapOpenMRSStatusToUmzima(appointment.status),
      type: this.mapOpenMRSAppointmentTypeToUmzima(appointment.service?.name || 'General'),
      reason: appointment.comments || appointment.additionalInfo || '',
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