import { createAsyncThunk } from "@reduxjs/toolkit"
import { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee } from '../../api/employeeApi'
import type { employee, emp_formData } from "../../types/employee"
import { ERROR_MESSAGE } from "../../constants/CentralizedErrorMessage"

export const fetchEmployees = createAsyncThunk<employee[], void, { rejectValue: string }>('employees/fetchEmployees', async (_, { rejectWithValue }) => {
    try {
        const employees = await getEmployees()
        return employees
    }
    catch {
        return rejectWithValue(ERROR_MESSAGE.Employee.FETCH_ALL_FAILED)
    }
})

export const fetchEmployeeById = createAsyncThunk<employee, string, { rejectValue: string }>('employees/fetchEmployeeById', async (id, { rejectWithValue }) => {
    try {
        const employeeId = await getEmployeeById(id)
        return employeeId
    }
    catch {
        return rejectWithValue(ERROR_MESSAGE.Employee.FETCH_BY_ID_FAILED)
    }
})

export const createEmployees = createAsyncThunk<employee, emp_formData, { rejectValue: string }>('employees/createEmployee', async (data, { rejectWithValue }) => {
    try {
        const addEmployee = await createEmployee(data)
        return addEmployee
    }
    catch {
        return rejectWithValue(ERROR_MESSAGE.Employee.CREATE_FAILED)
    }
})

export const updateEmployees = createAsyncThunk<employee, { id: string, data: emp_formData }, { rejectValue: string }>('employees/updateEmployee', async ({ id, data }, { rejectWithValue }) => {
    try {
        const modifyEmployee = await updateEmployee(id, data)
        return modifyEmployee
    }
    catch {
        return rejectWithValue(ERROR_MESSAGE.Employee.UPDATE_FAILED)
    }
})

export const deleteEmployees = createAsyncThunk<employee, string, { rejectValue: string }>('employees/deleteEmployee', async (id, { rejectWithValue }) => {
    try {
        const removeEmployee = await deleteEmployee(id)
        return (removeEmployee && removeEmployee.id) ? removeEmployee : ({ id, ...(removeEmployee || {}) } as employee)
    }
    catch {
        return rejectWithValue(ERROR_MESSAGE.Employee.DELETE_FAILED)
    }
})