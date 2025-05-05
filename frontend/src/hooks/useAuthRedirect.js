// src/hooks/useAuthRedirect.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthRedirect = (redirectIfAuth = false, redirectPath = '/dashboard') => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/check-auth');
        const data = await res.json();

        if (redirectIfAuth && data.authenticated) {
          navigate(redirectPath);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      }
    };

    checkAuth();
  }, [navigate, redirectIfAuth, redirectPath]);
};

export default useAuthRedirect;
