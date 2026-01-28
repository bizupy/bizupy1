import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double execution (React StrictMode)
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      try {
        console.log('AuthCallback: Processing authentication...');
        console.log('Location hash:', location.hash);
        console.log('Location search:', location.search);
        
        // Extract session_id from URL fragment OR query params
        let sessionId = null;
        
        // Try hash first (format: #session_id=xyz)
        if (location.hash) {
          const hashParams = new URLSearchParams(location.hash.substring(1));
          sessionId = hashParams.get('session_id');
          console.log('Session ID from hash:', sessionId);
        }
        
        // Try query params if not in hash (format: ?session_id=xyz)
        if (!sessionId && location.search) {
          const searchParams = new URLSearchParams(location.search);
          sessionId = searchParams.get('session_id');
          console.log('Session ID from query:', sessionId);
        }

        if (!sessionId) {
          console.error('No session ID found in URL');
          toast.error('Authentication failed: No session ID');
          navigate('/');
          return;
        }

        console.log('Exchanging session_id for user data...');
        
        // Exchange session_id for user data and session_token
        const response = await axios.post(
          `${API}/auth/google-session`,
          { session_id: sessionId },
          { withCredentials: true }
        );

        console.log('Auth response:', response.data);
        const { user } = response.data;

        if (!user) {
          throw new Error('No user data received');
        }

        toast.success('Login successful!');

        // Navigate to dashboard with user data
        navigate('/dashboard', { 
          replace: true, 
          state: { user } 
        });

      } catch (error) {
        console.error('Auth error:', error);
        console.error('Error details:', error.response?.data);
        
        const errorMsg = error.response?.data?.detail || error.message || 'Authentication failed';
        toast.error(`Authentication failed: ${errorMsg}`);
        
        // Wait a bit before redirecting so user can see the error
        setTimeout(() => navigate('/'), 2000);
      }
    };

    processSession();
  }, [location.hash, location.search, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-slate-600">Completing sign in...</p>
        <p className="mt-2 text-xs text-slate-400">Please wait while we verify your credentials</p>
      </div>
    </div>
  );
};

export default AuthCallback;