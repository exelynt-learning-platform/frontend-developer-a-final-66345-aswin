import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
  fetchEmployees,
  fetchEmployeeById,
  createEmployees,
  updateEmployees,
  deleteEmployees,
} from '../../features/employees/employeeService'
import * as employeeApi from '../../api/employeeApi'

vi.mock('../../api/employeeApi')

const mockEmployee = {
  id: '1',
  name: 'John Doe',
  mail: 'john@example.com',
  ph_no: '1234567890',
  country: 'USA',
  state: 'NY',
  city: 'NYC',
}

describe('employeeService thunks', () => {
  const dispatch = vi.fn()
  const getState = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchEmployees returns employee list on success', async () => {
    vi.mocked(employeeApi.getEmployees).mockResolvedValueOnce([mockEmployee])

    const thunk = fetchEmployees()
    const result = await thunk(dispatch, getState, undefined)

    expect(result.type).toBe('employees/fetchEmployees/fulfilled')
    expect(result.payload).toEqual([mockEmployee])
  })

  it('fetchEmployees returns rejectWithValue on failure', async () => {
    vi.mocked(employeeApi.getEmployees).mockRejectedValueOnce(new Error('Network Error'))

    const thunk = fetchEmployees()
    const result = await thunk(dispatch, getState, undefined)

    expect(result.type).toBe('employees/fetchEmployees/rejected')
    expect(result.payload).toBe('Network Error')
  })

  it('fetchEmployeeById returns single employee on success', async () => {
    vi.mocked(employeeApi.getEmployeeById).mockResolvedValueOnce(mockEmployee)

    const thunk = fetchEmployeeById('1')
    const result = await thunk(dispatch, getState, undefined)

    expect(result.type).toBe('employees/fetchEmployeeById/fulfilled')
    expect(result.payload).toEqual(mockEmployee)
  })

  it('fetchEmployeeById returns rejectWithValue on failure', async () => {
    vi.mocked(employeeApi.getEmployeeById).mockRejectedValueOnce({
      response: { data: { message: 'Employee not found' } }
    })

    const thunk = fetchEmployeeById('99')
    const result = await thunk(dispatch, getState, undefined)

    expect(result.type).toBe('employees/fetchEmployeeById/rejected')
    expect(result.payload).toBe('Employee not found')
  })

  it('createEmployees returns new employee on success', async () => {
    vi.mocked(employeeApi.createEmployee).mockResolvedValueOnce(mockEmployee)

    const thunk = createEmployees(mockEmployee)
    const result = await thunk(dispatch, getState, undefined)

    expect(result.type).toBe('employees/createEmployee/fulfilled')
    expect(result.payload).toEqual(mockEmployee)
  })

  it('createEmployees returns rejectWithValue on failure', async () => {
    vi.mocked(employeeApi.createEmployee).mockRejectedValueOnce(new Error('Validation error'))

    const thunk = createEmployees(mockEmployee)
    const result = await thunk(dispatch, getState, undefined)

    expect(result.type).toBe('employees/createEmployee/rejected')
    expect(result.payload).toBe('Validation error')
  })

  it('updateEmployees returns updated employee on success', async () => {
    vi.mocked(employeeApi.updateEmployee).mockResolvedValueOnce(mockEmployee)

    const thunk = updateEmployees({ id: '1', data: mockEmployee })
    const result = await thunk(dispatch, getState, undefined)

    expect(result.type).toBe('employees/updateEmployee/fulfilled')
    expect(result.payload).toEqual(mockEmployee)
  })

  it('updateEmployees returns rejectWithValue on failure', async () => {
    vi.mocked(employeeApi.updateEmployee).mockRejectedValueOnce(new Error('Update failed'))

    const thunk = updateEmployees({ id: '1', data: mockEmployee })
    const result = await thunk(dispatch, getState, undefined)

    expect(result.type).toBe('employees/updateEmployee/rejected')
    expect(result.payload).toBe('Update failed')
  })

  it('deleteEmployees returns id on success', async () => {
    vi.mocked(employeeApi.deleteEmployee).mockResolvedValueOnce({ id: '1' })

    const thunk = deleteEmployees('1')
    const result = await thunk(dispatch, getState, undefined)

    expect(result.type).toBe('employees/deleteEmployee/fulfilled')
    expect(result.payload).toBe('1')
  })

  it('deleteEmployees returns rejectWithValue on failure', async () => {
    vi.mocked(employeeApi.deleteEmployee).mockRejectedValueOnce(new Error('Delete forbidden'))

    const thunk = deleteEmployees('1')
    const result = await thunk(dispatch, getState, undefined)

    expect(result.type).toBe('employees/deleteEmployee/rejected')
    expect(result.payload).toBe('Delete forbidden')
  })
})
