import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  // Which user the current `profile` value was loaded for (null = none loaded yet)
  const [profileUserId, setProfileUserId] = useState(null);

  const userId = user?.id ?? null;
  const loading = !authReady || (userId !== null && profileUserId !== userId);

  // Auth listener: keep this callback synchronous and free of Supabase calls.
  // Awaiting Supabase requests inside onAuthStateChange deadlocks the auth
  // client's internal lock (getSession and every query then hang forever).
  // It also fires INITIAL_SESSION on subscribe, so no separate getSession().
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load the profile separately whenever the signed-in user changes.
  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setProfileUserId(null);
      return;
    }

    let cancelled = false;
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error('Failed to fetch profile:', error);
        setProfile(data ?? null);
        setProfileUserId(userId);
      });

    return () => { cancelled = true; };
  }, [userId]);

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
  };

  const createProfile = async (displayName) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert({ id: user.id, display_name: displayName })
      .select()
      .single();

    if (error) throw error;
    setProfile(data);
    return data;
  };

  const updateProfile = async (displayName) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(data);
    return data;
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      createProfile,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
