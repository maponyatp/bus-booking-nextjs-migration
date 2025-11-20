import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BookingWidget from '../BookingWidget'
import { AppProvider } from '@/context/AppContext'
import { act } from 'react'

// Mock fetch
global.fetch = jest.fn()

const mockRoutes = [
  { id: 1, operatorId: 1, name: 'Route A', stops: [
      { stopName: 'City A', isPickupPoint: true, stopOrder: 1 },
      { stopName: 'City B', isDropoffPoint: true, stopOrder: 2 }
  ]}
]

describe('BookingWidget', () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear()
        // Mock branding call
        ;(global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ orgLogoUrl: '/logo.png' })
        })
    })

    it('loads routes and populates dropdowns', async () => {
        // Mock routes call specific
        (global.fetch as jest.Mock).mockImplementation((url) => {
             if (url.includes('org-branding')) {
                 return Promise.resolve({
                     ok: true,
                     json: async () => ({ orgLogoUrl: '/logo.png' })
                 })
             }
             if (url.includes('routes-with-stops')) {
                 return Promise.resolve({
                     ok: true,
                     json: async () => mockRoutes
                 })
             }
             return Promise.reject(new Error('Unknown URL'))
        })

        await act(async () => {
            render(
                <AppProvider>
                    <BookingWidget />
                </AppProvider>
            )
        })

        // Wait for routes to load
        await waitFor(() => {
            // Select From dropdown
            const fromSelect = screen.getByRole('combobox', { name: /from/i })
            expect(fromSelect).toBeInTheDocument()
            expect(screen.getByRole('option', { name: 'City A' })).toBeInTheDocument()
        })
    })

    it('enables destination dropdown after selecting origin', async () => {
         // Mock routes call specific
        (global.fetch as jest.Mock).mockImplementation((url) => {
             if (url.includes('org-branding')) {
                 return Promise.resolve({
                     ok: true,
                     json: async () => ({ orgLogoUrl: '/logo.png' })
                 })
             }
             if (url.includes('routes-with-stops')) {
                 return Promise.resolve({
                     ok: true,
                     json: async () => mockRoutes
                 })
             }
             return Promise.reject(new Error('Unknown URL'))
        })

        await act(async () => {
            render(
                <AppProvider>
                    <BookingWidget />
                </AppProvider>
            )
        })

        const fromSelect = await screen.findByRole('combobox', { name: /from/i })
        const toSelect = screen.getByRole('combobox', { name: /to/i })

        expect(toSelect).toBeDisabled()

        fireEvent.change(fromSelect, { target: { value: 'City A' } })

        expect(toSelect).not.toBeDisabled()
        // City B should be available because it's after City A
        expect(screen.getByRole('option', { name: 'City B' })).toBeInTheDocument()
    })
})
