import { useState, useEffect } from 'react';
import { Users, Calendar, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthenticatedLayout from '../components/Layout/AuthenticatedLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import openMRSAPI from '../services/api';
import { DashboardStats, Appointment } from '../types';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashboardStats = await openMRSAPI.getDashboardStats();
        setStats(dashboardStats);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <AuthenticatedLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">{error}</p>
            <Button 
              variant="primary" 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome, {user?.name}
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Here's what's happening at the clinic today
          </p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard 
                title="Today's Appointments" 
                value={stats?.appointmentsToday || 0} 
                icon={<Calendar className="h-8 w-8 text-primary-bright" />} 
              />
              <StatCard 
                title="This Week's Appointments" 
                value={stats?.appointmentsThisWeek || 0} 
                icon={<Calendar className="h-8 w-8 text-accent-green-1" />} 
              />
              <StatCard 
                title="New Patients Today" 
                value={stats?.newPatientsToday || 0} 
                icon={<Users className="h-8 w-8 text-primary-bright" />} 
              />
              <StatCard 
                title="Consultations Completed" 
                value={stats?.completedConsultationsToday || 0} 
                icon={<CheckCircle className="h-8 w-8 text-accent-green-1" />} 
              />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <UpcomingAppointmentsCard appointments={stats?.upcomingAppointments || []} />
              <Card title="Reminders" subtitle="Important tasks for today">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                      <Clock size={18} className="text-yellow-600 dark:text-yellow-300" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Stock check needed for essential medications
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Due today at 3:00 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <Clock size={18} className="text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Follow up with patients who missed appointments
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        5 patients from last week
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                      <Clock size={18} className="text-green-600 dark:text-green-300" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Weekly staff meeting
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Today at 4:30 PM in the conference room
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </AuthenticatedLayout>
  );
};

const StatCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
  <Card className="flex items-center">
    <div className="mr-4 flex-shrink-0">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </Card>
);

const UpcomingAppointmentsCard = ({ appointments }: { appointments: Appointment[] }) => (
  <Card 
    title="Upcoming Appointments" 
    headerAction={
      <Button 
        size="sm" 
        variant="outline" 
        icon={<ArrowRight size={16} />}
      >
        View All
      </Button>
    }
  >
    {appointments.length === 0 ? (
      <div className="flex h-32 flex-col items-center justify-center text-center">
        <Calendar className="h-10 w-10 text-gray-300 dark:text-gray-600" />
        <p className="mt-2 text-gray-500 dark:text-gray-400">No upcoming appointments</p>
      </div>
    ) : (
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="flex items-start border-b border-gray-100 pb-4 dark:border-gray-700 last:border-0 last:pb-0">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-dark text-white">
              {appointment.patientName.charAt(0)}
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {appointment.patientName}
                </p>
                <span className="inline-flex rounded-full bg-primary-bright/10 px-2 py-1 text-xs font-medium text-primary-dark">
                  {appointment.time}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {appointment.type.replace('-', ' ')} • Dr. {appointment.doctorName}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
  </Card>
);

export default DashboardPage;