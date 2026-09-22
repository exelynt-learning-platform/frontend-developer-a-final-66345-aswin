import { describe, expect, it } from 'vitest'
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../../api/employeeApi'

describe('Employee API', () => {

  it('should fetch all employees', async () => {
    const employees = await getEmployees()

    expect(employees).toHaveLength(2)
    expect(employees[0].name).toBe('John Doe')
    expect(employees[1].name).toBe('Jane Smith')
  })

  it('should fetch an employee by ID', async () => {
    const employee = await getEmployeeById('1')

    expect(employee).toEqual({
      id: '1',
      name: 'John Doe',
      mail: 'john@example.com',
      ph_no: '9876543210',
      country: 'USA',
      state: 'New York',
      city: 'jersey city',
    })
  })

  it('should create an employee', async () => {
    const employeeData = {
      name: 'David',
      mail: 'david@example.com',
      ph_no: '9876543212',
      country: 'England',
      state: 'London',
      city: 'camden town',
    }

    const employee = await createEmployee(employeeData)

    expect(employee).toMatchObject({
      id: '3',
      ...employeeData,
    })
  })

  it('should update an employee', async () => {
    const employeeData = {
      name: 'John Updated',
      mail: 'johnupdated@example.com',
      ph_no: '9876543213',
      country: 'India',
      state: 'Tamil Nadu',
      city: 'Coimbatore',
    }

    const employee = await updateEmployee('1', employeeData)

    expect(employee).toMatchObject({
      id: '1',
      ...employeeData,
    })
  })

  it('should delete an employee', async () => {
    const response = await deleteEmployee('1')

    expect(response).toEqual({
      id: '1',
    })
  })

  it('should throw an error when employee ID does not exist', async () => {
    await expect(
      getEmployeeById('999')
    ).rejects.toThrow()
  })

})