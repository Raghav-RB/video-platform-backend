# MediaVault – Video Management Backend

MediaVault is a backend application for managing users, videos, and playlists.  
It focuses on **secure authentication**, **authorization**, **MongoDB data modeling**, and **clean REST API design**.

---

## Overview

MediaVault allows users to:
- Register and authenticate securely
- Manage video metadata
- Create and manage playlists
- Add and remove videos from playlists
- Fetch playlists with complete video and owner details

The project emphasizes **production-style backend architecture** and **safe API behavior**.

---

## Authentication & Security

- JWT-based authentication
- Protected routes using middleware
- Ownership-based authorization
- Input validation with ObjectId checks

---

## Core Features

### Video Management
- Store and manage video metadata
- Fetch videos by ID
- Associate videos with users and playlists

### Playlist Management
- Create, update, and delete playlists
- Add and remove videos with duplicate prevention
- Fetch playlists with full video and owner details  
- Uses MongoDB aggregation pipelines for relational data

---

## Database Design Highlights

- MongoDB with Mongoose
- Reference-based relationships (User → Video → Playlist)
- Nested `$lookup` aggregations
- Atomic updates using `$addToSet` and `$pull`
- Safe partial updates using document `.save()`

---

## Tech Stack

- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: JWT
- Utilities: Custom API error and response handlers

---

## API Overview (Representative)

| Feature | Method | Endpoint |
|------|------|------|
| User registration | POST | `/api/v1/users/register` |
| User login | POST | `/api/v1/users/login` |
| Get all videos | GET | `/api/v1/videos` |
| Get video by ID | GET | `/api/v1/videos/:videoId` |
| Create playlist | POST | `/api/v1/playlists` |
| Get user playlists | GET | `/api/v1/playlists/user/:userId` |
| Add video to playlist | POST | `/api/v1/playlists/:playlistId/video/:videoId` |

> Full API coverage is available in the codebase and Postman collection.

---

## Testing

- APIs tested manually using Postman
- User, Video, and Playlist controllers verified
- Authorization, validation, and edge cases tested

---

## Scope & Notes

- Focuses on backend application logic
- Video streaming and CDN delivery are intentionally out of scope
- JWT-based authentication is used; OAuth can be added later

---

## Author

**Raghav Bharadwaj**  
Backend Developer

---

## Why This Project

MediaVault demonstrates:
- Real-world backend API design
- Secure authentication and authorization
- Relational data handling in NoSQL databases
- Clean, maintainable backend code
