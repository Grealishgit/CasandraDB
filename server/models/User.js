import { client } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const UserModel = {
    /**
     * Create a new user across all denormalized tables
     * @param {Object} userData - { username, email, password, profileData }
     * @returns {Promise<Object>} Created user object
     */
    async create(userData) {
        const { username, email, password, profileData = {} } = userData;

        // Generate user_id, hash password, and create salt
        const userId = uuidv4();
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const passwordHash = await bcrypt.hash(password, salt);
        const now = new Date();

        const queries = [
            // 1. Insert into main users table
            {
                query: `INSERT INTO goals.users (user_id, username, email, password_hash, salt, 
                created_at, updated_at, login_attempts, account_status, 
                email_verified, mfa_enabled, profile_data)
                VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'PENDING_VERIFICATION', false, false, ?)`,
                params: [userId, username, email, passwordHash, salt, now, now, profileData]
            },
            // 2. Insert into goals_users_by_username table
            {
                query: `INSERT INTO goals.goals_users_by_username (username, user_id, email, account_status)
                VALUES (?, ?, ?, 'PENDING_VERIFICATION')`,
                params: [username, userId, email]
            },
            // 3. Insert into goals_users_by_id table
            {
                query: `INSERT INTO goals.goals_users_by_id (user_id, username, email, account_status)
                VALUES (?, ?, ?, 'PENDING_VERIFICATION')`,
                params: [userId, username, email]
            }
        ];

        // Execute all inserts in a batch
        const batchQueries = queries.map(q => ({ query: q.query, params: q.params }));
        await client.batch(batchQueries, { prepare: true });

        return {
            user_id: userId,
            username,
            email,
            account_status: 'PENDING_VERIFICATION',
            email_verified: false,
            mfa_enabled: false,
            created_at: now
        };
    },

    /**
     * Find user by email (primary key in main users table)
     * @param {string} email
     * @returns {Promise<Object|null>}
     */
    async findByEmail(email) {
        const query = 'SELECT * FROM goals.users WHERE email = ? LIMIT 1';
        const result = await client.execute(query, [email], { prepare: true });

        return result.rows.length > 0 ? result.rows[0] : null;
    },

    /**
     * Find user by username (uses goals_users_by_username table)
     * @param {string} username
     * @returns {Promise<Object|null>}
     */
    async findByUsername(username) {
        const query = 'SELECT * FROM goals.goals_users_by_username WHERE username = ? LIMIT 1';
        const result = await client.execute(query, [username], { prepare: true });

        if (result.rows.length === 0) return null;

        // Get full user data from main table
        const userData = result.rows[0];
        return this.findByEmail(userData.email);
    },

    /**
     * Find user by user_id (uses goals_users_by_id table)
     * @param {string} userId - UUID string
     * @returns {Promise<Object|null>}
     */
    async findById(userId) {
        const query = 'SELECT * FROM goals.goals_users_by_id WHERE user_id = ?';
        const result = await client.execute(query, [userId], { prepare: true });

        if (result.rows.length === 0) return null;

        // Get full user data from main table
        const userData = result.rows[0];
        return this.findByEmail(userData.email);
    },

    /**
     * Update user information (updates all denormalized tables)
     * @param {string} userId
     * @param {Object} updates - Fields to update
     * @returns {Promise<boolean>}
     */
    async update(userId, updates) {
        // First get current user data to know the email (partition key)
        const user = await this.findById(userId);
        if (!user) throw new Error('User not found');

        const { email } = user;
        const now = new Date();
        const queries = [];

        // Build update query for main users table
        const mainTableFields = [];
        const mainTableParams = [];

        if (updates.username) {
            mainTableFields.push('username = ?');
            mainTableParams.push(updates.username);
        }
        if (updates.password_hash) {
            mainTableFields.push('password_hash = ?');
            mainTableParams.push(updates.password_hash);
        }
        if (updates.last_login) {
            mainTableFields.push('last_login = ?');
            mainTableParams.push(updates.last_login);
        }
        if (updates.login_attempts !== undefined) {
            mainTableFields.push('login_attempts = ?');
            mainTableParams.push(updates.login_attempts);
        }
        if (updates.account_status) {
            mainTableFields.push('account_status = ?');
            mainTableParams.push(updates.account_status);
        }
        if (updates.email_verified !== undefined) {
            mainTableFields.push('email_verified = ?');
            mainTableParams.push(updates.email_verified);
        }
        if (updates.mfa_enabled !== undefined) {
            mainTableFields.push('mfa_enabled = ?');
            mainTableParams.push(updates.mfa_enabled);
        }
        if (updates.profile_data) {
            mainTableFields.push('profile_data = ?');
            mainTableParams.push(updates.profile_data);
        }

        mainTableFields.push('updated_at = ?');
        mainTableParams.push(now);

        if (mainTableFields.length > 0) {
            queries.push({
                query: `UPDATE goals.users SET ${mainTableFields.join(', ')} 
                WHERE email = ? AND user_id = ?`,
                params: [...mainTableParams, email, userId]
            });
        }

        // Update denormalized tables if username or account_status changed
        if (updates.username || updates.account_status) {
            queries.push({
                query: `UPDATE goals.goals_users_by_username 
                SET ${updates.username ? 'email = ?' : ''}
                ${updates.username && updates.account_status ? ',' : ''}
                ${updates.account_status ? 'account_status = ?' : ''}
                WHERE username = ? AND user_id = ?`,
                params: [
                    ...(updates.username ? [email] : []),
                    ...(updates.account_status ? [updates.account_status] : []),
                    user.username,
                    userId
                ]
            });

            queries.push({
                query: `UPDATE goals.goals_users_by_id 
                SET ${updates.username ? 'username = ?' : ''}
                ${updates.username && updates.account_status ? ',' : ''}
                ${updates.account_status ? 'account_status = ?' : ''}
                WHERE user_id = ?`,
                params: [
                    ...(updates.username ? [updates.username] : []),
                    ...(updates.account_status ? [updates.account_status] : []),
                    userId
                ]
            });
        }

        if (queries.length > 0) {
            const batchQueries = queries.map(q => ({ query: q.query, params: q.params }));
            await client.batch(batchQueries, { prepare: true });
        }

        return true;
    },

    /**
     * Verify user password
     * @param {string} email
     * @param {string} password
     * @returns {Promise<Object|null>} User object if password matches, null otherwise
     */
    async verifyPassword(email, password) {
        const user = await this.findByEmail(email);
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password_hash);
        return isMatch ? user : null;
    },

    /**
     * Update last login timestamp
     * @param {string} userId
     * @returns {Promise<boolean>}
     */
    async updateLastLogin(userId) {
        return this.update(userId, { last_login: new Date() });
    },

    /**
     * Increment login attempts
     * @param {string} email
     * @returns {Promise<boolean>}
     */
    async incrementLoginAttempts(email) {
        const user = await this.findByEmail(email);
        if (!user) return false;

        const newAttempts = (user.login_attempts || 0) + 1;
        const updates = { login_attempts: newAttempts };

        // Lock account after 5 failed attempts
        if (newAttempts >= 5) {
            updates.account_status = 'LOCKED';
        }

        return this.update(user.user_id.toString(), updates);
    },

    /**
     * Reset login attempts
     * @param {string} userId
     * @returns {Promise<boolean>}
     */
    async resetLoginAttempts(userId) {
        return this.update(userId, { login_attempts: 0 });
    },

    /**
     * Delete user from all tables
     * @param {string} userId
     * @returns {Promise<boolean>}
     */
    async delete(userId) {
        const user = await this.findById(userId);
        if (!user) throw new Error('User not found');

        const queries = [
            {
                query: 'DELETE FROM goals.users WHERE email = ? AND user_id = ?',
                params: [user.email, userId]
            },
            {
                query: 'DELETE FROM goals.goals_users_by_username WHERE username = ? AND user_id = ?',
                params: [user.username, userId]
            },
            {
                query: 'DELETE FROM goals.goals_users_by_id WHERE user_id = ?',
                params: [userId]
            }
        ];

        const batchQueries = queries.map(q => ({ query: q.query, params: q.params }));
        await client.batch(batchQueries, { prepare: true });

        return true;
    },

    /**
     * Create password reset token
     * @param {string} email
     * @returns {Promise<string>} Reset token UUID
     */
    async createPasswordResetToken(email) {
        const user = await this.findByEmail(email);
        if (!user) throw new Error('User not found');

        const token = uuidv4();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

        const query = `INSERT INTO goals.password_reset_tokens 
                   (token, user_id, email, created_at, expires_at, used)
                   VALUES (?, ?, ?, ?, ?, false)`;

        await client.execute(query, [token, user.user_id, email, now, expiresAt], { prepare: true });

        return token;
    },

    /**
     * Verify and use password reset token
     * @param {string} token
     * @returns {Promise<Object|null>} User email if valid, null if invalid/expired
     */
    async verifyPasswordResetToken(token) {
        const query = 'SELECT * FROM goals.password_reset_tokens WHERE token = ?';
        const result = await client.execute(query, [token], { prepare: true });

        if (result.rows.length === 0) return null;

        const tokenData = result.rows[0];
        const now = new Date();

        // Check if token is expired or already used
        if (tokenData.used || now > tokenData.expires_at) {
            return null;
        }

        // Mark token as used
        const updateQuery = 'UPDATE goals.password_reset_tokens SET used = true WHERE token = ?';
        await client.execute(updateQuery, [token], { prepare: true });

        return { email: tokenData.email, user_id: tokenData.user_id };
    },

    /**
     * Reset user password
     * @param {string} email
     * @param {string} newPassword
     * @returns {Promise<boolean>}
     */
    async resetPassword(email, newPassword) {
        const user = await this.findByEmail(email);
        if (!user) throw new Error('User not found');

        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        return this.update(user.user_id.toString(), {
            password_hash: passwordHash,
            login_attempts: 0,
            account_status: 'ACTIVE'
        });
    }
};
