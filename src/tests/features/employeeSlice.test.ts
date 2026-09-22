import { describe, expect, it } from 'vitest'
import employeeReducer from '../../features/employees/employeeSlice'
import {
  fetchEmployees,
  fetchEmployeeById,
  createEmployees,
  updateEmployees,
  deleteEmployees,
} from '../../features/employees/employeeService'

const employee1 = {
  id: '1',
  name: 'John Doe',
  mail: 'john@example.com',
  ph_no: '9876543210',
  country: 'USA',
  state: 'New York',
  city: 'jersey city',
}

const employee2 = {
  id: '2',
  name: 'Jane Smith',
  mail: 'jane@example.com',
  ph_no: '9876543211',
  country: 'England',
  state: 'London',
  city: 'camden town',
}

describe('employeeSlice', () => {

  it('should handle fetchEmployees.pending', () => {
    const state = employeeReducer(
      undefined,
      fetchEmployees.pending('request-id', undefined)
    )

    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('should handle fetchEmployees.fulfilled', () => {
    const state = employeeReducer(
      undefined,
      fetchEmployees.fulfilled(
        [employee1, employee2],
        'request-id',
        undefined
      )
    )

    expect(state.loading).toBe(false)
    expect(state.employees).toEqual([employee1, employee2])
  })

  it('should handle fetchEmployees.rejected', () => {
    const state = employeeReducer(
      undefined,
      fetchEmployees.rejected(
        new Error('API failed'),
        'request-id',
        undefined,
        'Failed to fetch employees'
      )
    )

    expect(state.loading).toBe(false)
    expect(state.error).toBe('Failed to fetch employees')
  })

  it('should handle fetchEmployeeById.fulfilled', () => {
    const state = employeeReducer(
      undefined,
      fetchEmployeeById.fulfilled(
        employee1,
        'request-id',
        '1'
      )
    )

    expect(state.loading).toBe(false)
    expect(state.selectedEmployee).toEqual(employee1)
    expect(state.searchResult).toEqual(employee1)
  })

  it('should add an employee when createEmployees.fulfilled', () => {
    const initialState = employeeReducer(
      undefined,
      fetchEmployees.fulfilled(
        [employee1],
        'request-id',
        undefined
      )
    )

    const state = employeeReducer(
      initialState,
      createEmployees.fulfilled(
        employee2,
        'request-id',
        {
          name: employee2.name,
          mail: employee2.mail,
          ph_no: employee2.ph_no,
          country: employee2.country,
          state: employee2.state,
          city: employee2.city,
        }
      )
    )

    expect(state.loading).toBe(false)
    expect(state.employees).toEqual([
      employee1,
      employee2,
    ])
  })

  it('should update an employee when updateEmployees.fulfilled', () => {
    const initialState = employeeReducer(
      undefined,
      fetchEmployees.fulfilled(
        [employee1, employee2],
        'request-id',
        undefined
      )
    )

    const updatedEmployee = {
      ...employee1,
      name: 'John Updated',
      mail: 'johnupdated@example.com',
    }

    const state = employeeReducer(
      initialState,
      updateEmployees.fulfilled(
        updatedEmployee,
        'request-id',
        {
          id: '1',
          data: {
            name: updatedEmployee.name,
            mail: updatedEmployee.mail,
            ph_no: updatedEmployee.ph_no,
            country: updatedEmployee.country,
            state: updatedEmployee.state,
            city: updatedEmployee.city,
          },
        }
      )
    )

    expect(state.loading).toBe(false)
    expect(state.employees).toEqual([
      updatedEmployee,
      employee2,
    ])
  })

  it('should delete an employee when deleteEmployees.fulfilled', () => {
    const initialState = employeeReducer(
      undefined,
      fetchEmployees.fulfilled(
        [employee1, employee2],
        'request-id',
        undefined
      )
    )

    const state = employeeReducer(
      initialState,
      deleteEmployees.fulfilled(
        '1',
        'request-id',
        '1'
      )
    )

    expect(state.loading).toBe(false)
    expect(state.employees).toEqual([employee2])
  })

  it('should clear the error', () => {
    const stateWithError = employeeReducer(
      undefined,
      fetchEmployees.rejected(
        new Error('API failed'),
        'request-id',
        undefined,
        'Something went wrong'
      )
    )

    const state = employeeReducer(
      stateWithError,
      {
        type: 'employee/clearError',
      }
    )

    expect(state.error).toBeNull()
  })

  it('should clear the selected employee', () => {
    const stateWithEmployee = employeeReducer(
      undefined,
      fetchEmployeeById.fulfilled(
        employee1,
        'request-id',
        '1'
      )
    )

    const state = employeeReducer(
      stateWithEmployee,
      {
        type: 'employee/clearSelectedEmployee',
      }
    )

    expect(state.selectedEmployee).toBeNull()
  })

  it('should clear the search result', () => {
    const stateWithResult = employeeReducer(
      undefined,
      fetchEmployeeById.fulfilled(
        employee1,
        'request-id',
        '1'
      )
    )

    const state = employeeReducer(
      stateWithResult,
      {
        type: 'employee/clearSearchResult',
      }
    )

    expect(state.searchResult).toBeNull()
  })

  it('should handle fetchEmployeeById.pending', () => {
    const state = employeeReducer(
      undefined,
      fetchEmployeeById.pending('request-id', '1')
    )
    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
    expect(state.searchResult).toBeNull()
  })

  it('should handle fetchEmployeeById.rejected', () => {
    const state = employeeReducer(
      undefined,
      fetchEmployeeById.rejected(new Error('Failed'), 'request-id', '1', 'Failed to fetch employee')
    )
    expect(state.loading).toBe(false)
    expect(state.selectedEmployee).toBeNull()
    expect(state.error).toBe('Failed to fetch employee')
  })

  it('should handle createEmployees.pending', () => {
    const state = employeeReducer(
      undefined,
      createEmployees.pending('request-id', {
        name: 'Test',
        mail: 'test@example.com',
        ph_no: '1234567890',
        country: 'India',
        state: 'TN',
        city: 'Chennai'
      })
    )
    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('should handle createEmployees.rejected', () => {
    const state = employeeReducer(
      undefined,
      createEmployees.rejected(new Error('Failed'), 'request-id', {
        name: 'Test',
        mail: 'test@example.com',
        ph_no: '1234567890',
        country: 'India',
        state: 'TN',
        city: 'Chennai'
      }, 'Failed to create employee')
    )
    expect(state.loading).toBe(false)
    expect(state.error).toBe('Failed to create employee')
  })

  it('should handle updateEmployees.pending', () => {
    const state = employeeReducer(
      undefined,
      updateEmployees.pending('request-id', { id: '1', data: { name: 'Test', mail: 't@e.com', ph_no: '1234567890', country: 'IN', state: 'TN', city: 'CH' } })
    )
    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('should handle updateEmployees.rejected', () => {
    const state = employeeReducer(
      undefined,
      updateEmployees.rejected(new Error('Failed'), 'request-id', { id: '1', data: { name: 'Test', mail: 't@e.com', ph_no: '1234567890', country: 'IN', state: 'TN', city: 'CH' } }, 'Failed to update employee')
    )
    expect(state.loading).toBe(false)
    expect(state.error).toBe('Failed to update employee')
  })

  it('should handle deleteEmployees.pending', () => {
    const state = employeeReducer(
      undefined,
      deleteEmployees.pending('request-id', '1')
    )
    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('should handle deleteEmployees.rejected', () => {
    const state = employeeReducer(
      undefined,
      deleteEmployees.rejected(new Error('Failed'), 'request-id', '1', 'Failed to delete employee')
    )
    expect(state.loading).toBe(false)
    expect(state.error).toBe('Failed to delete employee')
  })

})