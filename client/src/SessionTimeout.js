import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoffFunc } from './redux/actions/auth';

const SessionTimeout = () => {
  const [showWarning, setShowWarning] = useState(false);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.login);
  
  // Constants (in milliseconds)
  const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes
  const WARNING_DURATION = 2 * 60 * 1000;  // 2 minutes warning before timeout
  
  const timerRef = useRef(null);
  const warningTimerRef = useRef(null);

  const logoutUser = useCallback(() => {
    dispatch(logoffFunc(false));
    setShowWarning(false);
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/'; // Force redirect to login
  }, [dispatch]);

  const showSessionWarning = useCallback(() => {
    setShowWarning(true);
    // Start the final countdown to logout
    timerRef.current = setTimeout(logoutUser, WARNING_DURATION);
  }, [logoutUser]);

  const resetTimer = useCallback(() => {
    if (!isLoggedIn) return;

    if (showWarning) {
        setShowWarning(false);
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);

    // Set timer for the warning
    warningTimerRef.current = setTimeout(showSessionWarning, TIMEOUT_DURATION - WARNING_DURATION);
  }, [isLoggedIn, showWarning, showSessionWarning]);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Events to listen for activity
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    
    // Initial start
    resetTimer();

    const handleActivity = () => {
        resetTimer();
    };

    // Attach listeners
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isLoggedIn, resetTimer]);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-orange-100 animate-bounce-in">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-orange-100 rounded-full mb-4">
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-2">
          Session Expiring
        </h3>
        
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
          You have been inactive for a while. Your session will end in 2 minutes.
        </p>

        <div className="flex justify-center">
            <button
              onClick={resetTimer}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg shadow-orange-500/30"
            >
              I'm still here
            </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeout;
