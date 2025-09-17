import { ref, reactive, readonly } from 'vue'
import { musicApi } from '@/services/api'
import type {
  User,
  Song,
  CreateUserRequest,
  UpdateUserStatusRequest,
  AddSongToUserRequest,
  CreateSongRequest,
  ApiError,
} from '@/types'

// Global state
const songs = ref<Song[]>([])
const users = ref<User[]>([])
const currentUser = ref<User | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export function useMusic() {
  // Loading states for specific operations
  const operationLoading = reactive({
    fetchingSongs: false,
    creatingUser: false,
    updatingUserStatus: false,
    addingSongToUser: false,
    creatingSong: false,
    fetchingUser: false,
  })

  // Clear error
  const clearError = () => {
    error.value = null
  }

  // Set error with proper handling
  const setError = (err: unknown) => {
    if (err && typeof err === 'object' && 'message' in err) {
      error.value = (err as ApiError).message
    } else if (typeof err === 'string') {
      error.value = err
    } else {
      error.value = 'An unexpected error occurred'
    }
  }

  // Fetch all songs
  const fetchSongs = async () => {
    operationLoading.fetchingSongs = true
    clearError()

    try {
      const fetchedSongs = await musicApi.getAllSongs()
      songs.value = fetchedSongs
      return fetchedSongs
    } catch (err) {
      setError(err)
      throw err
    } finally {
      operationLoading.fetchingSongs = false
    }
  }

  const createUser = async (userData: CreateUserRequest) => {
    operationLoading.creatingUser = true
    clearError()

    try {
      console.log('Creating user with data:', userData)
      const newUser = await musicApi.createUser(userData)
      users.value.push(newUser)
      return newUser
    } catch (err) {
      setError(err)
      throw err
    } finally {
      operationLoading.creatingUser = false
    }
  }

  // Update user status
  const updateUserStatus = async (userId: number, statusData: UpdateUserStatusRequest) => {
    operationLoading.updatingUserStatus = true
    clearError()

    try {
      const updatedUser = await musicApi.updateUserStatus(userId, statusData)
      // Update user in the users array
      const userIndex = users.value.findIndex((u) => u.id === userId)
      if (userIndex !== -1) {
        users.value[userIndex] = updatedUser
      }
      // Update current user if it's the same user
      if (currentUser.value?.id === userId) {
        currentUser.value = updatedUser
      }
      return updatedUser
    } catch (err) {
      setError(err)
      throw err
    } finally {
      operationLoading.updatingUserStatus = false
    }
  }

  // Get user profile
  const fetchUserProfile = async (userId: number) => {
    operationLoading.fetchingUser = true
    clearError()

    try {
      const user = await musicApi.getUserProfile(userId)
      currentUser.value = user
      return user
    } catch (err) {
      setError(err)
      throw err
    } finally {
      operationLoading.fetchingUser = false
    }
  }

  // Add song to user's library
  const addSongToUser = async (userId: number, songData: AddSongToUserRequest) => {
    operationLoading.addingSongToUser = true
    clearError()

    try {
      const updatedUser = await musicApi.addSongToUser(userId, songData)
      // Update user in the users array
      const userIndex = users.value.findIndex((u) => u.id === userId)
      if (userIndex !== -1) {
        users.value[userIndex] = updatedUser
      }
      // Update current user if it's the same user
      if (currentUser.value?.id === userId) {
        currentUser.value = updatedUser
      }
      return updatedUser
    } catch (err) {
      setError(err)
      throw err
    } finally {
      operationLoading.addingSongToUser = false
    }
  }

  // Create a new song
  const createSong = async (songData: CreateSongRequest) => {
    operationLoading.creatingSong = true
    clearError()

    try {
      const newSong = await musicApi.createSong(songData)
      songs.value.push(newSong)
      return newSong
    } catch (err) {
      setError(err)
      throw err
    } finally {
      operationLoading.creatingSong = false
    }
  }

  // Utility function to find song by ID
  const findSong = (songId: number): Song | undefined => {
    return songs.value.find((song) => song.id === songId)
  }

  // Utility function to find user by ID
  const findUser = (userId: number): User | undefined => {
    return users.value.find((user) => user.id === userId)
  }

  return {
    // State
    songs: readonly(songs),
    users: readonly(users),
    currentUser: readonly(currentUser),
    loading: readonly(loading),
    error: readonly(error),
    operationLoading: readonly(operationLoading),

    // Actions
    fetchSongs,
    createUser,
    updateUserStatus,
    fetchUserProfile,
    addSongToUser,
    createSong,
    clearError,

    // Utilities
    findSong,
    findUser,
  }
}
