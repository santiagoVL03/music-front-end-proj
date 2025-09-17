<template>
  <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Music Library</h1>
      <p class="mt-2 text-gray-600">Discover and explore all available songs in our collection</p>
    </div>

    <!-- Action Bar -->
    <div
      class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
    >
      <!-- Search -->
      <div class="relative max-w-md w-full">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search songs, artists, or albums..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <svg
          class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <div class="flex items-center space-x-3">
        <button
          @click="refreshSongs"
          :disabled="operationLoading.fetchingSongs"
          class="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg
            :class="['w-4 h-4 text-gray-500', operationLoading.fetchingSongs && 'animate-spin']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Refresh</span>
        </button>

        <select
          v-model="selectedUserId"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option :value="undefined">Select user to add songs</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.nombre }}
          </option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-primary-100 rounded-lg">
            <svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 3a1 1 0 00-1.196-.98L10 3.75 3.196 2.02A1 1 0 002 3v11.5a1 1 0 001.196.98L10 13.75l6.804 1.73A1 1 0 0018 14.5V3z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900">{{ filteredSongs.length }}</p>
            <p class="text-sm text-gray-600">Total Songs</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900">{{ uniqueArtists.length }}</p>
            <p class="text-sm text-gray-600">Artists</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900">{{ uniqueAlbums.length }}</p>
            <p class="text-sm text-gray-600">Albums</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900">{{ formatTotalDuration() }}</p>
            <p class="text-sm text-gray-600">Total Duration</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Songs List -->
    <TrackList
      :songs="[...filteredSongs]"
      :loading="operationLoading.fetchingSongs"
      title="All Songs"
      empty-message="No songs found. Try adjusting your search or add some songs to get started."
      show-add-song
      :show-add-to-library="!!selectedUserId"
      :user-id="selectedUserId"
      @song-selected="handleSongSelected"
      @song-added-to-library="handleSongAddedToLibrary"
    />

    <!-- Song Details Modal -->
    <div
      v-if="selectedSong"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="selectedSong = null"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Song Details</h3>
          <button @click="selectedSong = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <p class="mt-1 text-sm text-gray-900">{{ selectedSong.titulo }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Artist</label>
            <p class="mt-1 text-sm text-gray-900">{{ selectedSong.artista }}</p>
          </div>

          <div v-if="selectedSong.album">
            <label class="block text-sm font-medium text-gray-700">Album</label>
            <p class="mt-1 text-sm text-gray-900">{{ selectedSong.album }}</p>
          </div>

          <div v-if="selectedSong.genre">
            <label class="block text-sm font-medium text-gray-700">Genre</label>
            <p class="mt-1 text-sm text-gray-900">{{ selectedSong.genre }}</p>
          </div>

          <div v-if="selectedSong.duration">
            <label class="block text-sm font-medium text-gray-700">Duration</label>
            <p class="mt-1 text-sm text-gray-900">{{ formatDuration(selectedSong.duration) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex">
        <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          <button
            @click="clearError"
            class="mt-2 text-sm text-red-600 hover:text-red-500 underline"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMusic } from '@/composables/useMusic'
import TrackList from '@/components/TrackList.vue'
import type { Song } from '@/types'

const { fetchSongs, songs, users, operationLoading, error, clearError } = useMusic()

const searchQuery = ref('')
const selectedUserId = ref<number | undefined>(undefined)
const selectedSong = ref<Song | null>(null)

// Computed properties
const filteredSongs = computed(() => {
  if (!searchQuery.value) return songs.value

  const query = searchQuery.value.toLowerCase()
  return songs.value.filter(
    (song) =>
      song.titulo.toLowerCase().includes(query) ||
      song.artista.toLowerCase().includes(query) ||
      song.album?.toLowerCase().includes(query) ||
      song.genre?.toLowerCase().includes(query),
  )
})

const uniqueArtists = computed(() => {
  const artists = new Set(songs.value.map((song) => song.artista))
  return Array.from(artists)
})

const uniqueAlbums = computed(() => {
  const albums = new Set(songs.value.map((song) => song.album).filter(Boolean))
  return Array.from(albums)
})

// Methods
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatTotalDuration = (): string => {
  const totalSeconds = songs.value.reduce((total, song) => {
    return total + (song.duration || 0)
  }, 0)

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

const refreshSongs = async () => {
  try {
    await fetchSongs()
  } catch (err) {
    console.error('Failed to refresh songs:', err)
  }
}

const handleSongSelected = (song: Song) => {
  selectedSong.value = song
}

const handleSongAddedToLibrary = (song: Song) => {
  console.log('Song added to library:', song.titulo)
  // You could show a toast notification here
}

// Load songs and users when component mounts
onMounted(async () => {
  try {
    await fetchSongs()
    // Note: We would need to implement fetchUsers in the composable if we want to populate the user dropdown
  } catch (err) {
    console.error('Failed to load initial data:', err)
  }
})
</script>
