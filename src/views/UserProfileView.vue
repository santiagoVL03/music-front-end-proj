<template>
  <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error && !user" class="text-center py-16">
      <svg
        class="mx-auto h-12 w-12 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">User not found</h3>
      <p class="mt-2 text-sm text-gray-500">{{ error }}</p>
      <router-link
        to="/"
        class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
      >
        Back to Home
      </router-link>
    </div>

    <!-- User Profile -->
    <div v-else-if="user">
      <!-- Breadcrumb -->
      <nav class="flex mb-8" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <router-link to="/" class="text-gray-500 hover:text-gray-700">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                />
              </svg>
            </router-link>
          </li>
          <li>
            <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </li>
          <li>
            <span class="text-gray-500">Users</span>
          </li>
          <li>
            <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </li>
          <li>
            <span class="text-gray-900 font-medium">{{ user.nombre }}</span>
          </li>
        </ol>
      </nav>

      <!-- User Profile Component -->
      <UserProfile
        :user="user"
        @song-selected="handleSongSelected"
        @user-updated="handleUserUpdated"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMusic } from '@/composables/useMusic'
import UserProfile from '@/components/UserProfile.vue'
import type { User, Song } from '@/types'

const route = useRoute()
const { fetchUserProfile, currentUser, error, clearError } = useMusic()

const user = ref<User | null>(null)
const loading = ref(false)
const selectedSong = ref<Song | null>(null)

// Methods
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const loadUserProfile = async () => {
  const userId = parseInt(route.params.id as string)
  if (isNaN(userId)) {
    clearError()
    console.error('Invalid user ID')
    return
  }

  loading.value = true
  try {
    clearError()
    const userProfile = await fetchUserProfile(userId)
    user.value = userProfile
  } catch (err) {
    console.error('Failed to load user profile:', err)
    user.value = null
  } finally {
    loading.value = false
  }
}

const handleSongSelected = (song: Song) => {
  selectedSong.value = song
}

const handleUserUpdated = (updatedUser: User) => {
  user.value = updatedUser
}

// Watch for route changes
watch(() => route.params.id, loadUserProfile, { immediate: true })

// Also watch for currentUser changes from the composable
watch(currentUser, (newUser) => {
  if (newUser && newUser.id === parseInt(route.params.id as string)) {
    user.value = { ...newUser, music: newUser.music ? [...newUser.music] : undefined }
  }
})
</script>
