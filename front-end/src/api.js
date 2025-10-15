import axios from 'axios'


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'


export const api = axios.create({
baseURL: API_URL,
headers: { 'Content-Type': 'application/json' },
})


export const overlaysApi = {
list: () => api.get('/api/overlays/'),
create: (payload) => api.post('/api/overlays/', payload),
read: (id) => api.get(`/api/overlays/${id}`),
update: (id, payload) => api.put(`/api/overlays/${id}`, payload),
remove: (id) => api.delete(`/api/overlays/${id}`),
}


export const hlsUrl = () => {
const base = API_URL.replace(/\/$/, '')
const path = import.meta.env.VITE_HLS_PATH || '/stream/live.m3u8'
return `${base}${path.startsWith('/') ? path : '/' + path}`
}