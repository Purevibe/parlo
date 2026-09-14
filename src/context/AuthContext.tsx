import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../services/supabase';

export interface LocalUser {
  id: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  user: User | LocalUser | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signUpLocal: (email: string) => void;
  signInLocal: (email: string) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isConfigured: false,
  signUpLocal: () => {},
  signInLocal: () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | LocalUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (supabase && isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Check local user session in localStorage
      const localAccount = localStorage.getItem('parlo_local_user');
      if (localAccount) {
        try {
          setUser(JSON.parse(localAccount));
        } catch (e) {}
      }
      setLoading(false);
    }
  }, []);

  const signUpLocal = (email: string) => {
    const newUser: LocalUser = {
      id: `local-user-${Date.now()}`,
      email,
      created_at: new Date().toISOString()
    };
    localStorage.setItem('parlo_local_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const signInLocal = (email: string) => {
    const existing = localStorage.getItem('parlo_local_user');
    if (existing) {
      try {
        setUser(JSON.parse(existing));
        return;
      } catch (e) {}
    }
    signUpLocal(email);
  };

  const signOut = async () => {
    if (supabase && isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('parlo_local_user');
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      isConfigured: isSupabaseConfigured, 
      signUpLocal, 
      signInLocal, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
