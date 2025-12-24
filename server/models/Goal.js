import { client } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

export const GoalModel = {
    /**
     * Create a new goal across all denormalized tables
     * @param {Object} goalData - Goal information
     * @returns {Promise<Object>} Created goal object
     */
    async create(goalData) {
        const {
            user_id,
            title,
            description,
            category,
            banner,
            target_date,
            status = 'not_started',
            progress = 0,
            priority = 'medium',
            tags = [],
            milestones = [],
            notes
        } = goalData;

        const goalId = uuidv4();
        const now = new Date();

        const queries = [
            // 1. Insert into main user_goals table
            {
                query: `INSERT INTO goals.user_goals (goal_id, user_id, title, description, category, 
                        banner, target_date, created_at, updated_at, status, progress, priority, tags, milestones, notes)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                params: [goalId, user_id, title, description, category, banner, target_date, now, now,
                    status, progress, priority, tags, milestones, notes]
            },
            // 2. Insert into goals_by_id table
            {
                query: `INSERT INTO goals.goals_by_id (goal_id, user_id, title, description, category, 
                        banner, target_date, created_at, updated_at, status, progress, priority)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                params: [goalId, user_id, title, description, category, banner, target_date, now, now,
                    status, progress, priority]
            },
            // 3. Insert into goals_by_status table
            {
                query: `INSERT INTO goals.goals_by_status (user_id, status, created_at, goal_id, 
                        title, banner, target_date, progress)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                params: [user_id, status, now, goalId, title, banner, target_date, progress]
            },
            // 4. Insert into goals_by_category table
            {
                query: `INSERT INTO goals.goals_by_category (user_id, category, created_at, goal_id, 
                        title, banner, status, progress)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                params: [user_id, category, now, goalId, title, banner, status, progress]
            },
            // 5. Insert into goals_by_target_date table
            {
                query: `INSERT INTO goals.goals_by_target_date (user_id, target_date, goal_id, 
                        title, banner, status, progress)
                        VALUES (?, ?, ?, ?, ?, ?, ?)`,
                params: [user_id, target_date, goalId, title, banner, status, progress]
            }
        ];

        // Execute all inserts in a batch
        const batchQueries = queries.map(q => ({ query: q.query, params: q.params }));
        await client.batch(batchQueries, { prepare: true });

        return {
            goal_id: goalId,
            user_id,
            title,
            description,
            category,
            banner,
            target_date,
            created_at: now,
            updated_at: now,
            status,
            progress,
            priority,
            tags,
            milestones,
            notes
        };
    },

    /**
     * Find goal by ID
     * @param {string} goalId - UUID string
     * @returns {Promise<Object|null>}
     */
    async findById(goalId) {
        const query = 'SELECT * FROM goals.goals_by_id WHERE goal_id = ?';
        const result = await client.execute(query, [goalId], { prepare: true });

        return result.rows.length > 0 ? result.rows[0] : null;
    },

    /**
     * Get all goals for a user
     * @param {string} userId - UUID string
     * @param {number} limit - Max number of results
     * @returns {Promise<Array>}
     */
    async findByUserId(userId, limit = 100) {
        const query = `SELECT * FROM goals.user_goals WHERE user_id = ? LIMIT ?`;
        const result = await client.execute(query, [userId, limit], { prepare: true });

        return result.rows;
    },

    /**
     * Get goals by status for a user
     * @param {string} userId
     * @param {string} status - 'ACTIVE', 'COMPLETED', 'ARCHIVED', 'CANCELLED'
     * @param {number} limit
     * @returns {Promise<Array>}
     */
    async findByStatus(userId, status, limit = 100) {
        const query = `SELECT * FROM goals.goals_by_status WHERE user_id = ? AND status = ? LIMIT ?`;
        const result = await client.execute(query, [userId, status, limit], { prepare: true });

        return result.rows;
    },

    /**
     * Get goals by category for a user
     * @param {string} userId
     * @param {string} category
     * @param {number} limit
     * @returns {Promise<Array>}
     */
    async findByCategory(userId, category, limit = 100) {
        const query = `SELECT * FROM goals.goals_by_category WHERE user_id = ? AND category = ? LIMIT ?`;
        const result = await client.execute(query, [userId, category, limit], { prepare: true });

        return result.rows;
    },

    /**
     * Get upcoming goals by target date
     * @param {string} userId
     * @param {number} limit
     * @returns {Promise<Array>}
     */
    async findUpcoming(userId, limit = 50) {
        const query = `SELECT * FROM goals.goals_by_target_date WHERE user_id = ? LIMIT ?`;
        const result = await client.execute(query, [userId, limit], { prepare: true });

        return result.rows;
    },

    /**
     * Update goal
     * @param {string} goalId
     * @param {Object} updates
     * @returns {Promise<boolean>}
     */
    async update(goalId, updates) {
        // First get the goal to know user_id and created_at
        const goal = await this.findById(goalId);
        if (!goal) throw new Error('Goal not found');

        const now = new Date();
        const queries = [];

        // Build update for main table
        const mainFields = [];
        const mainParams = [];

        if (updates.title !== undefined) {
            mainFields.push('title = ?');
            mainParams.push(updates.title);
        }
        if (updates.description !== undefined) {
            mainFields.push('description = ?');
            mainParams.push(updates.description);
        }
        if (updates.category !== undefined) {
            mainFields.push('category = ?');
            mainParams.push(updates.category);
        }
        if (updates.banner !== undefined) {
            mainFields.push('banner = ?');
            mainParams.push(updates.banner);
        }
        if (updates.target_date !== undefined) {
            mainFields.push('target_date = ?');
            mainParams.push(updates.target_date);
        }
        if (updates.status !== undefined) {
            mainFields.push('status = ?');
            mainParams.push(updates.status);
        }
        if (updates.progress !== undefined) {
            mainFields.push('progress = ?');
            mainParams.push(updates.progress);
        }
        if (updates.priority !== undefined) {
            mainFields.push('priority = ?');
            mainParams.push(updates.priority);
        }
        if (updates.tags !== undefined) {
            mainFields.push('tags = ?');
            mainParams.push(updates.tags);
        }
        if (updates.milestones !== undefined) {
            mainFields.push('milestones = ?');
            mainParams.push(updates.milestones);
        }
        if (updates.notes !== undefined) {
            mainFields.push('notes = ?');
            mainParams.push(updates.notes);
        }

        mainFields.push('updated_at = ?');
        mainParams.push(now);

        if (mainFields.length > 0) {
            queries.push({
                query: `UPDATE goals.user_goals SET ${mainFields.join(', ')} 
                        WHERE user_id = ? AND created_at = ? AND goal_id = ?`,
                params: [...mainParams, goal.user_id, goal.created_at, goalId]
            });

            // Update goals_by_id table
            const idFields = mainFields.filter(f =>
                !f.includes('tags') && !f.includes('milestones') && !f.includes('notes')
            );
            const idParams = mainParams.filter((_, i) =>
                !mainFields[i].includes('tags') && !mainFields[i].includes('milestones') && !mainFields[i].includes('notes')
            );

            if (idFields.length > 0) {
                queries.push({
                    query: `UPDATE goals.goals_by_id SET ${idFields.join(', ')} WHERE goal_id = ?`,
                    params: [...idParams, goalId]
                });
            }
        }

        // If status changed, update goals_by_status
        if (updates.status && updates.status !== goal.status) {
            // Delete old status entry
            queries.push({
                query: `DELETE FROM goals.goals_by_status 
                        WHERE user_id = ? AND status = ? AND created_at = ? AND goal_id = ?`,
                params: [goal.user_id, goal.status, goal.created_at, goalId]
            });

            // Insert new status entry
            queries.push({
                query: `INSERT INTO goals.goals_by_status (user_id, status, created_at, goal_id, 
                        title, banner, target_date, progress)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                params: [goal.user_id, updates.status, goal.created_at, goalId,
                updates.title || goal.title, updates.banner || goal.banner,
                updates.target_date || goal.target_date, updates.progress || goal.progress]
            });
        }

        // If category changed, update goals_by_category
        if (updates.category && updates.category !== goal.category) {
            // Delete old category entry
            queries.push({
                query: `DELETE FROM goals.goals_by_category 
                        WHERE user_id = ? AND category = ? AND created_at = ? AND goal_id = ?`,
                params: [goal.user_id, goal.category, goal.created_at, goalId]
            });

            // Insert new category entry
            queries.push({
                query: `INSERT INTO goals.goals_by_category (user_id, category, created_at, goal_id, 
                        title, banner, status, progress)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                params: [goal.user_id, updates.category, goal.created_at, goalId,
                updates.title || goal.title, updates.banner || goal.banner,
                updates.status || goal.status, updates.progress || goal.progress]
            });
        }

        if (queries.length > 0) {
            const batchQueries = queries.map(q => ({ query: q.query, params: q.params }));
            await client.batch(batchQueries, { prepare: true });
        }

        return true;
    },

    /**
     * Delete goal from all tables
     * @param {string} goalId
     * @returns {Promise<boolean>}
     */
    async delete(goalId) {
        const goal = await this.findById(goalId);
        if (!goal) throw new Error('Goal not found');

        const queries = [
            {
                query: 'DELETE FROM goals.user_goals WHERE user_id = ? AND created_at = ? AND goal_id = ?',
                params: [goal.user_id, goal.created_at, goalId]
            },
            {
                query: 'DELETE FROM goals.goals_by_id WHERE goal_id = ?',
                params: [goalId]
            },
            {
                query: 'DELETE FROM goals.goals_by_status WHERE user_id = ? AND status = ? AND created_at = ? AND goal_id = ?',
                params: [goal.user_id, goal.status, goal.created_at, goalId]
            },
            {
                query: 'DELETE FROM goals.goals_by_category WHERE user_id = ? AND category = ? AND created_at = ? AND goal_id = ?',
                params: [goal.user_id, goal.category, goal.created_at, goalId]
            },
            {
                query: 'DELETE FROM goals.goals_by_target_date WHERE user_id = ? AND target_date = ? AND goal_id = ?',
                params: [goal.user_id, goal.target_date, goalId]
            }
        ];

        const batchQueries = queries.map(q => ({ query: q.query, params: q.params }));
        await client.batch(batchQueries, { prepare: true });

        return true;
    }
};
