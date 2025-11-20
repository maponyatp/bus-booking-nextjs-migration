"use client";

import React from 'react';
import { StaffProvider } from '@/context/StaffContext';
import SalesAgentPOS from '@/components/operator/SalesAgentPOS';

export default function OperatorPOSPage() {
    return (
        <StaffProvider>
            <SalesAgentPOS />
        </StaffProvider>
    );
}
