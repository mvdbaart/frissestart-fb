
'use client';

import type { ReactNode} from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  type User, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  type AuthError
} from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Zorg dat je Firebase correct is geinitialiseerd
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error?: AuthError }>;
  signUp: (email: string, pass: string) => Promise<{ error?: AuthError }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      router.push('/'); // Redirect naar home na login
      return {};
    } catch (error) {
      console.error("Error signing in:", error);
      return { error: error as AuthError };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      router.push('/'); // Redirect naar home na registratie
      return {};
    } catch (error) {
      console.error("Error signing up:", error);
      return { error: error as AuthError };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
      router.push('/login'); // Redirect naar login pagina na uitloggen
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
