import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Dashboard from '../../pages/Dashboard'

const mockDispatch = vi.fn()

let mockEmpState = {
  employees: [
    {
      id: '1',
      name: 'Alice',
      mail: 'alice@example.com',
      ph_no: '1234567890',
      country: 'India',
      state: 'Tamil Nadu',
      city: 'Chennai',
    },
    {
      id: '2',
      name: 'Bob',
      mail: 'bob@example.com',
      ph_no: '9876543210',
      country: 'USA',
      state: 'California',
      city: 'San Francisco',
    }
  ],
  loading: false,
  error: null as string | null,
}

let mockCountryState = {
  country: [
    { id: '1', name: 'India' },
    { id: '2', name: 'USA' }
  ],
  loading: false,
  error: null as string | null,
}

interface MockDashboardStore {
  emp: typeof mockEmpState
  country: typeof mockCountryState
}

vi.mock('../../app/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: <T,>(selector: (state: MockDashboardStore) => T): T =>
    selector({
      emp: mockEmpState,
      country: mockCountryState,
    }),
}))

vi.mock('../../features/employees/employeeService', () => ({
  fetchEmployees: () => ({ type: 'employees/fetchEmployees' }),
}))

vi.mock('../../features/countries/countryService', () => ({
  fetchCountry: () => ({ type: 'country/fetchCountry' }),
}))

describe('Dashboard component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockEmpState = {
      employees: [
        {
          id: '1',
          name: 'Alice',
          mail: 'alice@example.com',
          ph_no: '1234567890',
          country: 'India',
          state: 'Tamil Nadu',
          city: 'Chennai',
        },
        {
          id: '2',
          name: 'Bob',
          mail: 'bob@example.com',
          ph_no: '9876543210',
          country: 'USA',
          state: 'California',
          city: 'San Francisco',
        }
      ],
      loading: false,
      error: null,
    }
    mockCountryState = {
      country: [
        { id: '1', name: 'India' },
        { id: '2', name: 'USA' }
      ],
      loading: false,
      error: null,
    }
  })

  it('renders dashboard with stats and greeting', () => {
    render(<Dashboard />)
    expect(screen.getByText(/Admin! 👋/)).toBeInTheDocument()
    expect(screen.getByText('Total Employees')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Countries')).toBeInTheDocument()
  })

  it('renders loader when loading is true', () => {
    mockEmpState.loading = true
    render(<Dashboard />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders error message and retries on click', () => {
    mockEmpState.error = 'Failed to load employees'
    render(<Dashboard />)
    expect(screen.getByText('Failed to load employees')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /retry/i }))
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'employees/fetchEmployees' })
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'country/fetchCountry' })
  })

  it('renders donut chart with 12 oclock rotation', () => {
    const { container } = render(<Dashboard />)
    const rotatedGroup = container.querySelector('g[transform="rotate(-90 50 50)"]')
    expect(rotatedGroup).toBeInTheDocument()
  })

  it('allows hovering monthly bar columns to show tooltip', () => {
    render(<Dashboard />)
    const janBar = screen.getByText('Jan')
    fireEvent.mouseEnter(janBar.parentElement!)
    expect(screen.getByText(/Employees/)).toBeInTheDocument()
  })
})
