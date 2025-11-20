import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Hero from '../Hero'

describe('Hero', () => {
  it('renders heading and subtext', () => {
    render(<Hero />)
 
    const heading = screen.getByRole('heading', { level: 1 })
    const text = screen.getByText(/Book bus tickets across Southern Africa with ease./i)
 
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Travel Made Simple.')
    expect(text).toBeInTheDocument()
  })
})
