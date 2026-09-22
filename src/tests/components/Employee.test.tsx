import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import EmployeeTable from '../../components/employee/EmployeeTable'
import type { Employee } from '../../types/employee'
import type { Country } from '../../types/country'

const mockDispatch = vi.fn()

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    mail: 'john@example.com',
    ph_no: '9876543210',
    country: 'India',
    state: 'Tamil Nadu',
    city: 'Madurai',
  },
  {
    id: '2',
    name: 'Jane Smith',
    mail: 'jane@example.com',
    ph_no: '9876543211',
    country: 'USA',
    state: 'California',
    city: 'San Francisco',
  },
]

const mockCountries: Country[] = [
  { id: '1', name: 'India' },
  { id: '2', name: 'USA' }
]

interface MockStoreState {
  emp: {
    employees: Employee[]
    loading: boolean
    error: string | null
    deleteError: string | null
    selectedEmployee: Employee | null
    searchResult: Employee | null
  }
  country: {
    country: Country[]
  }
}

let mockState: MockStoreState = {
  emp: {
    employees: mockEmployees,
    loading: false,
    error: null,
    deleteError: null,
    selectedEmployee: null,
    searchResult: null,
  },
  country: {
    country: mockCountries,
  }
}

vi.mock('../../app/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: <T,>(selector: (state: MockStoreState) => T): T => selector(mockState),
}))

vi.mock('../../features/employees/employeeService', () => ({
  deleteEmployees: (id: string) => ({
    type: 'employee/deleteEmployee',
    payload: id,
    unwrap: () => Promise.resolve(id),
  }),
  fetchEmployees: () => ({
    type: 'employee/fetchEmployees',
  }),
}))

vi.mock('../../features/employees/employeeSlice', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('../../features/employees/employeeSlice')
  return {
    ...actual,
    clearDeleteError: () => ({ type: 'employee/clearDeleteError' }),
  }
})

describe('EmployeeTable component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockState = {
      emp: {
        employees: [...mockEmployees],
        loading: false,
        error: null,
        deleteError: null,
        selectedEmployee: null,
        searchResult: null,
      },
      country: {
        country: mockCountries,
      }
    }
  })

  it('renders employees and table headers', () => {
    render(
      <MemoryRouter>
        <EmployeeTable />
      </MemoryRouter>
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('9876543210')).toBeInTheDocument()
    expect(screen.getByText('India')).toBeInTheDocument()
  })

  it('renders loading loader state', () => {
    mockState.emp.loading = true
    render(
      <MemoryRouter>
        <EmployeeTable />
      </MemoryRouter>
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders error state and retries on button click', async () => {
    const user = userEvent.setup()
    mockState.emp.error = 'Failed to fetch employee details.'

    render(
      <MemoryRouter>
        <EmployeeTable />
      </MemoryRouter>
    )

    expect(screen.getByText('Failed to fetch employee details.')).toBeInTheDocument()
    const retryBtn = screen.getByRole('button', { name: /retry/i })
    await user.click(retryBtn)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'employee/fetchEmployees',
    })
  })

  it('renders empty state when employee list is empty', async () => {
    const user = userEvent.setup()
    mockState.emp.employees = []

    render(
      <MemoryRouter>
        <EmployeeTable />
      </MemoryRouter>
    )

    expect(screen.getByText('Employee not found')).toBeInTheDocument()
    const retryBtn = screen.getByRole('button', { name: /retry/i })
    await user.click(retryBtn)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'employee/fetchEmployees',
    })
  })

  it('filters employees by search term', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <EmployeeTable />
      </MemoryRouter>
    )

    const searchInput = screen.getByPlaceholderText(/Search by ID, name, email or mobile/i)
    await user.type(searchInput, 'Jane')

    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
  })

  it('filters employees by country selection', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <EmployeeTable />
      </MemoryRouter>
    )

    const countrySelect = screen.getByLabelText('Filter by country')
    await user.selectOptions(countrySelect, 'USA')

    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
  })

  it('toggles select all checkboxes and row checkbox', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <EmployeeTable />
      </MemoryRouter>
    )

    const selectAllCheckbox = screen.getByLabelText('Select all employees')
    expect(selectAllCheckbox).not.toBeChecked()

    await user.click(selectAllCheckbox)
    expect(selectAllCheckbox).toBeChecked()

    await user.click(selectAllCheckbox)
    expect(selectAllCheckbox).not.toBeChecked()

    const singleRowCheckbox = screen.getByLabelText('Select employee John Doe')
    await user.click(singleRowCheckbox)
    expect(singleRowCheckbox).toBeChecked()
  })

  it('opens DeleteDialog confirmation and deletes employee on confirm', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <EmployeeTable />
      </MemoryRouter>
    )

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })
    await user.click(deleteButtons[0])

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Delete Employee')).toBeInTheDocument()
    expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument()

    // Click confirm Delete in dialog
    const dialogDeleteButtons = screen.getAllByRole('button', { name: 'Delete' })
    await user.click(dialogDeleteButtons[dialogDeleteButtons.length - 1])

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'employee/deleteEmployee',
      payload: '1',
    })
  })

  it('cancels DeleteDialog without dispatching delete', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <EmployeeTable />
      </MemoryRouter>
    )

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })
    await user.click(deleteButtons[0])

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)

    expect(mockDispatch).not.toHaveBeenCalledWith({
      type: 'employee/deleteEmployee',
      payload: '1',
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('navigates to edit and view routes when action buttons are clicked', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/employees']}>
        <Routes>
          <Route path="/employees" element={<EmployeeTable />} />
          <Route path="/employees/edit/:id" element={<div>Edit Page</div>} />
          <Route path="/employees/:id" element={<div>View Page</div>} />
        </Routes>
      </MemoryRouter>
    )

    const editButtons = screen.getAllByRole('button', { name: 'Edit' })
    await user.click(editButtons[0])
    expect(screen.getByText('Edit Page')).toBeInTheDocument()
  })
})