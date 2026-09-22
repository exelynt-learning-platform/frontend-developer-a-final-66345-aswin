import { createAsyncThunk } from "@reduxjs/toolkit"
import { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee } from '../../api/employeeApi'
import type { Employee, EmployeeFormData } from "../../types/employee"
import { ERROR_MESSAGE } from "../../constants/CentralizedErrorMessage"
import { extractErrorMessage } from "../../utils/errorUtils"

export const fetchEmployees = createAsyncThunk<Employee[], void, { rejectValue: string }>('employees/fetchEmployees', async (_, { rejectWithValue }) => {
    try {
        const employees = await getEmployees()
        return employees
    }
    catch (error) {
        return rejectWithValue(extractErrorMessage(error, ERROR_MESSAGE.Employee.FETCH_ALL_FAILED))
    }
})

/** Active AbortController for the latest fetchEmployeeById call (prevents stale responses) */
let fetchByIdController: AbortController | null = null

export const fetchEmployeeById = createAsyncThunk<Employee, string, { rejectValue: string }>('employees/fetchEmployeeById', async (id, { rejectWithValue }) => {
    // Abort any previous in-flight request to prevent stale responses
    if (fetchByIdController) {
        fetchByIdController.abort()
    }
    fetchByIdController = new AbortController()

    try {
        const employee = await getEmployeeById(id, fetchByIdController.signal)
        return employee
    }
    catch (error) {
        // Don't treat abort as a user-visible error
        if (error instanceof DOMException && error.name === 'AbortError') {
            return rejectWithValue('')
        }
        return rejectWithValue(extractErrorMessage(error, ERROR_MESSAGE.Employee.FETCH_BY_ID_FAILED))
    } finally {
        fetchByIdController = null
    }
})

export const createEmployees = createAsyncThunk<Employee, EmployeeFormData, { rejectValue: string }>('employees/createEmployee', async (data, { rejectWithValue }) => {
    try {
        const addEmployee = await createEmployee(data)
        return addEmployee
    }
    catch (error) {
        return rejectWithValue(extractErrorMessage(error, ERROR_MESSAGE.Employee.CREATE_FAILED))
    }
})

export const updateEmployees = createAsyncThunk<Employee, { id: string, data: EmployeeFormData }, { rejectValue: string }>('employees/updateEmployee', async ({ id, data }, { rejectWithValue }) => {
    try {
        const modifyEmployee = await updateEmployee(id, data)
        return modifyEmployee
    }
    catch (error) {
        return rejectWithValue(extractErrorMessage(error, ERROR_MESSAGE.Employee.UPDATE_FAILED))
    }
})

export const deleteEmployees = createAsyncThunk<string, string, { rejectValue: string }>('employees/deleteEmployee', async (id, { rejectWithValue }) => {
    try {
        await deleteEmployee(id)
        return id
    }
    catch (error) {
        return rejectWithValue(extractErrorMessage(error, ERROR_MESSAGE.Employee.DELETE_FAILED))
    }
})