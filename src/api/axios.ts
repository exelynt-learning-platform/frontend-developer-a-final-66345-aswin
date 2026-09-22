import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://669b3f09276e45187d34eb4e.mockapi.io/api/v1"
})

export default api