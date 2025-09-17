<template>
  <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Search Music</h1>
      <p class="mt-2 text-gray-600">Search for songs, artists, albums, and more</p>
    </div>

    <!-- Search Bar -->
    <div class="mb-8">
      <div class="relative max-w-2xl mx-auto">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="What do you want to listen to?"
          class="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-lg"
          @keyup.enter="performSearch"
        />
        <svg
          class="absolute left-4 top-4 h-6 w-6 text-gray-400"
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
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
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
    </div>

    <!-- Search Filters -->
    <div v-if="searchQuery" class="mb-6">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-medium text-gray-700">Filter by:</span>
        <button
          v-for="filter in searchFilters"
          :key="filter.key"
          @click="activeFilter = activeFilter === filter.key ? 'all' : filter.key"
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium transition-colors',
            activeFilter === filter.key
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="searchQuery && hasSearched">
      <!-- Results Summary -->
      <div class="mb-6">
        <p class="text-sm text-gray-600">
          {{ searchResults.length }} result{{ searchResults.length !== 1 ? 's' : '' }} for "<span
            class="font-medium"
            >{{ searchQuery }}</span
          >"
        </p>
      </div>

      <!-- Results List -->
      <TrackList
        :songs="searchResults"
        :loading="isSearching"
        title=""
        :empty-message="`No songs found for '${searchQuery}'. Try a different search term.`"
        @song-selected="handleSongSelected"
      />
    </div>

    <!-- Default State (No search) -->
    <div v-else-if="!searchQuery" class="text-center py-16">
      <svg
        class="mx-auto h-16 w-16 text-gray-300"
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
      <h3 class="mt-4 text-lg font-medium text-gray-900">Start searching</h3>
      <p class="mt-2 text-sm text-gray-500">
        Enter a song title, artist name, or album to find music
      </p>

      <!-- Popular searches or recent searches could go here -->
      <div v-if="popularSearches.length > 0" class="mt-8">
        <h4 class="text-sm font-medium text-gray-700 mb-4">Popular searches</h4>
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="search in popularSearches"
            :key="search"
            @click="((searchQuery = search), performSearch())"
            class="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            {{ search }}
          </button>
        </div>
      </div>
    </div>

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
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useMusic } from '@/composables/useMusic'
import TrackList from '@/components/TrackList.vue'
import type { Song } from '@/types'

const { fetchSongs, songs } = useMusic()

const searchQuery = ref('')
const activeFilter = ref<'all' | 'title' | 'artist' | 'album' | 'genre'>('all')
const selectedSong = ref<Song | null>(null)
const hasSearched = ref(false)
const isSearching = ref(false)

const popularSearches = ref(['Rock', 'Pop', 'Jazz', 'Classical', 'Hip Hop'])

const searchFilters = [
  { key: 'all', label: 'All' },
  { key: 'title', label: 'Title' },
  { key: 'artist', label: 'Artist' },
  { key: 'album', label: 'Album' },
  { key: 'genre', label: 'Genre' },
] as const

const searchResults = computed(() => {
  if (!searchQuery.value) return []

  const query = searchQuery.value.toLowerCase()

  return songs.value.filter((song) => {
    switch (activeFilter.value) {
      case 'title':
        return song.titulo.toLowerCase().includes(query)
      case 'artist':
        return song.artista.toLowerCase().includes(query)
      case 'album':
        return song.album?.toLowerCase().includes(query) || false
      case 'genre':
        return song.genre?.toLowerCase().includes(query) || false
      case 'all':
      default:
        return (
          song.titulo.toLowerCase().includes(query) ||
          song.artista.toLowerCase().includes(query) ||
          song.album?.toLowerCase().includes(query) ||
          song.genre?.toLowerCase().includes(query)
        )
    }
  })
})

const performSearch = () => {
  if (searchQuery.value.trim()) {
    hasSearched.value = true
    isSearching.value = true

    // Simulate search delay
    setTimeout(() => {
      isSearching.value = false
    }, 300)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  hasSearched.value = false
  activeFilter.value = 'all'
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const handleSongSelected = (song: Song) => {
  selectedSong.value = song
}

// Watch for search query changes
watch(searchQuery, (newQuery) => {
  if (newQuery.trim()) {
    performSearch()
  } else {
    hasSearched.value = false
  }
})

// Load songs when component mounts
onMounted(async () => {
  try {
    await fetchSongs()
  } catch (err) {
    console.error('Failed to load songs:', err)
  }
})
</script>
