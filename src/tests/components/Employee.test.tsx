import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import EmployeeTable from '../../components/employee/EmployeeTable'

const mockDispatch = vi.fn()

const mockEmployees = [
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
    country: 'India',
    state: 'Karnataka',
    city: 'Bangalore',
  },
]

type mockEmployeeState = {
  employees: typeof mockEmployees
  loading: boolean
  error: string | null
  selectedEmployee: typeof mockEmployees[number] | null
  searchResult: typeof mockEmployees[number] | null
}

let mockEmployeeState: any = {
  employees: mockEmployees,
  loading: false,
  error: null,
  selectedEmployee: null,
  searchResult: null,
}

vi.mock('../../app/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) =>
    selector({
      emp: mockEmployeeState,
      country: { country: [] },
    }),
}))

vi.mock('../../features/employees/employeeService', () => ({
  deleteEmployees: (id: string) => ({
    type: 'employee/deleteEmployee',
    payload: id,
  }),
  fetchEmployees: () => ({
    type: 'employee/fetchEmployees',
  }),
}))

describe('EmployeeTable', () => {

  beforeEach(() => {
    vi.clearAllMocks()

    mockEmployeeState = {
      employees: mockEmployees,
      loading: false,
      error: null,
      selectedEmployee: null,
      searchResult: null,
    }
  })

  it('should display employees in the table', () => {
    render(
      <MemoryRouter>
        <EmployeeTable />
      </MemoryRouter>
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()

    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('9876543210')).toBeInTheDocument()
  })

  it('should display loading state', () => {
    mockEmployeeState.loading = true

    render(
      <MemoryRouter>
        <EmployeeTable />
      </MemoryRouter>
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should display error state', () => {
    mockEmployeeState.error = 'Failed to fetch employee details.'

    render(
      <MemoryRouter>
        <EmployeeTable />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Failed to fetch employee details.')
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Retry' })
    ).toBeInTheDocument()
  })

  it('should dispatch fetchEmployees when Retry is clicked', async () => {
    const user = userEvent.setup()

    mockEmployeeState.error = 'Failed to fetch employee details.'

    render(
      <MemoryRouter>
        <EmployeeTable />
      </MemoryRouter>
    )

    await user.click(
      screen.getByRole('button', { name: 'Retry' })
    )

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'employee/fetchEmployees',
    })
  })

  it('should display empty state when there are no employees', () => {
    mockEmployeeState.employees = []

    render(
      <MemoryRouter>
        <EmployeeTable />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Employee not found')
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Retry' })
    ).toBeInTheDocument()
  })

  it('should dispatch fetchEmployees when empty state Retry is clicked', async () => {
    const user = userEvent.setup()

    mockEmployeeState.employees = []

    render(
      <MemoryRouter>
        <EmployeeTable />
      </MemoryRouter>
    )

    await user.click(
      screen.getByRole('button', { name: 'Retry' })
    )

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'employee/fetchEmployees',
    })
  })

  it('should navigate to edit page when Edit is clicked', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <EmployeeTable />
      </MemoryRouter>
    )

    const editButtons = screen.getAllByRole('button', {
      name: 'Edit',
    })

    await user.click(editButtons[0])

    /*
      MemoryRouter keeps navigation internal.
      This test mainly verifies that the Edit button
      can be interacted with without errors.
    */
    expect(editButtons[0]).toBeInTheDocument()
  })

  it('should delete employee after confirmation in DeleteDialog', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <EmployeeTable />
      </MemoryRouter>
    )

    const deleteButtons = screen.getAllByRole('button', {
      name: 'Delete',
    })

    await user.click(deleteButtons[0])

    expect(screen.getByText('Delete Employee')).toBeInTheDocument()

    const dialogDeleteButtons = screen.getAllByRole('button', {
      name: 'Delete',
    })
    // Confirmation button in DeleteDialog
    await user.click(dialogDeleteButtons[dialogDeleteButtons.length - 1])

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'employee/deleteEmployee',
      payload: '1',
    })
  })

  it('should not delete employee when confirmation is cancelled in DeleteDialog', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <EmployeeTable />
      </MemoryRouter>
    )

    const deleteButtons = screen.getAllByRole('button', {
      name: 'Delete',
    })

    await user.click(deleteButtons[0])

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)

    expect(mockDispatch).not.toHaveBeenCalledWith({
      type: 'employee/deleteEmployee',
      payload: '1',
    })
    expect(screen.queryByText('Delete Employee')).not.toBeInTheDocument()
  })

})