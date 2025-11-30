import * as React from "react";
import axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginFunc, logoffFunc } from './redux/actions/auth';
import {
  UserIcon,
  LockClosedIcon,
  ArrowRightOnRectangleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

axios.defaults.baseURL = 'http://localhost:5001';

const StatusAlert = ({ type, children }) => {
  const base = "p-4 rounded-xl flex items-start gap-3 border shadow-sm animate-fade-in ";
  if (type === "success")
    return (
      <div className={base + "bg-green-50 border-green-200 text-green-800"}>
        <div className="mt-0.5 text-green-600"><CheckCircleIcon className="w-5 h-5" /></div>
        <div>{children}</div>
      </div>
    );
  if (type === "warn")
    return (
      <div className={base + "bg-yellow-50 border-yellow-200 text-yellow-800"}>
        <div className="mt-0.5 text-yellow-600"><ExclamationCircleIcon className="w-5 h-5" /></div>
        <div>{children}</div>
      </div>
    );
  if (type === "error")
    return (
      <div className={base + "bg-red-50 border-red-200 text-red-800"}>
        <div className="mt-0.5 text-red-600"><ExclamationCircleIcon className="w-5 h-5" /></div>
        <div>{children}</div>
      </div>
    );
  return null;
};

const Login = () => {
    let navigate = useNavigate();
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [status, setStatus] = React.useState('');
    const dispatch = useDispatch();
    const login = useSelector(state => state.auth.login);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        await axios({
            method: 'post',
            url: '/login',
            data: {
                user : username,
                password : password
            }
        })
            .then(function (response) {
                if (response.status === 200) {
                      if(response.data.status === "success") {
                        setStatus('success');
                        // Small delay to show success state
                        setTimeout(() => {
                            dispatch(loginFunc(true));
                            navigate('/form', { replace: true });
                        }, 800);
                      } else {
                        setStatus('authissue');
                      }
                }
                else {
                  dispatch(logoffFunc(false));
                  setStatus('warn');
                }
            })
            .catch(function (error) {
              dispatch(logoffFunc(false));
                setStatus('error');
            });
    }

    let statusAlert = null;
    if (status === 'authissue') {
        statusAlert = (
            <StatusAlert type="warn">
                <strong className="font-bold block">Access Denied</strong>
                <span className="text-sm opacity-90">Invalid username or password. Please try again.</span>
            </StatusAlert>
        );
    } else if (status === 'error') {
        statusAlert = (
            <StatusAlert type="error">
                <strong className="font-bold block">Connection Error</strong>
                <span className="text-sm opacity-90">Unable to connect to the server. Please check your internet connection.</span>
            </StatusAlert>
        );
    } else if (status === 'success') {
        statusAlert = (
            <StatusAlert type="success">
                <strong className="font-bold block">Welcome Back!</strong>
                <span className="text-sm opacity-90">Logging you in securely...</span>
            </StatusAlert>
        );
    } else if (status === 'warn') {
        statusAlert = (
            <StatusAlert type="warn">
                <strong className="font-bold block">Warning</strong>
                <span className="text-sm opacity-90">Unexpected response from server.</span>
            </StatusAlert>
        );
    }

    if (login) return <Navigate to="/form" replace />;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                
                {/* Logo / Header Section */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6 shadow-sm border border-orange-200">
                        <ArrowRightOnRectangleIcon className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Welcome back! Please enter your details.
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl shadow-gray-200/50 dark:shadow-none rounded-2xl sm:px-10 border border-gray-100 dark:border-gray-700">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-10 rounded-xl border-gray-300 focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-3 transition-shadow dark:bg-gray-700 dark:border-gray-600"
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 rounded-xl border-gray-300 focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-3 transition-shadow dark:bg-gray-700 dark:border-gray-600"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        {statusAlert}

                        <div>
                            <button
                                type="submit"
                                disabled={status === 'loading' || status === 'success'}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-orange-500/30 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5"
                            >
                                {status === 'loading' ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                
                <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                    &copy; 2025 Sri Amman Printers. All rights reserved.
                </p>
            </div>
        </div>
    );
}

export default Login;