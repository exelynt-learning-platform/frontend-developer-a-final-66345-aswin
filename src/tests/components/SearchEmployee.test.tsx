import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import SearchEmployee from '../../pages/SearchEmployee'
import type { employee } from '../../types/employee'

const mockDispatch = vi.fn()

let mockEmployeeState: {
  searchResult: employee | null
  loading: boolean
  error: string | null
} = {
  searchResult: null,
  loading: false,
  error: null,
}

interface MockSearchStore {
  emp: typeof mockEmployeeState
}

vi.mock('../../app/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: <T,>(selector: (state: MockSearchStore) => T): T =>
    selector({
      emp: mockEmployeeState,
    }),
}))

vi.mock('../../features/employees/employeeService', () => ({
  fetchEmployeeById: (id: string) => ({
    type: 'employee/fetchEmployeeById',
    payload: id,
  }),
}))

vi.mock('../../features/employees/employeeSlice', () => ({
  clearSearchResult: () => ({
    type: 'employee/clearSearchResult',
  }),
  clearError: () => ({
    type: 'employee/clearError',
  }),
}))

describe('SearchEmployee', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockEmployeeState = {
      searchResult: null,
      loading: false,
      error: null,
    }
  })

  it('should display initial search message', () => {
    render(
      <MemoryRouter>
        <SearchEmployee />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Enter an employee ID to search')
    ).toBeInTheDocument()
  })

  it('should search employee by ID', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <SearchEmployee />
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText('search employee')

    await user.type(input, '5')

    await user.click(
      screen.getByRole('button', { name: /search/i })
    )

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'employee/fetchEmployeeById',
      payload: '5',
    })
  })

  it('should not search when ID is empty', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <SearchEmployee />
      </MemoryRouter>
    )

    await user.click(
      screen.getByRole('button', { name: /search/i })
    )

    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('should display employee search result', () => {
    mockEmployeeState = {
      searchResult: {
        id: '5',
        name: 'David',
        mail: 'david@example.com',
        ph_no: '9876543212',
        country: 'India',
        state: 'Tamil Nadu',
        city: 'Chennai',
      },
      loading: false,
      error: null,
    }

    render(
      <MemoryRouter>
        <SearchEmployee />
      </MemoryRouter>
    )

    expect(screen.getByText('David')).toBeInTheDocument()
    expect(screen.getByText('david@example.com')).toBeInTheDocument()
    expect(screen.getByText('9876543212')).toBeInTheDocument()
    expect(screen.getByText('India')).toBeInTheDocument()
  })

  it('should display error message when search fails', () => {
    mockEmployeeState = {
      searchResult: null,
      loading: false,
      error: 'Employee not found',
    }

    render(
      <MemoryRouter>
        <SearchEmployee />
      </MemoryRouter>
    )

    expect(screen.getByText('Employee not found')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /retry/i })
    ).toBeInTheDocument()
  })

  it('should display loader while searching', () => {
    mockEmployeeState = {
      searchResult: null,
      loading: true,
      error: null,
    }

    render(
      <MemoryRouter>
        <SearchEmployee />
      </MemoryRouter>
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should clear search input and result', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <SearchEmployee />
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText('search employee')

    await user.type(input, '5')

    await user.click(
      screen.getByRole('button', { name: /clear/i })
    )

    expect(input).toHaveValue('')

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'employee/clearSearchResult',
    })

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'employee/clearError',
    })
  })

  it('should display error message and retry button when an active search fails', async () => {
    const user = userEvent.setup()
    mockEmployeeState = {
      searchResult: null,
      loading: false,
      error: 'Network connection failed',
    }

    render(
      <MemoryRouter>
        <SearchEmployee />
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText('search employee')
    await user.type(input, '99')
    await user.click(screen.getByRole('button', { name: /search/i }))

    expect(screen.getByText('Network connection failed')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    expect(screen.queryByText(/No Employee Found/i)).not.toBeInTheDocument()
  })
})