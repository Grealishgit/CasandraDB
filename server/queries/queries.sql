-- Goals Management Queries for Cassandra

-- 1. Main goals table (query by user_id)
CREATE TABLE IF NOT EXISTS goals.user_goals (
    goal_id UUID,
    user_id UUID,
    title TEXT,
    description TEXT,
    category TEXT,
    banner TEXT, -- URL or base64 encoded image
    target_date TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    status TEXT, -- 'ACTIVE', 'COMPLETED', 'ARCHIVED', 'CANCELLED'
    progress INT, -- 0-100 percentage
    priority TEXT, -- 'LOW', 'MEDIUM', 'HIGH'
    tags SET<TEXT>,
    milestones LIST<TEXT>,
    notes TEXT,
    PRIMARY KEY ((user_id), created_at, goal_id)
) WITH CLUSTERING ORDER BY (created_at DESC);

-- 2. Query goals by goal_id (for direct access)
CREATE TABLE IF NOT EXISTS goals.goals_by_id (
    goal_id UUID PRIMARY KEY,
    user_id UUID,
    title TEXT,
    description TEXT,
    category TEXT,
    banner TEXT,
    target_date TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    status TEXT,
    progress INT,
    priority TEXT
);

-- 3. Query goals by status (e.g., get all active goals for a user)
CREATE TABLE IF NOT EXISTS goals.goals_by_status (
    user_id UUID,
    status TEXT,
    created_at TIMESTAMP,
    goal_id UUID,
    title TEXT,
    banner TEXT,
    target_date TIMESTAMP,
    progress INT,
    PRIMARY KEY ((user_id, status), created_at, goal_id)
) WITH CLUSTERING ORDER BY (created_at DESC);

-- 4. Query goals by category (e.g., all 'FITNESS' goals)
CREATE TABLE IF NOT EXISTS goals.goals_by_category (
    user_id UUID,
    category TEXT,
    created_at TIMESTAMP,
    goal_id UUID,
    title TEXT,
    banner TEXT,
    status TEXT,
    progress INT,
    PRIMARY KEY ((user_id, category), created_at, goal_id)
) WITH CLUSTERING ORDER BY (created_at DESC);

-- 5. Query goals by target date (upcoming goals)
CREATE TABLE IF NOT EXISTS goals.goals_by_target_date (
    user_id UUID,
    target_date TIMESTAMP,
    goal_id UUID,
    title TEXT,
    banner TEXT,
    status TEXT,
    progress INT,
    PRIMARY KEY ((user_id), target_date, goal_id)
) WITH CLUSTERING ORDER BY (target_date ASC);


-- Example: Insert a new goal
-- INSERT INTO goals.user_goals (
--     goal_id, user_id, title, description, category, banner,
--     target_date, created_at, updated_at, status, progress, priority, tags, notes
-- ) VALUES (
--     uuid(),
--     <user_uuid>,
--     'Complete Marathon Training',
--     'Train for and complete a full marathon by end of year',
--     'FITNESS',
--     'https://27gy2ox4et.ucarecd.net/6ccdf251-3650-4e5a-b187-5c449caf366e/pngwingcom2.png',
--     '2025-12-31',
--     toTimestamp(now()),
--     toTimestamp(now()),
--     'ACTIVE',
--     25,
--     'HIGH',
--     {'running', 'fitness', 'health'},
--     'Follow Hal Higdon training plan'
-- );


-- Example: Get all goals for a user
-- SELECT * FROM goals.user_goals WHERE user_id = <user_uuid>;

-- Example: Get active goals for a user
-- SELECT * FROM goals.goals_by_status WHERE user_id = <user_uuid> AND status = 'ACTIVE';

-- Example: Get goals by category
-- SELECT * FROM goals.goals_by_category WHERE user_id = <user_uuid> AND category = 'FITNESS';

-- Example: Get a specific goal
-- SELECT * FROM goals.goals_by_id WHERE goal_id = <goal_uuid>;

-- Example: Update goal progress
-- UPDATE goals.user_goals 
-- SET progress = 50, updated_at = toTimestamp(now())
-- WHERE user_id = <user_uuid> AND created_at = <created_timestamp> AND goal_id = <goal_uuid>;

-- Example: Delete a goal
-- DELETE FROM goals.user_goals WHERE user_id = <user_uuid> AND created_at = <created_timestamp> AND goal_id = <goal_uuid>;


-- Notes:
-- 1. banner column stores either:
--    - URL to an image (e.g., 'https://cdn.example.com/banners/123.jpg')
--    - Base64 encoded image (for small images)
--    - NULL if no banner
--
-- 2. For large images, it's recommended to:
--    - Store images in cloud storage (AWS S3, Azure Blob, etc.)
--    - Store only the URL in the banner column
--    - Use a CDN for fast delivery
--
-- 3. If storing base64, use BLOB type instead:
--    banner BLOB
--
-- 4. The denormalized tables (goals_by_status, goals_by_category, etc.)
--    must be kept in sync when inserting/updating/deleting goals
