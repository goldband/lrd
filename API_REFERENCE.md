# 📡 LRD API Reference

Complete API documentation for League Reminder & Display system.

---

## Base URL

```
Development:  http://localhost:3001/api
Production:   https://your-domain.com/api
```

## Authentication

All protected endpoints require JWT token in header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Tokens are returned on login/signup and expire after 30 days.

---

## Authentication Endpoints

### POST /auth/signup

Register a new user account.

**Request**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response** (201):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "player"
  }
}
```

**Errors**:
- 400: All fields required
- 400: Email already registered

---

### POST /auth/login

Authenticate existing user.

**Request**:
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "player"
  }
}
```

**Errors**:
- 400: Email and password required
- 401: Invalid credentials

---

## Games Endpoints

### GET /games

Get all games.

**Request**:
```
GET /api/games
```

**Response** (200):
```json
[
  {
    "id": "game_1234567890",
    "date": "2024-04-13",
    "time": "09:00",
    "venue": "Central Park Field A",
    "max_players": 20,
    "created_by": "user_admin",
    "created_at": "2024-04-01T10:30:00.000Z"
  },
  {
    "id": "game_1234567891",
    "date": "2024-04-14",
    "time": "18:00",
    "venue": "Central Park Field B",
    "max_players": 16,
    "created_by": "user_admin",
    "created_at": "2024-04-01T10:30:00.000Z"
  }
]
```

**Notes**: Public endpoint, no auth required.

---

### GET /games/:id

Get specific game with availability details.

**Request**:
```
GET /api/games/game_1234567890
```

**Response** (200):
```json
{
  "id": "game_1234567890",
  "date": "2024-04-13",
  "time": "09:00",
  "venue": "Central Park Field A",
  "max_players": 20,
  "created_by": "user_admin",
  "created_at": "2024-04-01T10:30:00.000Z",
  "availabilities": [
    {
      "id": "avail_1234567890",
      "game_id": "game_1234567890",
      "player_id": "user_player1",
      "status": "yes",
      "updated_at": "2024-04-02T15:45:00.000Z",
      "name": "John Doe"
    },
    {
      "id": "avail_1234567891",
      "game_id": "game_1234567890",
      "player_id": "user_player2",
      "status": "maybe",
      "updated_at": "2024-04-03T08:20:00.000Z",
      "name": "Jane Smith"
    }
  ]
}
```

**Errors**:
- 404: Game not found

---

### POST /games

Create a new game. **Requires admin role**.

**Request**:
```json
{
  "date": "2024-04-20",
  "time": "18:00",
  "venue": "Central Park Field C",
  "max_players": 18
}
```

**Response** (201):
```json
{
  "id": "game_1234567892",
  "date": "2024-04-20",
  "time": "18:00",
  "venue": "Central Park Field C",
  "max_players": 18
}
```

**Errors**:
- 400: Date and time required
- 403: Admin access required

---

### PUT /games/:id

Update game details. **Requires admin role**.

**Request**:
```json
{
  "date": "2024-04-20",
  "time": "19:00",
  "venue": "Central Park Field D",
  "max_players": 20
}
```

**Response** (200):
```json
{
  "id": "game_1234567892",
  "date": "2024-04-20",
  "time": "19:00",
  "venue": "Central Park Field D",
  "max_players": 20
}
```

**Errors**:
- 403: Admin access required
- 404: Game not found

---

### DELETE /games/:id

Delete a game. **Requires admin role**.

**Request**:
```
DELETE /api/games/game_1234567892
```

**Response** (200):
```json
{
  "message": "Game deleted"
}
```

**Errors**:
- 403: Admin access required
- 404: Game not found

---

## Availability Endpoints

### POST /availability

Update player's availability for a game.

**Request**:
```json
{
  "game_id": "game_1234567890",
  "status": "yes"
}
```

**Status Values**:
- `"yes"` - Playing
- `"no"` - Not playing
- `"maybe"` - Maybe

**Response** (200):
```json
{
  "game_id": "game_1234567890",
  "player_id": "user_1234567890",
  "status": "yes"
}
```

**Side Effects**:
- Creates in-app notification for all admins
- Sends email to all admins
- Updates game statistics

**Errors**:
- 400: Game ID and status required
- 401: No token provided

---

### GET /availability/:gameId

Get player's availability for a specific game.

**Request**:
```
GET /api/availability/game_1234567890
```

**Response** (200):
```json
{
  "status": "yes"
}
```

**Response** (200, if not set):
```json
{
  "status": null
}
```

**Errors**:
- 401: No token provided

---

## User Endpoints

### GET /users

Get all users. **Requires admin role**.

**Request**:
```
GET /api/users
```

**Response** (200):
```json
[
  {
    "id": "user_1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "photo_url": "/uploads/user_1234567890-1234567890.webp",
    "created_at": "2024-04-01T10:30:00.000Z"
  },
  {
    "id": "user_1234567891",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "player",
    "photo_url": "/uploads/user_1234567891-1234567891.webp",
    "created_at": "2024-04-02T12:45:00.000Z"
  }
]
```

**Errors**:
- 403: Admin access required

---

### GET /users/:id

Get specific user profile.

**Request**:
```
GET /api/users/user_1234567890
```

**Response** (200):
```json
{
  "id": "user_1234567890",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "player",
  "photo_url": "/uploads/user_1234567890-1234567890.webp"
}
```

**Errors**:
- 404: User not found

---

### POST /users/photo/upload

Upload or update player profile photo.

**Request**:
```
POST /api/users/photo/upload
Content-Type: multipart/form-data

Form data:
- file: <binary image data>
```

**Accepted Formats**:
- image/jpeg
- image/png
- image/webp

**Max Size**: 5 MB

**Response** (200):
```json
{
  "photo_url": "/uploads/user_1234567890-1234567890.webp",
  "thumbnail_url": "/uploads/user_1234567890-1234567890-thumb.webp",
  "message": "Photo uploaded successfully"
}
```

**Errors**:
- 400: No file uploaded
- 400: Invalid file type
- 413: File too large

**Side Effects**:
- Old photo is deleted
- Photo resized to 400x400px
- Thumbnail created 100x100px
- Converted to WebP format
- Original filename randomized

---

### DELETE /users/photo

Remove player profile photo.

**Request**:
```
DELETE /api/users/photo
```

**Response** (200):
```json
{
  "message": "Photo deleted"
}
```

**Errors**:
- 401: No token provided

---

### PUT /users/:id/promote

Promote player to admin. **Requires admin role**.

**Request**:
```
PUT /api/users/user_1234567891/promote
```

**Response** (200):
```json
{
  "message": "User promoted to admin"
}
```

**Errors**:
- 403: Admin access required
- 404: User not found

---

### DELETE /users/:id

Delete user account. **Requires admin role**.

**Request**:
```
DELETE /api/users/user_1234567891
```

**Response** (200):
```json
{
  "message": "User deleted"
}
```

**Side Effects**:
- User deleted from database
- All availability records deleted
- All notifications deleted
- Profile photo deleted

**Errors**:
- 403: Admin access required
- 404: User not found

---

## Notification Endpoints

### GET /notifications

Get user's notifications (up to 50 most recent).

**Request**:
```
GET /api/notifications
```

**Response** (200):
```json
[
  {
    "id": "notif_1234567890",
    "user_id": "user_admin",
    "type": "availability_change",
    "title": "John Doe marked as Playing",
    "message": "John Doe has marked themselves as \"Playing\" for the game on 2024-04-13 at 09:00",
    "related_game_id": "game_1234567890",
    "related_player_id": "user_1234567891",
    "read": 0,
    "created_at": "2024-04-03T10:45:00.000Z"
  },
  {
    "id": "notif_1234567891",
    "user_id": "user_player1",
    "type": "weekly_reminder",
    "title": "Weekend Games Reminder",
    "message": "Games coming up this weekend - sign up now!",
    "related_game_id": null,
    "related_player_id": null,
    "read": 0,
    "created_at": "2024-04-02T18:00:00.000Z"
  }
]
```

---

### GET /notifications/unread/count

Get count of unread notifications.

**Request**:
```
GET /api/notifications/unread/count
```

**Response** (200):
```json
{
  "unread_count": 3
}
```

---

### PUT /notifications/:id/read

Mark specific notification as read.

**Request**:
```
PUT /api/notifications/notif_1234567890/read
```

**Response** (200):
```json
{
  "message": "Notification marked as read"
}
```

---

### PUT /notifications/read/all

Mark all notifications as read.

**Request**:
```
PUT /api/notifications/read/all
```

**Response** (200):
```json
{
  "message": "All notifications marked as read"
}
```

---

### DELETE /notifications/:id

Delete a notification.

**Request**:
```
DELETE /api/notifications/notif_1234567890
```

**Response** (200):
```json
{
  "message": "Notification deleted"
}
```

---

## Statistics Endpoints

### GET /stats/game/:id

Get game statistics.

**Request**:
```
GET /api/stats/game/game_1234567890
```

**Response** (200):
```json
{
  "yes": 12,
  "no": 2,
  "maybe": 3,
  "total": 17
}
```

---

## System Endpoints

### GET /health

Health check endpoint.

**Request**:
```
GET /api/health
```

**Response** (200):
```json
{
  "status": "ok",
  "timestamp": "2024-04-03T15:30:45.123Z"
}
```

---

## Error Responses

All errors return appropriate HTTP status codes with error object:

```json
{
  "error": "Error message describing the issue"
}
```

### Common Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Game retrieved |
| 201 | Created | New game created |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | No token provided |
| 403 | Forbidden | Admin access required |
| 404 | Not Found | User/Game not found |
| 413 | Payload Too Large | File too large |
| 500 | Server Error | Database error |

---

## Rate Limiting

**Not yet implemented**. For production, add rate limiting:

```
Recommended:
- 100 requests per minute per IP
- 1000 requests per hour per user
```

---

## CORS

**Enabled** on all endpoints.

**Allowed Origins** (configurable via .env):
```
Default: All origins allowed
Production: Configure ALLOWED_ORIGINS
```

---

## Pagination

**Not implemented** for v1.0. Notifications limited to 50 most recent.

**For future versions**: Add `limit` and `offset` parameters.

---

## Webhooks

**Not available** in v1.0.

**Future**: Support for webhook notifications to external systems.

---

## Code Examples

### JavaScript / Fetch

**Login**:
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password'
  })
});

const { token, user } = await response.json();
localStorage.setItem('leagueToken', token);
```

**Get Games**:
```javascript
const response = await fetch('/api/games');
const games = await response.json();
```

**Update Availability**:
```javascript
const response = await fetch('/api/availability', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    game_id: 'game_123',
    status: 'yes'
  })
});
```

**Upload Photo**:
```javascript
const formData = new FormData();
formData.append('photo', fileInput.files[0]);

const response = await fetch('/api/users/photo/upload', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

---

## Testing

### Using cURL

**Login**:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password"}'
```

**Get Games**:
```bash
curl http://localhost:3001/api/games
```

**Get Notifications** (requires token):
```bash
curl http://localhost:3001/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. Create new request
2. Set method (POST/GET/etc)
3. Enter URL: `http://localhost:3001/api/...`
4. Add Authorization header with token
5. Add request body if needed
6. Send

---

## Troubleshooting

**401 Unauthorized**
- Check token is present
- Verify token hasn't expired
- Try logging in again

**403 Forbidden**
- Verify user is admin
- Check user role in database

**404 Not Found**
- Verify correct ID
- Check resource exists
- Verify spelling

**500 Server Error**
- Check server logs
- Check database connection
- Restart server

---

**API Version**: 1.0.0
**Last Updated**: 2024
**Status**: Production Ready
