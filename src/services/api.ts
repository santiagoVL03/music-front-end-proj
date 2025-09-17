import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type {
  User,
  Song,
  CreateUserRequest,
  UpdateUserStatusRequest,
  AddSongToUserRequest,
  CreateSongRequest,
  ApiError,
} from '@/types'

const API_BASE_URL = 'http://localhost:8000'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
      details: error.response?.data?.details || error.response?.statusText,
    }
    console.error('API Error:', apiError)
    return Promise.reject(apiError)
  },
)

export const musicApi = {
  // User endpoints
  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await api.post<User>('/usuarios', userData)
    return response.data
  },

  async updateUserStatus(userId: number, statusData: UpdateUserStatusRequest): Promise<User> {
    const response = await api.put<User>(`/usuarios/${userId}/estado`, statusData)
    return response.data
  },

  async getUserProfile(userId: number): Promise<User> {
    const response = await api.get<User>(`/usuarios/${userId}`)
    return response.data
  },

  async addSongToUser(userId: number, songData: AddSongToUserRequest): Promise<User> {
    const response = await api.post<User>(`/usuarios/${userId}/musica`, songData)
    return response.data
  },

  async getAllSongs(): Promise<Song[]> {
    const response = await api.get<Song[]>('/musica')
    return response.data
  },

  async createSong(songData: CreateSongRequest): Promise<Song> {
    const response = await api.post<Song>('/musica', songData)
    return response.data
  },
}

export default api
