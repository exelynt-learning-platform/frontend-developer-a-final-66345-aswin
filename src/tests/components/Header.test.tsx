import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../../components/layout/Header'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

describe('Header component', () => {
  it('renders search input and action buttons', () => {
    render(<Header />)
    expect(screen.getByPlaceholderText(/Search employees by name/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument()
  })

  it('navigates to /employees?search= when search form is submitted', () => {
    render(<Header />)
    const input = screen.getByPlaceholderText(/Search employees by name/i)
    fireEvent.change(input, { target: { value: 'Alice' } })
    fireEvent.submit(input.closest('form')!)
    expect(mockNavigate).toHaveBeenCalledWith('/employees?search=Alice')
  })

  it('does not navigate when search input is empty', () => {
    mockNavigate.mockClear()
    render(<Header />)
    const input = screen.getByPlaceholderText(/Search employees by name/i)
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.submit(input.closest('form')!)
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
