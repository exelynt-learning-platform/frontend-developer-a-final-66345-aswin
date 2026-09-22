import { createSlice } from "@reduxjs/toolkit"
import type { employee } from "../../types/employee"
import { fetchEmployees, fetchEmployeeById, createEmployees, updateEmployees, deleteEmployees } from "./employeeService"
import { ERROR_MESSAGE } from "../../constants/CentralizedErrorMessage"

interface employeeState {
    employees: employee[]
    selectedEmployee: employee | null
    searchResult: employee | null
    loading: boolean
    error: string | null
}

const initialState: employeeState = {
    employees: [],
    selectedEmployee: null,
    searchResult: null,
    loading: false,
    error: null
}

const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },

        clearSelectedEmployee: (state) => {
            state.selectedEmployee = null
        },

        clearSearchResult: (state) => {
            state.searchResult = null
        }
    },

    extraReducers: (build) => {
        build.addCase(fetchEmployees.pending, (state) => {
            state.loading = true
            state.error = null
        })

        build.addCase(fetchEmployees.fulfilled, (state, action) => {
            state.loading = false
            state.employees = action.payload
        })

        build.addCase(fetchEmployees.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload ?? ERROR_MESSAGE.Employee.FETCH_ALL_FAILED
        })

        build.addCase(fetchEmployeeById.pending, (state) => {
            state.loading = true
            state.searchResult = null
            state.error = null
        })

        build.addCase(fetchEmployeeById.fulfilled, (state, action) => {
            state.loading = false
            state.selectedEmployee = action.payload
            state.searchResult = action.payload
        })

        build.addCase(fetchEmployeeById.rejected, (state, action) => {
            state.loading = false
            state.selectedEmployee = null
            state.error = action.payload ?? ERROR_MESSAGE.Employee.FETCH_BY_ID_FAILED
        })

        build.addCase(createEmployees.pending, (state) => {
            state.loading = true
            state.error = null
        })

        build.addCase(createEmployees.fulfilled, (state, action) => {
            state.loading = false
            state.employees.push(action.payload)
        })

        build.addCase(createEmployees.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload ?? ERROR_MESSAGE.Employee.CREATE_FAILED
        })

        build.addCase(updateEmployees.pending, (state) => {
            state.loading = true
            state.error = null
        })

        build.addCase(updateEmployees.fulfilled, (state, action) => {
            state.loading = false
            let index = state.employees.findIndex(emp => emp.id === action.payload.id)
            if(index !== -1)
                state.employees[index] = action.payload
        })

        build.addCase(updateEmployees.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload ?? ERROR_MESSAGE.Employee.UPDATE_FAILED
        })

        build.addCase(deleteEmployees.pending, (state) => {
            state.loading = true
            state.error = null
        })

        build.addCase(deleteEmployees.fulfilled, (state, action) => {
            state.loading = false
            const targetId = action.payload?.id ?? (action as any).meta?.arg ?? action.payload
            state.employees = state.employees.filter(emp => String(emp.id) !== String(targetId))
        })

        build.addCase(deleteEmployees.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload ?? ERROR_MESSAGE.Employee.DELETE_FAILED
        })
    }
})

export const { clearError, clearSelectedEmployee, clearSearchResult } = employeeSlice.actions

export default employeeSlice.reducer
