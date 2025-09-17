export interface User {
  id: number
  nombre: string
  email: string
  estado: 'activo' | 'inactivo'
  createdAt?: string
  updatedAt?: string
  music?: Song[]
}

export interface Song {
  id: number
  titulo: string
  artista: string
  album?: string
  duration?: number
  genre?: string
  url?: string
  coverImage?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateUserRequest {
  nombre: string
  email: string
}

export interface UpdateUserStatusRequest {
  estado: 'activo' | 'inactivo'
}

export interface AddSongToUserRequest {
  songId: number
}

export interface CreateSongRequest {
  titulo: string
  artista: string
  album?: string
  duration?: number
  genre?: string
  url?: string
  coverImage?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  status: number
  details?: string
}
