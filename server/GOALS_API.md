# Goals API Documentation

## Overview
Complete CRUD API for managing goals with Uploadcare integration for banner images.

## Authentication
All goal endpoints require JWT authentication. Include the token in cookies or Authorization header.

## Endpoints

### 1. Upload Banner Image
Upload an image to Uploadcare for use as a goal banner.

```http
POST /api/goals/upload-banner
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Data:
- banner: <image file>
```

**Response:**
```json
{
  "success": true,
  "message": "Banner uploaded successfully",
  "data": {
    "uuid": "abc123-def456",
    "url": "https://ucarecdn.com/abc123-def456/",
    "originalUrl": "https://...",
    "name": "banner.jpg",
    "size": 152400,
    "mimeType": "image/jpeg"
  }
}
```

**Limits:**
- Max file size: 5MB
- Accepted formats: images only (jpg, png, gif, webp, etc.)

---

### 2. Create Goal
Create a new goal for the authenticated user.

```http
POST /api/goals
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Complete Marathon Training",
  "description": "Train for and complete a full marathon",
  "category": "FITNESS",
  "banner": "https://ucarecdn.com/abc123-def456/",
  "target_date": "2025-12-31",
  "status": "ACTIVE",
  "progress": 0,
  "priority": "HIGH",
  "tags": ["running", "fitness", "health"],
  "milestones": ["5K", "10K", "Half Marathon", "Full Marathon"],
  "notes": "Follow Hal Higdon training plan"
}
```

**Required Fields:**
- `title` (string)
- `category` (string)

**Optional Fields:**
- `description` (string)
- `banner` (string - Uploadcare URL)
- `target_date` (ISO date string)
- `status` (string: ACTIVE, COMPLETED, ARCHIVED, CANCELLED)
- `progress` (number: 0-100)
- `priority` (string: LOW, MEDIUM, HIGH)
- `tags` (array of strings)
- `milestones` (array of strings)
- `notes` (string)

**Response:**
```json
{
  "success": true,
  "message": "Goal created successfully",
  "data": {
    "goal_id": "uuid",
    "user_id": "uuid",
    "title": "Complete Marathon Training",
    "category": "FITNESS",
    "banner": "https://ucarecdn.com/abc123-def456/",
    "created_at": "2025-12-23T...",
    ...
  }
}
```

---

### 3. Get All Goals
Get all goals for the authenticated user.

```http
GET /api/goals?limit=100
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional, default: 100) - Max number of results

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

---

### 4. Get Goals by Status
Get goals filtered by status.

```http
GET /api/goals/status/:status?limit=100
Authorization: Bearer <token>
```

**Status Values:**
- `ACTIVE`
- `COMPLETED`
- `ARCHIVED`
- `CANCELLED`

**Example:**
```http
GET /api/goals/status/ACTIVE
```

---

### 5. Get Goals by Category
Get goals filtered by category.

```http
GET /api/goals/category/:category?limit=100
Authorization: Bearer <token>
```

**Example:**
```http
GET /api/goals/category/FITNESS
```

**Common Categories:**
- FITNESS
- CAREER
- EDUCATION
- PERSONAL
- FINANCE
- HEALTH
- TRAVEL
- HOBBY

---

### 6. Get Upcoming Goals
Get goals sorted by target date (upcoming first).

```http
GET /api/goals/upcoming?limit=50
Authorization: Bearer <token>
```

---

### 7. Get Single Goal
Get a specific goal by ID.

```http
GET /api/goals/:id
Authorization: Bearer <token>
```

**Example:**
```http
GET /api/goals/abc-123-def-456
```

---

### 8. Update Goal
Update an existing goal.

```http
PUT /api/goals/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "progress": 50,
  "status": "ACTIVE",
  "notes": "Updated training schedule"
}
```

**Updatable Fields:**
- `title`
- `description`
- `category`
- `banner`
- `target_date`
- `status`
- `progress`
- `priority`
- `tags`
- `milestones`
- `notes`

**Note:** Changing `status` or `category` will update all denormalized tables.

---

### 9. Delete Goal
Delete a goal.

```http
DELETE /api/goals/:id
Authorization: Bearer <token>
```

---

## Uploadcare Integration

### Setup

1. **Sign up for Uploadcare:**
   - Go to https://uploadcare.com/
   - Create an account
   - Get your Public Key from the dashboard

2. **Add to .env:**
   ```env
   UPLOADCARE_PUBLIC_KEY=your-public-key-here
   ```

3. **Upload Flow:**
   ```
   User selects image → POST /api/goals/upload-banner 
   → Get Uploadcare URL → Use URL in POST /api/goals
   ```

### Frontend Example (React):

```javascript
// Upload banner
const uploadBanner = async (file) => {
  const formData = new FormData();
  formData.append('banner', file);

  const response = await fetch('/api/goals/upload-banner', {
    method: 'POST',
    body: formData,
    credentials: 'include' // Include cookies
  });

  const data = await response.json();
  return data.data.url; // Uploadcare URL
};

// Create goal with banner
const createGoal = async (goalData) => {
  const bannerUrl = await uploadBanner(selectedFile);
  
  const response = await fetch('/api/goals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...goalData,
      banner: bannerUrl
    }),
    credentials: 'include'
  });

  return response.json();
};
```

---

## Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Title and category are required"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Authentication required. Please login."
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Unauthorized to access this goal"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Goal not found"
}
```

**500 Server Error:**
```json
{
  "success": false,
  "message": "Error creating goal",
  "error": "Detailed error message"
}
```

---

## Testing with Postman/Thunder Client

### 1. Login First
```http
POST /api/users/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 2. Upload Banner
```http
POST /api/goals/upload-banner
Form Data:
- banner: [Select file]
```

### 3. Create Goal
```http
POST /api/goals
{
  "title": "My Goal",
  "category": "FITNESS",
  "banner": "<url-from-step-2>"
}
```

### 4. Get Goals
```http
GET /api/goals
```

---

## Database Tables

Goals are stored across 5 denormalized tables for different query patterns:

1. **user_goals** - Main table, query by user_id
2. **goals_by_id** - Direct lookup by goal_id
3. **goals_by_status** - Filter by status
4. **goals_by_category** - Filter by category
5. **goals_by_target_date** - Sort by upcoming dates

All tables are kept in sync automatically by the GoalModel.

---

## Best Practices

1. **Always upload banner first**, then use the URL when creating the goal
2. **Use Uploadcare CDN URLs** for fast image delivery
3. **Set reasonable limits** when fetching goals (default: 100)
4. **Update progress regularly** to track goal completion
5. **Use meaningful categories** to organize goals
6. **Add tags** for better filtering and search
7. **Set target dates** for time-bound goals

---

## Categories

Recommended goal categories:
- **FITNESS** - Exercise, sports, health
- **CAREER** - Job, promotion, skills
- **EDUCATION** - Learning, courses, degrees
- **PERSONAL** - Relationships, habits, mindfulness
- **FINANCE** - Savings, investments, income
- **HEALTH** - Diet, medical, wellness
- **TRAVEL** - Trips, destinations
- **HOBBY** - Creative projects, collections
- **HOME** - Renovation, organization
- **FAMILY** - Events, milestones


