"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer } from '@/types';

interface Notification {
  msg: string;
  type: 'success' | 'error';
}

interface AppContextType {
  customer: Customer | null;
  token: string | null;
  login: (customerData: Customer, tokenData: string) => void;
  logout: () => void;
  setToken: (token: string | null) => void;
  setCustomer: (customer: Customer | null) => void;
  showNotification: (msg: string, type?: 'success' | 'error') => void;
  API_URL: string;
  modalView: string | null;
  openModal: (view: string) => void;
  closeModal: () => void;
  orgBranding: any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [modalView, setModalView] = useState<string | null>(null);
  const [orgBranding, setOrgBranding] = useState<any>({ orgLogoUrl: '/logo.png', faviconUrl: '/logo.png' });
  
  const API_URL = '/api';

  useEffect(() => {
    // Client-side only logic
    const storedToken = localStorage.getItem('customerToken');
    setToken(storedToken);
    
    const storedCustomer = localStorage.getItem('customer');
    if (storedToken && storedCustomer) {
      try {
          setCustomer(JSON.parse(storedCustomer));
      } catch (e) {
          console.error("Failed to parse customer from local storage", e);
      }
    }

    // Fetch branding
    fetch('/api/public/settings/org-branding')
      .then(res => res.json())
      .then(data => {
          setOrgBranding(data);
      })
      .catch(() => { /* Defaults */ });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (customerData: Customer, tokenData: string) => {
    localStorage.setItem('customer', JSON.stringify(customerData));
    localStorage.setItem('customerToken', tokenData);
    setCustomer(customerData);
    setToken(tokenData);
    setModalView(null);
  };

  const logout = () => {
    localStorage.removeItem('customer');
    localStorage.removeItem('customerToken');
    setCustomer(null);
    setToken(null);
    setModalView(null);
    window.location.href = '/'; // Optional: redirect to home
  };

  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const openModal = (view: string) => {
    setModalView(view);
  };

  const closeModal = () => {
    setModalView(null);
  };

  return (
    <AppContext.Provider value={{ customer, token, login, logout, setToken, setCustomer, showNotification, API_URL, modalView, openModal, closeModal, orgBranding }}>
      {children}
      
      {/* Notification Popup */}
      {notification && (
        <div 
            className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white shadow-lg z-[110] transition-all duration-300 ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}
        >
            {notification.msg}
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
