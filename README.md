# Music App Backend

Backend API for Music Player App built with NestJS 11 and MongoDB.

## Tech Stack

- **Framework**: NestJS 11.0.14
- **Database**: MongoDB with Mongoose
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator & class-transformer

## Project Structure

```
src/
├── database/
│   └── seeds/
│       └── seed.ts           # Database seeder
├── modules/
│   ├── tracks/               # Track management
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── tracks.controller.ts
│   │   ├── tracks.service.ts
│   │   └── tracks.module.ts
│   ├── artists/              # Artist management (aggregated from tracks)
│   ├── playlists/            # Playlist management
│   └── favorites/            # Favorites management
├── app.module.ts
└── main.ts
```

## Installation

```bash
# Install dependencies
npm install

# Or with yarn
yarn install
```

## Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/music-app
NODE_ENV=development
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## Database Seeding

Seed the database with sample data from the frontend app:

```bash
npm run seed
```

## API Documentation

Once the application is running, access Swagger documentation at:

```
http://localhost:3000/docs
```

## API Endpoints

### Tracks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tracks` | Get all tracks (with pagination & filters) |
| GET | `/api/tracks/:id` | Get track by ID |
| POST | `/api/tracks` | Create a new track |
| POST | `/api/tracks/bulk` | Create multiple tracks |
| PATCH | `/api/tracks/:id` | Update a track |
| DELETE | `/api/tracks/:id` | Delete a track |
| PATCH | `/api/tracks/:id/favorite` | Toggle favorite status |
| PATCH | `/api/tracks/:id/playlist/:name` | Add track to playlist |
| DELETE | `/api/tracks/:id/playlist/:name` | Remove track from playlist |

### Artists

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/artists` | Get all artists with their tracks |
| GET | `/api/artists/names` | Get list of artist names |
| GET | `/api/artists/:name` | Get artist by name |

### Playlists

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/playlists` | Get all playlists |
| GET | `/api/playlists/names` | Get list of playlist names |
| GET | `/api/playlists/:name` | Get playlist by name |
| POST | `/api/playlists` | Create a new playlist |
| DELETE | `/api/playlists/:name` | Delete a playlist |
| POST | `/api/playlists/:name/tracks/:trackId` | Add track to playlist |
| DELETE | `/api/playlists/:name/tracks/:trackId` | Remove track from playlist |

### Favorites

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | Get all favorite tracks |
| GET | `/api/favorites/count` | Get favorites count |
| GET | `/api/favorites/:trackId/status` | Check if track is favorite |
| PATCH | `/api/favorites/:trackId/toggle` | Toggle favorite status |
| POST | `/api/favorites/:trackId` | Add to favorites |
| DELETE | `/api/favorites/:trackId` | Remove from favorites |

## Query Parameters

### Tracks List

- `search`: Search by title or artist
- `artist`: Filter by artist name
- `playlist`: Filter by playlist name
- `rating`: Filter by rating (0 or 1)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

### Artists/Playlists List

- `search`: Search by name
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

## License

MIT

