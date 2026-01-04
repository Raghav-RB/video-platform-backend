# MediaVault – Video Management Backend

MediaVault is a backend application for managing videos, playlists, and users.  
It represents the **application-layer backend** of a video platform (similar to YouTube), focusing on **data management, authentication, and secure APIs**, not media streaming or CDN delivery.

This project was built to demonstrate real-world backend concepts such as authentication, authorization, database relationships, and clean API design.

---

## Overview

MediaVault allows users to:
- register and authenticate securely
- manage video metadata
- create and manage playlists
- add and remove videos from playlists
- fetch playlists with complete video and owner details

The emphasis of this project is on **correct backend architecture**, **MongoDB data modeling**, and **safe API behavior**.

---

## Authentication & Security

- JWT-based authentication
- Protected routes using middleware
- Ownership-based authorization (users can modify only their own resources)
- Input validation with ObjectId checks

---

## Video Management

- Fetch video details by ID
- Store and manage video metadata
- Associate videos with users and playlists

---

## Playlist Management

- Create, update, and delete playlists
- Add videos to playlists with duplicate prevention
- Remove videos from playlists
- Fetch all playlists for a user
- Fetch a single playlist with:
  - full video details
  - video owner information

Playlist APIs use **MongoDB aggregation pipelines** to handle relational data cleanly.

---

## Database Design Highlights

- MongoDB with Mongoose
- Reference-based relationships (User → Video → Playlist)
- Aggregation pipelines with nested `$lookup`
- Atomic updates using operators like `$pull` and `$addToSet`
- Safe partial updates using document `.save()`

---

## Tech Stack

- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: JWT
- Utilities: Custom API error and response handlers

---

## API Overview

| Feature | Method | Endpoint |
|------|------|------|
| Create playlist | POST | `/api/v1/playlists` |
| Get user playlists | GET | `/api/v1/playlists/user/:userId` |
| Get playlist by ID | GET | `/api/v1/playlists/:playlistId` |
| Add video to playlist | POST | `/api/v1/playlists/:playlistId/video/:videoId` |
| Remove video from playlist | DELETE | `/api/v1/playlists/:playlistId/video/:videoId` |
| Update playlist | PATCH | `/api/v1/playlists/:playlistId` |
| Delete playlist | DELETE | `/api/v1/playlists/:playlistId` |

---

## Testing

- APIs tested manually using Postman
- Healthcheck, User, Video, and Playlist controllers verified
- Validation, authorization, and edge cases tested

---

## Scope & Notes

- This project focuses on **backend application logic**
- Actual video streaming (HLS/DASH/CDN) is intentionally out of scope
- Google OAuth is not implemented; JWT authentication is used
- OAuth can be added later as an enhancement

---

## Author

Raghav Bharadwaj  
Backend Developer

---

## Why This Project

MediaVault was built to demonstrate:
- real-world backend API design
- secure authentication and authorization
- relational data handling in NoSQL databases
- clean, readable, and maintainable backend code
