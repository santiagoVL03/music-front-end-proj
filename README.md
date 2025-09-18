# MusicCloud - Music Web Frontend

A modern music web frontend built with Vite + Vue 3 + TypeScript + TailwindCSS.

## Features

- 🎵 Browse all songs with a clean, YouTube Music-inspired interface
- 👤 Create and manage user accounts
- 📚 Add songs to user libraries
- 🔍 Search functionality for songs, artists, albums, and genres
- 📱 Responsive design that works on all devices
- ⚡ Fast performance with Vite build tool

## API Integration

This frontend connects to a backend API with the following endpoints:

- `POST /usuarios` - Create a new user with validation
- `PUT /usuarios/{id}/estado` - Update user status (active/inactive)
- `POST /usuarios/{id}/musica` - Add song to user's library
- `GET /musica` - List all songs
- `GET /usuarios/{id}` - Get user profile including their music library
- `POST /musica` - Create a new song (for testing)

**Backend API URL**: `http://localhost:8000`

## Tech Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **State Management**: Vue Composables
- **Routing**: Vue Router 4

## Project Structure

```
src/
├── components/
│   ├── AppHeader.vue       # Main navigation header
│   ├── TrackList.vue       # Song list component
│   └── UserProfile.vue     # User profile display
├── views/
│   ├── HomeView.vue        # Main page with song list
│   ├── SearchView.vue      # Search functionality
│   └── UserProfileView.vue # User profile page
├── composables/
│   └── useMusic.ts         # State management and API calls
├── services/
│   └── api.ts              # Axios API service
├── types/
│   └── index.ts            # TypeScript interfaces
└── assets/
    └── main.css            # Global styles with TailwindCSS

```

## Getting Started

### Prerequisites

- Node.js (v20.19.0 or higher)
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

1. Clone the repository:

```bash
cd music-front-end-proj
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Usage

### Main Features

1. **Browse Songs**: The home page displays all available songs in a clean list format
2. **Create Users**: Click "Create User" in the header to add new users
3. **User Profiles**: Navigate to user profile pages to see their music libraries
4. **Add Songs**: Add songs to user libraries from the main song list
5. **Search**: Use the search page to find specific songs, artists, or albums
6. **Manage Users**: Toggle user status between active and inactive

### API Error Handling

The application includes comprehensive error handling:

- Network connection errors
- API response errors
- Invalid user inputs
- Loading states for all operations

### Responsive Design

The interface is optimized for:

- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## Development

### Code Style

The project uses:

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Vue 3 Composition API for reactive components

### Component Architecture

- **Composables**: Reusable logic for API calls and state management
- **Components**: Reusable UI components
- **Views**: Page-level components
- **Services**: API integration layer
- **Types**: TypeScript interfaces and type definitions

## API Requirements

Make sure your backend API is running on `http://localhost:8000` and implements the following endpoints:

1. **POST /usuarios**
   - Body: `{ name: string, email: string }`
   - Response: User object

2. **PUT /usuarios/{id}/estado**
   - Body: `{ status: 'active' | 'inactive' }`
   - Response: Updated user object

3. **POST /usuarios/{id}/musica**
   - Body: `{ songId: number }`
   - Response: Updated user object with music library

4. **GET /musica**
   - Response: Array of song objects

5. **GET /usuarios/{id}**
   - Response: User object with music library

6. **POST /musica**
   - Body: `{ title: string, artist: string, album?: string, duration?: number, genre?: string }`
   - Response: Created song object

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Update this README if adding new features
4. Test all functionality before submitting

## License

This project is for educational purposes.
