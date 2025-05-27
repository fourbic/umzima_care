import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Icon } from '../components/common/Icon';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({ username: '', password: '' });
  const { login, loading, error } = useAuth();

  const validateForm = () => {
    let valid = true;
    const newErrors = { username: '', password: '' };

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await login(username, password);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left side - Branding and info */}
      <div className="hidden flex-1 flex-col justify-center bg-primary-dark px-8 py-12 lg:flex">
        <div className="mb-16 flex items-center">
          <Icon name="Leaf" className="mr-3 h-10 w-10 text-primary-bright" />
          <h1 className="text-3xl font-bold text-white">Umzima</h1>
        </div>
        <div className="max-w-lg">
          <h2 className="text-3xl font-bold text-white">Welcome to Umzima v2</h2>
          <p className="mt-4 text-lg text-gray-300">
            A simplified, accessible digital system for core Primary Health Care operations for small clinics.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-bright text-primary-dark">
                <Icon name="Leaf" className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Easy Patient Management</h3>
                <p className="text-gray-300">Streamlined registration and record keeping</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-bright text-primary-dark">
                <Icon name="Leaf" className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Appointment Scheduling</h3>
                <p className="text-gray-300">Efficient booking and management system</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-bright text-primary-dark">
                <Icon name="Leaf" className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Clinical Notes</h3>
                <p className="text-gray-300">Simple documentation for better patient care</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center justify-center">
            <Logo size="lg" />
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Enter your credentials to access the PHC system
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-md shadow-sm">
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={formErrors.username}
                placeholder="Enter your username"
              />

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={formErrors.password}
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-bright focus:ring-primary-bright"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-bright hover:text-accent-green-1">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                fullWidth
                size="lg"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                For demo purposes: Use username "admin" and password "Admin123" to log in as an administrator.
              </p>
            </div>
            {/* Terms & Conditions and Privacy Policy Links */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                By using Umzima Health, you agree to our
                <Link to="/terms" className="text-primary-dark hover:text-primary-bright mx-1">Terms & Conditions</Link>
                and
                <Link to="/privacy-policy" className="text-primary-dark hover:text-primary-bright mx-1">Privacy Policy</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;