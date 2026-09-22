import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import EmployeeForm from '../../components/employee/EmployeeForm'
import type { employee } from '../../types/employee'

interface MockThunkPromise<T> extends Promise<T> {
  unwrap: () => Promise<T>
}

const createMockThunkPromise = <T,>(data: T): MockThunkPromise<T> => {
  const promise = Promise.resolve(data) as MockThunkPromise<T>
  promise.unwrap = () => Promise.resolve(data)
  return promise
}

const mockDispatch = vi.fn(() =>
  createMockThunkPromise({
    type: 'employee/createEmployee/fulfilled'
  })
)

let mockEmployeeState: {
  selectedEmployee: employee | null
  loading: boolean
  error: string | null
} = {
  selectedEmployee: null,
  loading: false,
  error: null,
}

let mockCountryState = {
  country: [
    { id: '1', name: 'India' },
    { id: '2', name: 'USA' },
    { id: '3', name: 'UK' },
  ],
  loading: false,
  error: null,
}

vi.mock('../../app/hooks', () => ({
  useAppDispatch: () => mockDispatch,

  useAppSelector: (selector: any) =>
    selector({
      emp: mockEmployeeState,
      country: mockCountryState,
    }),
}))

vi.mock('../../features/employees/employeeService', () => ({
  fetchEmployeeById: (id: string) => ({
    type: 'employee/fetchEmployeeById',
    payload: id,
  }),

  createEmployees: (data: any) => ({
    type: 'employee/createEmployee',
    payload: data,
  }),

  updateEmployees: (data: any) => ({
    type: 'employee/updateEmployee',
    payload: data,
  }),
}))

vi.mock('../../features/countries/countryService', () => ({
  fetchCountry: () => ({
    type: 'country/fetchCountry',
  }),
}))

describe('EmployeeForm validation', () => {

  beforeEach(() => {
    vi.clearAllMocks()

    mockEmployeeState = {
      selectedEmployee: null,
      loading: false,
      error: null,
    }

    mockCountryState = {
      country: [
        { id: '1', name: 'India' },
        { id: '2', name: 'USA' },
        { id: '3', name: 'UK' },
      ],
      loading: false,
      error: null,
    }
  })

  it('should display required validation errors when form is submitted empty', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <EmployeeForm />
      </MemoryRouter>
    )

    const submitButton = screen.getByRole('button', {
      name: 'Add Employee',
    })

    await user.click(submitButton)

    expect(
      screen.getByText('Name is required')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Email is required')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Mobile number is required')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Country is required')
    ).toBeInTheDocument()

    expect(
      screen.getByText('State is required')
    ).toBeInTheDocument()

    expect(
      screen.getByText('City is required')
    ).toBeInTheDocument()
  })

  it('should display email validation error for invalid email', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <EmployeeForm />
      </MemoryRouter>
    )

    const emailInput = screen.getByPlaceholderText(
      'Enter the employee mail'
    )

    await user.type(
      emailInput,
      'invalid-email'
    )

    const submitButton = screen.getByRole('button', {
      name: 'Add Employee',
    })

    await user.click(submitButton)

    /*
      Other required fields are intentionally empty.
      We only verify that the mail validation
      message appears.
    */
    expect(
      screen.getByText('Please enter a valid email address')
    ).toBeInTheDocument()
  })

  it('should display mobile validation error for invalid phone number', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <EmployeeForm />
      </MemoryRouter>
    )

    const phoneInput = screen.getByPlaceholderText(
      'Enter the employee mobile'
    )

    await user.type(
      phoneInput,
      '123'
    )

    const submitButton = screen.getByRole('button', {
      name: 'Add Employee',
    })

    await user.click(submitButton)

    expect(
      screen.getByText('Mobile must be 10 digits')
    ).toBeInTheDocument()
  })

  it('should accept a valid employee form', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <EmployeeForm />
      </MemoryRouter>
    )

    const nameInput = screen.getByPlaceholderText(
      'Enter the employee name'
    )

    const emailInput = screen.getByPlaceholderText(
      'Enter the employee mail'
    )

    const phoneInput = screen.getByPlaceholderText(
      'Enter the employee mobile'
    )

    const stateInput = screen.getByPlaceholderText(
      'Enter the employee state'
    )

    const cityInput = screen.getByPlaceholderText(
      'Enter the employee city'
    )

    const countrySelect = screen.getByRole('combobox')

    await user.type(
      nameInput,
      'David'
    )

    await user.type(
      emailInput,
      'david@example.com'
    )

    await user.type(
      phoneInput,
      '9876543212'
    )

    await user.selectOptions(
      countrySelect,
      'India'
    )

    await user.type(
      stateInput,
      'Tamil Nadu'
    )

    await user.type(
      cityInput,
      'Chennai'
    )

    const submitButton = screen.getByRole('button', {
      name: 'Add Employee',
    })

    await user.click(submitButton)

    /*
      If the form is valid, required validation
      messages should not be displayed.
    */
    expect(
      screen.queryByText('Name is required')
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText('Please enter a valid email address')
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText('Mobile must be 10 digits')
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText('Country is required')
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText('State is required')
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText('City is required')
    ).not.toBeInTheDocument()
  })

  it('should dispatch create employee when valid form is submitted', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <EmployeeForm />
      </MemoryRouter>
    )

    await user.type(
      screen.getByPlaceholderText('Enter the employee name'),
      'John'
    )

    await user.type(
      screen.getByPlaceholderText('Enter the employee mail'),
      'john@example.com'
    )

    await user.type(
      screen.getByPlaceholderText('Enter the employee mobile'),
      '9876543210'
    )

    await user.selectOptions(
      screen.getByRole('combobox'),
      'India'
    )

    await user.type(
      screen.getByPlaceholderText('Enter the employee state'),
      'Tamil Nadu'
    )

    await user.type(
      screen.getByPlaceholderText('Enter the employee city'),
      'Madurai'
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Add Employee',
      })
    )

    expect(mockDispatch).toHaveBeenCalled()

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'employee/createEmployee',
      })
    )
  })


  it('should dispatch fetch employee when editing an employee', async () => {
    mockEmployeeState = {
      selectedEmployee: null,
      loading: false,
      error: null,
    }

    render(
      <MemoryRouter initialEntries={['/employees/edit/1']}>
        <Routes>
          <Route
            path="/employees/edit/:id"
            element={<EmployeeForm />}
          />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'employee/fetchEmployeeById',
          payload: '1',
        })
      )
    })
  })

  it('should pre-populate employee data in edit mode', async () => {
    mockEmployeeState = {
      selectedEmployee: {
        id: '1',
        name: 'David',
        mail: 'david@example.com',
        ph_no: '9876543210',
        country: 'India',
        state: 'Tamil Nadu',
        city: 'Chennai',
      },
      loading: false,
      error: null,
    }

    render(
      <MemoryRouter initialEntries={['/employees/edit/1']}>
        <Routes>
          <Route
            path="/employees/edit/:id"
            element={<EmployeeForm />}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByText('Edit Employee')
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(
        screen.getByDisplayValue('David')
      ).toBeInTheDocument()

      expect(
        screen.getByDisplayValue('david@example.com')
      ).toBeInTheDocument()

      expect(
        screen.getByDisplayValue('9876543210')
      ).toBeInTheDocument()

      expect(
        screen.getByDisplayValue('Tamil Nadu')
      ).toBeInTheDocument()

      expect(
        screen.getByDisplayValue('Chennai')
      ).toBeInTheDocument()

      expect(
        screen.getByRole('combobox')
      ).toHaveValue('India')
    })
  })
})