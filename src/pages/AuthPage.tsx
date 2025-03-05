
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import AuthContainer from '@/components/auth/AuthContainer';

const AuthPage = () => {
  const location = useLocation();
  const { session, redirectAfterAuth } = useAuthRedirect();
  
  // Get the tab from the URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const defaultTab = queryParams.get('tab') === 'signup' ? 'signup' : 'signin';

  // If we're still loading the session or the user is already authenticated,
  // we don't need to render the auth forms yet
  if (session) {
    return null; // User is authenticated, will be redirected by useAuthRedirect
  }

  return (
    <AuthContainer 
      defaultTab={defaultTab} 
      redirectAfterAuth={redirectAfterAuth} 
    />
  );
};

export default AuthPage;
