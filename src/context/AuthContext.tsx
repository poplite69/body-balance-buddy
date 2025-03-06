import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  loading: boolean;
  isOnline: boolean;
  isAdmin: boolean; // New property to check if user is admin
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (user) {
      // For now, we use a simple check based on email
      // Later, you would implement a proper role-based system
      const adminEmails = ['admin@example.com']; // Replace with actual admin emails
      setIsAdmin(adminEmails.includes(user.email || ''));
      
      // This comment is for demonstration purposes:
      // In a real implementation, you would fetch roles from a database table
      // const fetchUserRole = async () => {
      //   const { data } = await supabase
      //     .from('user_roles')
      //     .select('role')
      //     .eq('user_id', user.id)
      //     .single();
      //   setIsAdmin(data?.role === 'admin');
      // };
      // fetchUserRole();
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('You are back online');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('You are offline. Some features may be limited.');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Get session on initial load with offline persistence
    const getInitialSession = async () => {
      try {
        // First try to get from local storage for offline functionality
        const storedSession = localStorage.getItem('supabase.auth.token');
        if (storedSession && !isOnline) {
          try {
            const parsedSession = JSON.parse(storedSession);
            if (parsedSession?.currentSession) {
              setSession(parsedSession.currentSession);
              setUser(parsedSession.currentSession?.user ?? null);
            }
          } catch (e) {
            console.error('Error parsing stored session:', e);
          }
        }
        
        // Get fresh session from Supabase if online
        if (isOnline) {
          const { data } = await supabase.auth.getSession();
          setSession(data.session);
          setUser(data.session?.user ?? null);
          
          // Store for offline use
          if (data.session) {
            localStorage.setItem('supabase.auth.token', JSON.stringify({
              currentSession: data.session
            }));
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Store session for offline use
        if (session) {
          localStorage.setItem('supabase.auth.token', JSON.stringify({
            currentSession: session
          }));
        } else {
          localStorage.removeItem('supabase.auth.token');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [isOnline]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('supabase.auth.token');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    session,
    user,
    signOut,
    loading,
    isOnline,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
