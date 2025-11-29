import * as React from "react";
import axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginFunc, logoffFunc } from './redux/actions/auth';

axios.defaults.baseURL = 'http://localhost:5001';

// --- Components for New Design ---

const FloatingInput = ({ label, type, value, onChange, id }) => {
    const [focused, setFocused] = React.useState(false);
    const hasValue = value && value.length > 0;
    
    return (
        <div className="relative mb-6 group">
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={`block py-3 px-4 w-full text-sm text-gray-900 bg-transparent border-2 rounded-xl appearance-none focus:outline-none focus:ring-0 peer transition-all duration-300 ${
                    focused || hasValue ? 'border-orange-500' : 'border-gray-300'
                }`}
                placeholder=" "
                required
            />
            <label
                htmlFor={id}
                className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 ${
                    focused || hasValue ? 'text-orange-600 font-semibold' : 'text-gray-500'
                }`}
            >
                {label}
            </label>
            <div className={`absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300 ${focused ? 'opacity-100' : 'opacity-0'}`} style={{ boxShadow: '0 0 15px rgba(249, 115, 22, 0.3)' }}></div>
        </div>
    );
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

    // --- Components for New Design ---
    // FloatingInput moved outside to prevent remounting


    let statusAlert = null;
    if (status === 'authissue') {
        statusAlert = (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800 animate-pulse" role="alert">
                <span className="font-medium">Access Denied!</span> Invalid credentials.
            </div>
        );
    } else if (status === 'error') {
        statusAlert = (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                <span className="font-medium">Error!</span> Server unreachable.
            </div>
        );
    } else if (status === 'success') {
        statusAlert = (
            <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert">
                <span className="font-medium">Welcome!</span> Logging you in...
            </div>
        );
    }

    if (login) return <Navigate to="/form" replace />;

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Glass Card */}
            <div className="relative z-10 w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 transform transition-all hover:scale-[1.01]">
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">Sign in to access your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-2">
                    <FloatingInput 
                        id="username" 
                        type="text" 
                        label="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                    
                    <FloatingInput 
                        id="password" 
                        type="password" 
                        label="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />

                    {statusAlert}

                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all duration-300 ${
                            status === 'loading' 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 hover:shadow-orange-500/30 hover:-translate-y-1'
                        }`}
                    >
                        {status === 'loading' ? (
                            <span className="flex items-center justify-center">
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
                </form>

            </div>
            
            {/* CSS for custom animations (injected here for simplicity) */}
            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}

export default Login;