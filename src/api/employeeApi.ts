import type { emp_formData, employee, RawEmployee } from '../types/employee'
import { normalizeEmployee } from '../types/employee'
import api from './axios'

export const getEmployees = async (): Promise<employee[]> => {
    const res = await api.get<RawEmployee[]>("/employee")
    return Array.isArray(res.data) ? res.data.map(normalizeEmployee) : []
}

export const getEmployeeById = async (id: string): Promise<employee> => {
    const res = await api.get<RawEmployee>(`/employee/${id}`)
    return normalizeEmployee(res.data)
}

export const createEmployee = async (emp_data: emp_formData): Promise<employee> => {
    const res = await api.post<RawEmployee>('/employee', emp_data)
    return normalizeEmployee(res.data)
}

export const updateEmployee = async (id: string, emp_data: emp_formData): Promise<employee> => {
    const res = await api.put<RawEmployee>(`/employee/${id}`, emp_data)
    return normalizeEmployee(res.data)
}

export const deleteEmployee = async (id: string): Promise<{ id: string }> => {
    const res = await api.delete<{ id?: string | number }>(`/employee/${id}`)
    return { id: res.data?.id ? String(res.data.id) : id }
}