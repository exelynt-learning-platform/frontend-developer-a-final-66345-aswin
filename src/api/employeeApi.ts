import type { emp_formData, employee } from '../types/employee'
import api from './axios'

export const getEmployees = async (): Promise<employee[]> => {
    const res = await api.get<employee[]>("/employee")
    return res.data
}

export const getEmployeeById = async (id: string): Promise<employee> => {
    const res = await api.get<employee>(`/employee/${id}`)
    return res.data
}

export const createEmployee = async (emp_data: emp_formData): Promise<employee> => {
    const res = await api.post<employee>('/employee', emp_data)
    return res.data
}

export const updateEmployee = async (id: string, emp_data: emp_formData): Promise<employee> => {
    const res = await api.put<employee>(`/employee/${id}`, emp_data)
    return res.data
}

export const deleteEmployee = async (id: string): Promise<employee> => {
    const res = await api.delete<employee>(`/employee/${id}`)
    return res.data
}