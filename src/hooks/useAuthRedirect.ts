
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

export function useAuthRedirect() {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      if (data.session) {
        navigate('/dashboard');
      }
    };
    
    fetchSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          navigate('/dashboard');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const redirectAfterAuth = () => {
    // This function is called after successful authentication
    // Navigation is handled by the auth state listener, but we provide
    // this function for additional actions if needed
  };

  return {
    session,
    redirectAfterAuth
  };
}
