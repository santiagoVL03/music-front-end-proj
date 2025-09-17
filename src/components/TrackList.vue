<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">
          {{ title || 'All Songs' }}
        </h2>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">
            {{ songs.length }} {{ songs.length === 1 ? 'song' : 'songs' }}
          </span>
          <button
            v-if="showAddSong"
            @click="showAddSongModal = true"
            class="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            Add Song
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="px-6 py-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
      <p class="mt-2 text-sm text-gray-500">Loading songs...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="songs.length === 0" class="px-6 py-8 text-center">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 19V6l12-3v13M9 19c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zm12-3c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No songs found</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ emptyMessage || 'Get started by adding your first song.' }}
      </p>
    </div>

    <!-- Song list -->
    <div v-else class="divide-y divide-gray-200">
      <div
        v-for="(song, index) in songs"
        :key="song.id"
        class="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
        @click="$emit('song-selected', song)"
      >
        <div class="flex items-center space-x-4">
          <!-- Track number or play button -->
          <div class="flex-shrink-0 w-8 text-center">
            <span class="text-sm text-gray-500">{{ index + 1 }}</span>
          </div>

          <!-- Album art placeholder -->
          <div class="flex-shrink-0">
            <div v-if="song.coverImage" class="w-12 h-12 rounded-md overflow-hidden">
              <img
                :src="song.coverImage"
                :alt="`${song.titulo} cover`"
                class="w-full h-full object-cover"
              />
            </div>
            <div v-else class="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 3a1 1 0 00-1.196-.98L10 3.75 3.196 2.02A1 1 0 002 3v11.5a1 1 0 001.196.98L10 13.75l6.804 1.73A1 1 0 0018 14.5V3z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- Song info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2">
              <h3 class="text-sm font-medium text-gray-900 truncate">
                {{ song.titulo }}
              </h3>
            </div>
            <div class="flex items-center space-x-2 mt-1">
              <p class="text-sm text-gray-500 truncate">
                {{ song.artista }}
              </p>
              <span v-if="song.album" class="text-gray-300">•</span>
              <p v-if="song.album" class="text-sm text-gray-500 truncate">
                {{ song.album }}
              </p>
            </div>
          </div>

          <!-- Duration -->
          <div v-if="song.duration" class="flex-shrink-0">
            <span class="text-sm text-gray-500">
              {{ formatDuration(song.duration) }}
            </span>
          </div>

          <!-- Actions -->
          <div class="flex-shrink-0">
            <div class="flex items-center space-x-2">
              <button
                v-if="showAddToLibrary"
                @click.stop="handleAddToLibrary(song)"
                :disabled="operationLoading.addingSongToUser"
                class="text-gray-400 hover:text-primary-500 transition-colors p-1"
                title="Add to library"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>

              <button
                class="text-gray-400 hover:text-gray-600 transition-colors p-1"
                title="More options"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Song Modal -->
    <div
      v-if="showAddSongModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showAddSongModal = false"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add New Song</h3>

        <form @submit.prevent="handleCreateSong">
          <div class="space-y-4">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                id="title"
                v-model="newSong.titulo"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter song title"
              />
            </div>

            <div>
              <label for="artist" class="block text-sm font-medium text-gray-700 mb-1">
                Artist *
              </label>
              <input
                id="artist"
                v-model="newSong.artista"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter artist name"
              />
            </div>

            <div>
              <label for="album" class="block text-sm font-medium text-gray-700 mb-1">
                Album
              </label>
              <input
                id="album"
                v-model="newSong.album"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter album name"
              />
            </div>

            <div>
              <label for="genre" class="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <input
                id="genre"
                v-model="newSong.genre"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter genre"
              />
            </div>

            <div>
              <label for="duration" class="block text-sm font-medium text-gray-700 mb-1">
                Duration (seconds)
              </label>
              <input
                id="duration"
                v-model.number="newSong.duration"
                type="number"
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter duration in seconds"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showAddSongModal = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="operationLoading.creatingSong"
              class="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {{ operationLoading.creatingSong ? 'Creating...' : 'Create Song' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useMusic } from '@/composables/useMusic'
import type { Song, CreateSongRequest } from '@/types'

interface Props {
  songs: Song[]
  loading?: boolean
  title?: string
  emptyMessage?: string
  showAddSong?: boolean
  showAddToLibrary?: boolean
  userId?: number
}

interface Emits {
  (e: 'song-selected', song: Song): void
  (e: 'song-added-to-library', song: Song): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showAddSong: false,
  showAddToLibrary: false,
})

const emit = defineEmits<Emits>()

const { createSong, addSongToUser, operationLoading } = useMusic()

const showAddSongModal = ref(false)

const newSong = reactive<CreateSongRequest>({
  titulo: '',
  artista: '',
  album: '',
  genre: '',
  duration: undefined,
})

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const handleCreateSong = async () => {
  try {
    const songData: CreateSongRequest = {
      titulo: newSong.titulo,
      artista: newSong.artista,
      album: newSong.album || undefined,
      genre: newSong.genre || undefined,
      duration: newSong.duration || undefined,
    }

    await createSong(songData)

    // Reset form and close modal
    Object.assign(newSong, {
      title: '',
      artist: '',
      album: '',
      genre: '',
      duration: undefined,
    })
    showAddSongModal.value = false
  } catch (err) {
    console.error('Failed to create song:', err)
  }
}

const handleAddToLibrary = async (song: Song) => {
  if (!props.userId) {
    console.error('No user ID provided for adding song to library')
    return
  }

  try {
    await addSongToUser(props.userId, { songId: song.id })
    emit('song-added-to-library', song)
  } catch (err) {
    console.error('Failed to add song to library:', err)
  }
}
</script>
