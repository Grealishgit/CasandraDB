import { GoalModel } from '../models/Goal.js';
import { UploadClient } from '@uploadcare/upload-client';

// Initialize Uploadcare client
const uploadcareClient = new UploadClient({
    publicKey: process.env.UPLOADCARE_PUBLIC_KEY
});

/**
 * @route   POST /api/goals
 * @desc    Create a new goal
 * @access  Private
 */
export const createGoal = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            banner,
            target_date,
            status,
            progress,
            priority,
            tags,
            milestones,
            notes
        } = req.body;

        // Get user_id from authenticated user
        const user_id = req.user.userId;

        // Validate required fields
        if (!title || !category) {
            return res.status(400).json({
                success: false,
                message: 'Title and category are required'
            });
        }

        // Create goal
        const newGoal = await GoalModel.create({
            user_id,
            title,
            description,
            category,
            banner, // Uploadcare URL or null
            target_date: target_date ? new Date(target_date) : null,
            status,
            progress,
            priority,
            tags,
            milestones,
            notes
        });

        res.status(201).json({
            success: true,
            message: 'Goal created successfully',
            data: newGoal
        });

    } catch (error) {
        console.error('Create goal error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating goal',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/goals/upload-banner
 * @desc    Upload banner image to Uploadcare
 * @access  Private
 */
export const uploadBanner = async (req, res) => {
    try {
        if (!req.file && !req.body.file) {
            return res.status(400).json({
                success: false,
                message: 'No file provided'
            });
        }

        // If file is provided as base64 or buffer
        const fileData = req.file ? req.file.buffer : req.body.file;

        // Upload to Uploadcare
        const result = await uploadcareClient.uploadFile(fileData);

        // Log the full result to see what Uploadcare returns
        console.log('Uploadcare upload result:', JSON.stringify(result, null, 2));

        // Construct the proper CDN URL using your custom domain
        const cdnBase = process.env.UPLOADCARE_CDN_BASE || 'https://ucarecdn.com';
        const cdnUrl = `${cdnBase}/${result.uuid}/`;

        res.status(200).json({
            success: true,
            message: 'Banner uploaded successfully',
            data: {
                uuid: result.uuid,
                url: cdnUrl,
                cdnUrl: cdnUrl,
                originalUrl: result.originalUrl,
                name: result.name,
                size: result.size,
                mimeType: result.mimeType
            }
        });

    } catch (error) {
        console.error('Upload banner error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading banner',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/goals
 * @desc    Get all goals for authenticated user
 * @access  Private
 */
export const getGoals = async (req, res) => {
    try {
        const user_id = req.user.userId;
        const { limit = 100 } = req.query;

        const goals = await GoalModel.findByUserId(user_id, parseInt(limit));

        res.status(200).json({
            success: true,
            count: goals.length,
            data: goals
        });

    } catch (error) {
        console.error('Get goals error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching goals',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/goals/status/:status
 * @desc    Get goals by status
 * @access  Private
 */
export const getGoalsByStatus = async (req, res) => {
    try {
        const user_id = req.user.userId;
        const { status } = req.params;
        const { limit = 100 } = req.query;

        const goals = await GoalModel.findByStatus(user_id, status.toUpperCase(), parseInt(limit));

        res.status(200).json({
            success: true,
            count: goals.length,
            data: goals
        });

    } catch (error) {
        console.error('Get goals by status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching goals',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/goals/category/:category
 * @desc    Get goals by category
 * @access  Private
 */
export const getGoalsByCategory = async (req, res) => {
    try {
        const user_id = req.user.userId;
        const { category } = req.params;
        const { limit = 100 } = req.query;

        const goals = await GoalModel.findByCategory(user_id, category.toUpperCase(), parseInt(limit));

        res.status(200).json({
            success: true,
            count: goals.length,
            data: goals
        });

    } catch (error) {
        console.error('Get goals by category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching goals',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/goals/upcoming
 * @desc    Get upcoming goals sorted by target date
 * @access  Private
 */
export const getUpcomingGoals = async (req, res) => {
    try {
        const user_id = req.user.userId;
        const { limit = 50 } = req.query;

        const goals = await GoalModel.findUpcoming(user_id, parseInt(limit));

        res.status(200).json({
            success: true,
            count: goals.length,
            data: goals
        });

    } catch (error) {
        console.error('Get upcoming goals error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching upcoming goals',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/goals/:id
 * @desc    Get single goal by ID
 * @access  Private
 */
export const getGoal = async (req, res) => {
    try {
        const { id } = req.params;

        const goal = await GoalModel.findById(id);

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }

        // Verify the goal belongs to the authenticated user
        if (goal.user_id.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to access this goal'
            });
        }

        res.status(200).json({
            success: true,
            data: goal
        });

    } catch (error) {
        console.error('Get goal error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching goal',
            error: error.message
        });
    }
};

/**
 * @route   PUT /api/goals/:id
 * @desc    Update a goal
 * @access  Private
 */
export const updateGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Get the goal first to verify ownership
        const goal = await GoalModel.findById(id);

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }

        // Verify the goal belongs to the authenticated user
        if (goal.user_id.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to update this goal'
            });
        }

        // Convert target_date to Date if provided
        if (updates.target_date) {
            updates.target_date = new Date(updates.target_date);
        }

        // Update goal
        await GoalModel.update(id, updates);

        // Get updated goal
        const updatedGoal = await GoalModel.findById(id);

        res.status(200).json({
            success: true,
            message: 'Goal updated successfully',
            data: updatedGoal
        });

    } catch (error) {
        console.error('Update goal error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating goal',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/goals/:id
 * @desc    Delete a goal
 * @access  Private
 */
export const deleteGoal = async (req, res) => {
    try {
        const { id } = req.params;

        // Get the goal first to verify ownership
        const goal = await GoalModel.findById(id);

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }

        // Verify the goal belongs to the authenticated user
        if (goal.user_id.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to delete this goal'
            });
        }

        // Delete goal
        await GoalModel.delete(id);

        res.status(200).json({
            success: true,
            message: 'Goal deleted successfully'
        });

    } catch (error) {
        console.error('Delete goal error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting goal',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/goals/stats
 * @desc    Get goal statistics for dashboard
 * @access  Private
 */
export const getGoalStats = async (req, res) => {
    try {
        const user_id = req.user.userId;

        // Fetch all user's goals
        const allGoals = await GoalModel.findByUserId(user_id, 1000);

        console.log('Fetched goals for stats:', allGoals.length);
        console.log('Sample goal statuses:', allGoals.slice(0, 3).map(g => ({ title: g.title, status: g.status })));

        // Calculate stats - handle both uppercase and lowercase status values
        const totalGoals = allGoals.length;
        const completedGoals = allGoals.filter(g =>
            g.status && (g.status.toUpperCase() === 'COMPLETED' || g.status.toLowerCase() === 'completed')
        ).length;
        const inProgressGoals = allGoals.filter(g =>
            g.status && (g.status.toUpperCase() === 'IN_PROGRESS' || g.status.toLowerCase() === 'in_progress')
        ).length;
        const overdueGoals = allGoals.filter(g => {
            if (!g.target_date) return false;
            const targetDate = new Date(g.target_date);
            const now = new Date();
            const isCompleted = g.status && (g.status.toUpperCase() === 'COMPLETED' || g.status.toLowerCase() === 'completed');
            return targetDate < now && !isCompleted;
        }).length;

        console.log('Stats calculated:', { totalGoals, completedGoals, inProgressGoals, overdueGoals });

        // Calculate monthly distribution for current year
        const currentYear = new Date().getFullYear();
        const monthlyDistribution = Array.from({ length: 12 }, (_, i) => {
            const monthName = new Date(currentYear, i, 1).toLocaleString('default', { month: 'long' });
            const goalsInMonth = allGoals.filter(g => {
                if (!g.target_date) return false;
                const goalDate = new Date(g.target_date);
                return goalDate.getMonth() === i && goalDate.getFullYear() === currentYear;
            });
            const completed = goalsInMonth.filter(g =>
                g.status && (g.status.toUpperCase() === 'COMPLETED' || g.status.toLowerCase() === 'completed')
            ).length;

            return {
                id: i + 1,
                month: monthName,
                goals: goalsInMonth.length,
                completed
            };
        });

        // Calculate success rate
        const successRate = totalGoals > 0 ? ((completedGoals / totalGoals) * 100).toFixed(1) : 0;

        // Calculate this month's goals
        const currentMonth = new Date().getMonth();
        const thisMonthGoals = allGoals.filter(g => {
            if (!g.target_date) return false;
            const goalDate = new Date(g.target_date);
            return goalDate.getMonth() === currentMonth && goalDate.getFullYear() === currentYear;
        }).length;

        res.status(200).json({
            success: true,
            data: {
                totalGoals,
                completedGoals,
                inProgressGoals,
                overdueGoals,
                successRate: parseFloat(successRate),
                thisMonthGoals,
                monthlyDistribution
            }
        });

    } catch (error) {
        console.error('Get goal stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching goal statistics',
            error: error.message
        });
    }
};

