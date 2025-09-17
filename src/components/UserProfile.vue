<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <div
          class="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center"
        >
          <span class="text-white text-xl font-bold">
            {{ user.nombre.charAt(0).toUpperCase() }}
          </span>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ user.nombre }}</h2>
          <p class="text-gray-600">{{ user.email }}</p>
          <div class="flex items-center space-x-2 mt-1">
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                user.estado === 'activo'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800',
              ]"
            >
              {{ user.estado === 'activo' ? 'Activo' : 'Inactivo' }}
            </span>
            <span class="text-sm text-gray-500">
              {{ user.music?.length || 0 }} canciones en la biblioteca
            </span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-3">
        <button
          @click="toggleUserStatus"
          :disabled="operationLoading.updatingUserStatus"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            user.estado === 'activo'
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200',
          ]"
        >
          {{
            operationLoading.updatingUserStatus
              ? 'Updating...'
              : user.estado === 'activo'
                ? 'Deactivate'
                : 'Activate'
          }}
        </button>

        <button
          @click="showAddSongModal = true"
          class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Add Song to Library
        </button>
      </div>
    </div>

    <!-- User Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-8 h-8 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 3a1 1 0 00-1.196-.98L10 3.75 3.196 2.02A1 1 0 002 3v11.5a1 1 0 001.196.98L10 13.75l6.804 1.73A1 1 0 0018 14.5V3z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900">{{ user.music?.length || 0 }}</p>
            <p class="text-sm text-gray-600">Songs in Library</p>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900">{{ formatDate(user.createdAt) }}</p>
            <p class="text-sm text-gray-600">Member Since</p>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900">{{ getTotalDuration() }}</p>
            <p class="text-sm text-gray-600">Total Duration</p>
          </div>
        </div>
      </div>
    </div>

    <!-- User's Music Library -->
    <div>
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Music Library</h3>

      <TrackList
        :songs="user.music || []"
        :loading="operationLoading.fetchingUser"
        title=""
        empty-message="This user hasn't added any songs to their library yet."
        @song-selected="$emit('song-selected', $event)"
      />
    </div>

    <!-- Add Song to Library Modal -->
    <div
      v-if="showAddSongModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showAddSongModal = false"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Add Song to {{ user.nombre }}'s Library
        </h3>

        <!-- Search/Filter for songs -->
        <div class="mb-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search songs..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <!-- Available songs list -->
        <div class="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
          <div
            v-for="song in filteredAvailableSongs"
            :key="song.id"
            class="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M18 3a1 1 0 00-1.196-.98L10 3.75 3.196 2.02A1 1 0 002 3v11.5a1 1 0 001.196.98L10 13.75l6.804 1.73A1 1 0 0018 14.5V3z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ song.titulo }}</p>
                <p class="text-sm text-gray-500">{{ song.artista }}</p>
              </div>
            </div>

            <button
              @click="handleAddSongToLibrary(song)"
              :disabled="operationLoading.addingSongToUser || isAlreadyInLibrary(song.id)"
              class="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            >
              {{ isAlreadyInLibrary(song.id) ? 'Already Added' : 'Add to Library' }}
            </button>
          </div>

          <div v-if="filteredAvailableSongs.length === 0" class="p-8 text-center text-gray-500">
            No songs found matching your search.
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            @click="showAddSongModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-600">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMusic } from '@/composables/useMusic'
import TrackList from './TrackList.vue'
import type { User, Song } from '@/types'

interface Props {
  user: User
}

interface Emits {
  (e: 'song-selected', song: Song): void
  (e: 'user-updated', user: User): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { updateUserStatus, addSongToUser, fetchSongs, songs, operationLoading, error, clearError } =
  useMusic()

const showAddSongModal = ref(false)
const searchQuery = ref('')

// Computed properties
const filteredAvailableSongs = computed(() => {
  if (!searchQuery.value) return songs.value

  const query = searchQuery.value.toLowerCase()
  return songs.value.filter(
    (song) =>
      song.titulo.toLowerCase().includes(query) ||
      song.artista.toLowerCase().includes(query) ||
      song.album?.toLowerCase().includes(query),
  )
})

// Methods
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString()
}

const getTotalDuration = (): string => {
  if (!props.user.music) return '0:00'

  const totalSeconds = props.user.music.reduce((total, song) => {
    return total + (song.duration || 0)
  }, 0)

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

const isAlreadyInLibrary = (songId: number): boolean => {
  return props.user.music?.some((song) => song.id === songId) || false
}

const toggleUserStatus = async () => {
  try {
    clearError()
    const newStatus = props.user.estado === 'activo' ? 'inactivo' : 'activo'
    const updatedUser = await updateUserStatus(props.user.id, { estado: newStatus })
    emit('user-updated', updatedUser)
  } catch (err) {
    console.error('Failed to update user status:', err)
  }
}

const handleAddSongToLibrary = async (song: Song) => {
  try {
    clearError()
    const updatedUser = await addSongToUser(props.user.id, { songId: song.id })
    emit('user-updated', updatedUser)

    // Close modal if this was the last song to add
    if (filteredAvailableSongs.value.length === 1) {
      showAddSongModal.value = false
    }
  } catch (err) {
    console.error('Failed to add song to library:', err)
  }
}

// Load all songs when component mounts (for the add song modal)
onMounted(async () => {
  try {
    await fetchSongs()
  } catch (err) {
    console.error('Failed to fetch songs:', err)
  }
})
</script>
