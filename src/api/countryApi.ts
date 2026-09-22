import api from './axios'

export const getCountries = async () => {
    const res = await api.get('/country')
    return res.data
}