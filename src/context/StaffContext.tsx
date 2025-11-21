"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';

interface Notification {
  message: string;
  type: 'success' | 'error';
}

interface StaffContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  showNotification: (msg: string, type?: 'success' | 'error') => void;
  api: (endpoint: string, method?: string, body?: unknown) => Promise<unknown>;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export function StaffProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const API_URL = '/api';

  useEffect(() => {
    // Prevent hydration mismatch by running effect only on client
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(parsedUser);
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (userData: User, tokenData: string) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenData);
    setUser(userData);
    setToken(tokenData);
  };

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    router.push('/staff/login');
  }, [router]);

  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const api = useCallback(async (endpoint: string, method = 'GET', body: unknown = null) => {
    if (!token) throw new Error("Not authenticated");
    
    const options: RequestInit = {
        method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, options);
    if (response.status === 401) {
        logout();
        throw new Error('Session expired. Please log in again.');
    }
    if (response.status === 204) {
        return;
    }
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'An API error occurred.');
    }
    return data;
  }, [token, logout]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <StaffContext.Provider value={{ user, token, login, logout, showNotification, api }}>
      {children}
      {notification && (
        <div className={`fixed bottom-5 right-5 text-white px-6 py-3 rounded-lg shadow-lg z-[110] ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {notification.message}
        </div>
      )}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
}
