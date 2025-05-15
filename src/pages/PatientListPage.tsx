import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, ChevronRight, RefreshCw } from 'lucide-react';
import AuthenticatedLayout from '../components/Layout/AuthenticatedLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import openMRSAPI from '../services/api';
import { Patient } from '../types';

const PatientListPage = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientData = await openMRSAPI.getPatients();
        setPatients(patientData);
        setFilteredPatients(patientData);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const refreshPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const patientData = await openMRSAPI.getPatients();
      setPatients(patientData);
      setFilteredPatients(patientData);
    } catch (err) {
      console.error('Error refreshing patients:', err);
      setError('Failed to refresh patients');
    } finally {
      setLoading(false);
    }
  };

  const navigateToPatientRegistration = () => {
    navigate('/patients/register');
  };

  const navigateToPatientProfile = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patients</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              View and manage patient records
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              icon={<UserPlus size={20} />}
              onClick={navigateToPatientRegistration}
            >
              New Patient
            </Button>
            <Button
              variant="outline"
              icon={<RefreshCw size={20} />}
              onClick={refreshPatients}
              disabled={loading}
            >
              Refresh
            </Button>
          </div>
        </div>

        <Card>
          <div className="mb-6">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="search"
                label=""
                type="text"
                placeholder="Search patients by name or ID..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex-1">
                      <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div className="mt-2 h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex h-32 flex-col items-center justify-center text-center">
              <p className="text-gray-500 dark:text-gray-400">{error}</p>
              <Button variant="primary" className="mt-4" onClick={refreshPatients}>
                Try Again
              </Button>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No patients match your search criteria' : 'No patients in the system yet'}
              </p>
              {!searchTerm && (
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={navigateToPatientRegistration}
                >
                  Register First Patient
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Patient
                    </th>
                    <th scope="col" className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 md:table-cell">
                      ID
                    </th>
                    <th scope="col" className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 md:table-cell">
                      Gender
                    </th>
                    <th scope="col" className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 md:table-cell">
                      Contact
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {filteredPatients.map((patient) => (
                    <tr 
                      key={patient.id}
                      className="group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => navigateToPatientProfile(patient.id)}
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-dark text-sm font-medium text-white">
                            {patient.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {patient.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(patient.dateOfBirth).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400 md:table-cell">
                        {patient.id.substring(0, 8)}...
                      </td>
                      <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400 md:table-cell">
                        {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                      </td>
                      <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400 md:table-cell">
                        {patient.contactNumber || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <ChevronRight className="ml-auto h-5 w-5 text-gray-400 group-hover:text-primary-bright" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AuthenticatedLayout>
  );
};

export default PatientListPage;