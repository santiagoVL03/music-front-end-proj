<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <router-link
            to="/"
            class="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
          >
            <svg class="w-8 h-8 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 3a1 1 0 00-1.196-.98L10 3.75 3.196 2.02A1 1 0 002 3v11.5a1 1 0 001.196.98L10 13.75l6.804 1.73A1 1 0 0018 14.5V3z"
                clip-rule="evenodd"
              />
            </svg>
            <span>MusicCloud</span>
          </router-link>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex space-x-6">
          <router-link
            to="/"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            active-class="text-primary-600 border-b-2 border-primary-600"
          >
            All Songs
          </router-link>
          <router-link
            to="/search"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            active-class="text-primary-600 border-b-2 border-primary-600"
          >
            Search
          </router-link>
        </nav>

        <!-- User Actions -->
        <div class="flex items-center space-x-4">
          <!-- Create User Button -->
          <button
            @click="showCreateUserModal = true"
            class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Create User
          </button>

          <!-- User Profile Link (if user is selected) -->
          <router-link
            v-if="currentUser"
            :to="`/user/${currentUser.id}`"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors flex items-center space-x-1"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ currentUser.nombre }}</span>
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-600 hover:text-gray-900 p-2"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile navigation -->
      <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200">
        <div class="space-y-2">
          <router-link
            to="/"
            class="block text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium"
            @click="mobileMenuOpen = false"
          >
            All Songs
          </router-link>
          <router-link
            to="/search"
            class="block text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium"
            @click="mobileMenuOpen = false"
          >
            Search
          </router-link>
        </div>
      </div>
    </div>

    <!-- Create User Modal -->
    <div
      v-if="showCreateUserModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showCreateUserModal = false"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Create New User</h3>

        <form @submit.prevent="handleCreateUser">
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1"> Name </label>
              <input
                id="name"
                v-model="newUser.nombre"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter user name"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                v-model="newUser.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showCreateUserModal = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="operationLoading.creatingUser"
              class="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {{ operationLoading.creatingUser ? 'Creating...' : 'Create User' }}
            </button>
          </div>
        </form>

        <!-- Error message -->
        <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useMusic } from '@/composables/useMusic'
import type { CreateUserRequest } from '@/types'

const { createUser, currentUser, operationLoading, error, clearError } = useMusic()

const showCreateUserModal = ref(false)
const mobileMenuOpen = ref(false)

const newUser = reactive<CreateUserRequest>({
  nombre: '',
  email: '',
})

const handleCreateUser = async () => {
  try {
    clearError()
    await createUser({ ...newUser })

    // Reset form and close modal
    newUser.nombre = ''
    newUser.email = ''
    showCreateUserModal.value = false
  } catch (err) {
    // Error is handled by the composable
    console.error('Failed to create user:', err)
  }
}
</script>

<style scoped>
.router-link-active {
  @apply text-primary-600;
}
</style>
