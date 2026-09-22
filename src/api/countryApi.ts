import api from './axios'
import type { Country } from '../types/country'

export const getCountries = async (): Promise<Country[]> => {
    const res = await api.get<Country[]>('/country')
    return res.data
}