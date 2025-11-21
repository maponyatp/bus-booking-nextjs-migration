import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import StaffSidebar from '../Sidebar'
import { User } from '@/types'

const mockSetView = jest.fn()
const mockLogout = jest.fn()

describe('StaffSidebar', () => {
    const adminUser: User = { id: 1, username: 'admin', email: 'admin@test.com', role: 'Admin' }
    const salesUser: User = { id: 2, username: 'sales', email: 'sales@test.com', role: 'SalesAgent' }

    it('renders admin navigation items', () => {
        render(
            <StaffSidebar 
                user={adminUser} 
                currentView="dashboard" 
                setView={mockSetView} 
                onLogout={mockLogout} 
            />
        )

        // Admin should see these
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(screen.getByText('Point of Sale')).toBeInTheDocument()
        expect(screen.getByText('Staff Management')).toBeInTheDocument()
        expect(screen.getByText('Fleet Management')).toBeInTheDocument()
    })

    it('renders restricted navigation items for sales agent', () => {
        render(
            <StaffSidebar 
                user={salesUser} 
                currentView="dashboard" 
                setView={mockSetView} 
                onLogout={mockLogout} 
            />
        )

        // Sales Agent should see these
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(screen.getByText('Point of Sale')).toBeInTheDocument()
        
        // Sales Agent should NOT see these
        expect(screen.queryByText('Staff Management')).not.toBeInTheDocument()
        expect(screen.queryByText('Fleet Management')).not.toBeInTheDocument()
    })

    it('calls setView when clicking a nav item', () => {
        render(
            <StaffSidebar 
                user={adminUser} 
                currentView="dashboard" 
                setView={mockSetView} 
                onLogout={mockLogout} 
            />
        )

        fireEvent.click(screen.getByText('Point of Sale'))
        expect(mockSetView).toHaveBeenCalledWith('pos')
    })

    it('calls onLogout when clicking logout', () => {
        render(
            <StaffSidebar 
                user={adminUser} 
                currentView="dashboard" 
                setView={mockSetView} 
                onLogout={mockLogout} 
            />
        )

        fireEvent.click(screen.getByText('Logout'))
        expect(mockLogout).toHaveBeenCalled()
    })
})
