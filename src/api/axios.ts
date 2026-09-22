import axios from 'axios'

const api = axios.create({
    baseURL: "https://669b3f09276e45187d34eb4e.mockapi.io/api/v1"
})

// api.interceptors.request.use((con) => {
//     const token = localStorage.getItem("token")

//     if(token)
//         con.headers.Authorization = `Bearer ${token}`

//     return con
// })

export default api