"use client";

import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import Hero from '@/components/Hero';
import BookingWidget from '@/components/BookingWidget';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginRegisterModal from '@/components/LoginRegisterModal';
import MyAccountModal from '@/components/MyAccountModal';

export default function Home() {
  const { modalView, customer, openModal, closeModal } = useApp();

  useEffect(() => {
    // Listen to hash changes to open/close modal
    const handleHashChange = () => {
        if (window.location.hash === '#login') {
            openModal('login');
        } else if (window.location.hash === '#account') {
             if(localStorage.getItem('customerToken')) { 
                openModal('account');
             } else {
                window.location.hash = '#login'; 
             }
        } else {
            closeModal();
        }
    };
    
    handleHashChange(); 
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [openModal, closeModal]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-slate-50">
          <Hero />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-32 relative z-10">
              <BookingWidget />
          </div>
      </main>
      <Footer />

      {/* Modal Renderer */}
      {modalView === 'login' && <LoginRegisterModal onClose={() => { window.location.hash = ''; closeModal(); }} />}
      {modalView === 'account' && customer && <MyAccountModal onClose={() => { window.location.hash = ''; closeModal(); }} />}
    </div>
  );
}
