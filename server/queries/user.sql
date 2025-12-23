-- 1. First, create the keyspace for your goals application
CREATE KEYSPACE IF NOT EXISTS goals
WITH replication = {
    'class': 'SimpleStrategy', 
    'replication_factor': 1
};

-- 2. Switch to the goals keyspace
USE goals;

-- 3. Create main users table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID,
    username TEXT,
    email TEXT,
    password_hash TEXT,
    salt TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    last_login TIMESTAMP,
    login_attempts INT,
    account_status TEXT, -- 'ACTIVE', 'LOCKED', 'PENDING_VERIFICATION'
    email_verified BOOLEAN,
    mfa_enabled BOOLEAN,
    profile_data MAP<TEXT, TEXT>,
    PRIMARY KEY ((email), user_id)
) WITH CLUSTERING ORDER BY (user_id ASC);

-- 4. Query table by username
CREATE TABLE IF NOT EXISTS goals_users_by_username (
    username TEXT,
    user_id UUID,
    email TEXT,
    account_status TEXT,
    PRIMARY KEY ((username), user_id)
);

-- 5. Query table by user_id
CREATE TABLE IF NOT EXISTS goals_users_by_id (
    user_id UUID PRIMARY KEY,
    username TEXT,
    email TEXT,
    account_status TEXT
);

-- 6. Password reset tokens (auto-expires after 24 hours)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    token UUID PRIMARY KEY,
    user_id UUID,
    email TEXT,
    created_at TIMESTAMP,
    expires_at TIMESTAMP,
    used BOOLEAN
) WITH default_time_to_live = 86400;

-- 7. [OPTIONAL] Add goals table for your application
CREATE TABLE IF NOT EXISTS user_goals (
    goal_id UUID,
    user_id UUID,
    title TEXT,
    description TEXT,
    category TEXT,
    target_date TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    status TEXT, -- 'ACTIVE', 'COMPLETED', 'ARCHIVED'
    progress INT, -- 0-100 percentage
    tags SET<TEXT>,
    PRIMARY KEY ((user_id), created_at, goal_id)
) WITH CLUSTERING ORDER BY (created_at DESC);


-- Example on insert 
USE goals;

-- Insert a test user
INSERT INTO users (user_id, username, email, password_hash, salt, 
                  created_at, updated_at, account_status, email_verified)
VALUES (
    uuid(), 
    'testuser', 
    'test@example.com', 
    'hashed_password_here', 
    'salt_here',
    toTimestamp(now()), 
    toTimestamp(now()), 
    'ACTIVE', 
    false
);

-- Check tables were created
DESCRIBE TABLES;

-- See table structure
DESCRIBE TABLE users;

-- Count users
SELECT COUNT(*) FROM users;