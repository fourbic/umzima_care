import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, User, Clock } from 'lucide-react';
import AuthenticatedLayout from '../components/Layout/AuthenticatedLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import openMRSAPI from '../services/api';
import { Appointment } from '../types';

const AppointmentsPage = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate, view]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Format selected date
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      // Get appointments for the selected date
      let appointmentsData = await openMRSAPI.getAppointments({ date: formattedDate });
      
      // If week view, we'd need to get appointments for the entire week
      if (view === 'week') {
        // Implementation would fetch appointments for the entire week
        // This is a placeholder for demonstration
      }
      
      setAppointments(appointmentsData);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const navigateToSchedule = () => {
    navigate('/appointments/schedule');
  };

  const previousDay = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - (view === 'day' ? 1 : 7));
    setSelectedDate(prevDate);
  };

  const nextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + (view === 'day' ? 1 : 7));
    setSelectedDate(nextDate);
  };

  const today = () => {
    setSelectedDate(new Date());
  };

  const toggleView = () => {
    setView(view === 'day' ? 'week' : 'day');
  };

  const formatDateRange = () => {
    if (view === 'day') {
      return selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } else {
      // For week view, display the date range
      const weekStart = new Date(selectedDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  // Group appointments by time for day view
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const time = appointment.time;
    if (!acc[time]) {
      acc[time] = [];
    }
    acc[time].push(appointment);
    return acc;
  }, {} as Record<string, Appointment[]>);

  // Sort times for display
  const sortedTimes = Object.keys(groupedAppointments).sort();

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              View and manage patient appointments
            </p>
          </div>
          <Button
            variant="primary"
            icon={<Plus size={20} />}
            onClick={navigateToSchedule}
          >
            Schedule Appointment
          </Button>
        </div>

        <Card>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                icon={<ChevronLeft size={16} />}
                onClick={previousDay}
              />
              <h2 className="text-lg font-medium">{formatDateRange()}</h2>
              <Button
                variant="outline"
                size="sm"
                icon={<ChevronRight size={16} />}
                onClick={nextDay}
              />
              {!isToday(selectedDate) && (
                <Button variant="outline" size="sm" onClick={today}>
                  Today
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">View:</span>
              <Button
                variant={view === 'day' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setView('day')}
              >
                Day
              </Button>
              <Button
                variant={view === 'week' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setView('week')}
              >
                Week
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-20 flex-1 rounded bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex h-32 flex-col items-center justify-center text-center">
              <p className="text-gray-500 dark:text-gray-400">{error}</p>
              <Button variant="primary" className="mt-4" onClick={fetchAppointments}>
                Try Again
              </Button>
            </div>
          ) : view === 'day' ? (
            // Day view
            <div className="space-y-2">
              {sortedTimes.length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center text-center">
                  <CalendarIcon className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                  <p className="mt-2 text-gray-500 dark:text-gray-400">No appointments scheduled for this day</p>
                  <Button variant="primary" className="mt-4" onClick={navigateToSchedule}>
                    Schedule Appointment
                  </Button>
                </div>
              ) : (
                sortedTimes.map(time => (
                  <div key={time} className="rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="bg-gray-50 px-4 py-2 dark:bg-gray-800">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {time}
                        </span>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {groupedAppointments[time].map(appointment => (
                        <div key={appointment.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <div className="flex items-start">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-dark text-white">
                              <User size={20} />
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {appointment.patientName}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {appointment.type.replace('-', ' ')} with Dr. {appointment.doctorName}
                                  </p>
                                </div>
                                <div>
                                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                    appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                    appointment.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  }`}>
                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                              {appointment.reason && (
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                  Reason: {appointment.reason}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // Week view - Simplified for demo
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="w-20 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Time
                    </th>
                    {Array.from({ length: 7 }).map((_, i) => {
                      const day = new Date(selectedDate);
                      day.setDate(day.getDate() - day.getDay() + i);
                      
                      return (
                        <th key={i} className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          <div className={`flex flex-col items-center rounded-lg p-2 ${isToday(day) ? 'bg-primary-bright/10' : ''}`}>
                            <span>{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                            <span className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${
                              isToday(day) ? 'bg-primary-bright text-primary-dark' : ''
                            }`}>
                              {day.getDate()}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {/* For simplicity, showing just a few time slots in the week view */}
                  {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map(time => (
                    <tr key={time} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white">
                        {time}
                      </td>
                      {Array.from({ length: 7 }).map((_, i) => {
                        const day = new Date(selectedDate);
                        day.setDate(day.getDate() - day.getDay() + i);
                        const dateStr = day.toISOString().split('T')[0];
                        
                        // Find appointments for this time slot and day
                        const appt = appointments.find(a => 
                          a.time.startsWith(time) && a.date === dateStr
                        );
                        
                        return (
                          <td key={i} className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {appt ? (
                              <div className="rounded-lg border border-primary-bright/20 bg-primary-bright/10 p-2 text-center">
                                <p className="font-medium text-primary-dark dark:text-white">{appt.patientName}</p>
                                <p className="text-xs">{appt.type.replace('-', ' ')}</p>
                              </div>
                            ) : (
                              <div className="h-12 cursor-pointer rounded-lg border border-dashed border-gray-300 p-2 text-center hover:border-primary-bright dark:border-gray-700">
                                <span className="text-xs text-gray-400">Available</span>
                              </div>
                            )}
                          </td>
                        );
                      })}
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

export default AppointmentsPage;