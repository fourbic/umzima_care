import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import AuthenticatedLayout from '../components/Layout/AuthenticatedLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import openMRSAPI from '../services/api';
import { Patient } from '../types';

interface FormErrors {
  name?: string;
  gender?: string;
  dateOfBirth?: string;
  contactNumber?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactNumber?: string;
}

const PatientRegistrationPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dateOfBirth: '',
    contactNumber: '',
    address: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactNumber: '',
    allergies: '',
    chronicConditions: '',
    medications: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Patient name is required';
      isValid = false;
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
      isValid = false;
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
      isValid = false;
    } else {
      // Check if date is not in the future
      const dob = new Date(formData.dateOfBirth);
      if (dob > new Date()) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
        isValid = false;
      }
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    // Emergency contact validation - only validate if any emergency contact field is filled
    if (formData.emergencyContactName || formData.emergencyContactRelationship || formData.emergencyContactNumber) {
      if (!formData.emergencyContactName.trim()) {
        newErrors.emergencyContactName = 'Emergency contact name is required';
        isValid = false;
      }
      
      if (!formData.emergencyContactRelationship.trim()) {
        newErrors.emergencyContactRelationship = 'Relationship is required';
        isValid = false;
      }
      
      if (!formData.emergencyContactNumber.trim()) {
        newErrors.emergencyContactNumber = 'Emergency contact number is required';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare patient data
      const patientData: Omit<Patient, 'id' | 'registrationDate'> = {
        name: formData.name,
        gender: formData.gender as 'male' | 'female' | 'other',
        dateOfBirth: formData.dateOfBirth,
        contactNumber: formData.contactNumber,
        address: formData.address,
      };
      
      // Add emergency contact if provided
      if (formData.emergencyContactName) {
        patientData.emergencyContact = {
          name: formData.emergencyContactName,
          relationship: formData.emergencyContactRelationship,
          contactNumber: formData.emergencyContactNumber,
        };
      }
      
      // Add medical history if provided
      if (formData.allergies || formData.chronicConditions || formData.medications) {
        patientData.medicalHistory = {
          allergies: formData.allergies.split(',').map(allergy => allergy.trim()),
          chronicConditions: formData.chronicConditions.split(',').map(condition => condition.trim()),
          medications: formData.medications.split(',').map(medication => medication.trim()),
        };
      }
      
      // Register patient through API
      const registeredPatient = await openMRSAPI.registerPatient(patientData);
      
      // Redirect to the patient's profile page
      navigate(`/patients/${registeredPatient.id}`);
      
    } catch (error) {
      console.error('Error registering patient:', error);
      alert('Failed to register patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="mr-4"
              icon={<ArrowLeft size={16} />}
              onClick={() => navigate('/patients')}
            >
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Register New Patient
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Enter the patient's information below
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Personal Information */}
            <Card title="Personal Information" subtitle="Basic patient details">
              <Input
                id="name"
                name="name"
                label="Full Name"
                placeholder="Enter patient's full name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Select
                  id="gender"
                  name="gender"
                  label="Gender"
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                  ]}
                  value={formData.gender}
                  onChange={handleChange}
                  error={errors.gender}
                  required
                />

                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  error={errors.dateOfBirth}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <Input
                id="contactNumber"
                name="contactNumber"
                label="Contact Number"
                placeholder="Enter phone number"
                value={formData.contactNumber}
                onChange={handleChange}
                error={errors.contactNumber}
                required
              />

              <Input
                id="address"
                name="address"
                label="Address"
                placeholder="Enter patient's address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                required
              />
            </Card>

            {/* Additional Information */}
            <div className="space-y-6">
              <Card title="Emergency Contact" subtitle="Optional but recommended">
                <Input
                  id="emergencyContactName"
                  name="emergencyContactName"
                  label="Contact Name"
                  placeholder="Enter emergency contact name"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  error={errors.emergencyContactName}
                />

                <Input
                  id="emergencyContactRelationship"
                  name="emergencyContactRelationship"
                  label="Relationship to Patient"
                  placeholder="E.g., Spouse, Parent, Sibling"
                  value={formData.emergencyContactRelationship}
                  onChange={handleChange}
                  error={errors.emergencyContactRelationship}
                />

                <Input
                  id="emergencyContactNumber"
                  name="emergencyContactNumber"
                  label="Contact Number"
                  placeholder="Enter emergency contact number"
                  value={formData.emergencyContactNumber}
                  onChange={handleChange}
                  error={errors.emergencyContactNumber}
                />
              </Card>

              <Card title="Medical History" subtitle="Optional health information">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="allergies" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Allergies
                    </label>
                    <textarea
                      id="allergies"
                      name="allergies"
                      rows={2}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-bright focus:outline-none focus:ring-1 focus:ring-primary-bright dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="List any allergies, separated by commas"
                      value={formData.allergies}
                      onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="chronicConditions" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Chronic Conditions
                    </label>
                    <textarea
                      id="chronicConditions"
                      name="chronicConditions"
                      rows={2}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-bright focus:outline-none focus:ring-1 focus:ring-primary-bright dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="List any chronic conditions, separated by commas"
                      value={formData.chronicConditions}
                      onChange={(e) => setFormData(prev => ({ ...prev, chronicConditions: e.target.value }))}
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="medications" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Medications
                    </label>
                    <textarea
                      id="medications"
                      name="medications"
                      rows={2}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-bright focus:outline-none focus:ring-1 focus:ring-primary-bright dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="List current medications, separated by commas"
                      value={formData.medications}
                      onChange={(e) => setFormData(prev => ({ ...prev, medications: e.target.value }))}
                    ></textarea>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="mr-4"
              onClick={() => navigate('/patients')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={<Save size={20} />}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register Patient'}
            </Button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
};

export default PatientRegistrationPage;