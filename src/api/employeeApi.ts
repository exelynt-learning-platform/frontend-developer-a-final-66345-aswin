import type { EmployeeFormData, Employee, RawEmployee } from '../types/employee'
import { normalizeEmployee } from '../types/employee'
import api from './axios'

/**
 * Sanitizes an ID for safe URL concatenation.
 * Encodes special characters and rejects obviously invalid IDs.
 */
const sanitizeId = (id: string): string => {
    const trimmed = id.trim()
    if (!trimmed || trimmed.includes('/') || trimmed.includes('\\')) {
        throw new Error(`Invalid employee ID: "${id}"`)
    }
    return encodeURIComponent(trimmed)
}

export const getEmployees = async (): Promise<Employee[]> => {
    const res = await api.get<RawEmployee[]>("/employee")
    return Array.isArray(res.data) ? res.data.map(normalizeEmployee) : []
}

export const getEmployeeById = async (id: string, signal?: AbortSignal): Promise<Employee> => {
    const safeId = sanitizeId(id)
    const res = await api.get<RawEmployee>(`/employee/${safeId}`, { signal })
    return normalizeEmployee(res.data)
}

export const createEmployee = async (empData: EmployeeFormData): Promise<Employee> => {
    const res = await api.post<RawEmployee>('/employee', empData)
    return normalizeEmployee(res.data)
}

export const updateEmployee = async (id: string, empData: EmployeeFormData): Promise<Employee> => {
    const safeId = sanitizeId(id)
    const res = await api.put<RawEmployee>(`/employee/${safeId}`, empData)
    return normalizeEmployee(res.data)
}

export const deleteEmployee = async (id: string): Promise<{ id: string }> => {
    const safeId = sanitizeId(id)
    await api.delete(`/employee/${safeId}`)
    return { id }
}