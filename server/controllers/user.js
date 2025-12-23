import { UserModel } from '../models/User.js';

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
export const createUser = async (req, res) => {
    try {
        const { username, email, password, profileData } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email, and password are required'
            });
        }

        // Check if user already exists
        const existingUserByEmail = await UserModel.findByEmail(email);
        if (existingUserByEmail) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }

        if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[\W_]/.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
            });
        }

        const existingUserByUsername = await UserModel.findByUsername(username);
        if (existingUserByUsername) {
            return res.status(409).json({
                success: false,
                message: 'Username is already taken'
            });
        }

        // Create new user
        const newUser = await UserModel.create({
            username,
            email,
            password,
            profileData
        });

        // Remove sensitive data before sending response
        const { password_hash, salt, ...userResponse } = newUser;

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: userResponse
        });

    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user and login
 * @access  Public
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user and verify password
        const user = await UserModel.verifyPassword(email, password);

        if (!user) {
            // Increment failed login attempts
            await UserModel.incrementLoginAttempts(email);

            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check account status
        if (user.account_status === 'LOCKED') {
            return res.status(403).json({
                success: false,
                message: 'Account is locked due to too many failed login attempts'
            });
        }

        if (user.account_status === 'PENDING_VERIFICATION') {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in'
            });
        }

        // Reset login attempts and update last login
        await UserModel.resetLoginAttempts(user.user_id.toString());
        await UserModel.updateLastLogin(user.user_id.toString());

        // Remove sensitive data
        const { password_hash, salt, ...userResponse } = user;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: userResponse
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('Getting user with id:', id);

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove sensitive data
        const { password_hash, salt, ...userResponse } = user;

        res.status(200).json({
            success: true,
            data: userResponse
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/users/email/:email
 * @desc    Get user by email
 * @access  Private
 */
export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await UserModel.findByEmail(email);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove sensitive data
        const { password_hash, salt, ...userResponse } = user;

        res.status(200).json({
            success: true,
            data: userResponse
        });

    } catch (error) {
        console.error('Get user by email error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/users/username/:username
 * @desc    Get user by username
 * @access  Private
 */
export const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await UserModel.findByUsername(username);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove sensitive data
        const { password_hash, salt, ...userResponse } = user;

        res.status(200).json({
            success: true,
            data: userResponse
        });

    } catch (error) {
        console.error('Get user by username error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};

/**
 * @route   PUT /api/users/:id
 * @desc    Update user information
 * @access  Private
 */
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Don't allow direct password_hash updates
        if (updates.password_hash || updates.salt) {
            return res.status(400).json({
                success: false,
                message: 'Use password reset endpoint to change password'
            });
        }

        // Update user
        await UserModel.update(id, updates);

        // Get updated user
        const updatedUser = await UserModel.findById(id);
        const { password_hash, salt, ...userResponse } = updatedUser;

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: userResponse
        });

    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private
 */
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await UserModel.delete(id);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/users/verify-email
 * @desc    Verify user email
 * @access  Public
 */
export const verifyEmail = async (req, res) => {
    try {
        const { userId } = req.body;

        console.log('Received userId:', userId, 'Type:', typeof userId);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'userId is required'
            });
        }

        await UserModel.update(userId, {
            email_verified: true,
            account_status: 'ACTIVE'
        });

        res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });

    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying email',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/users/forgot-password
 * @desc    Request password reset token
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const token = await UserModel.createPasswordResetToken(email);

        // In production, send this token via email
        // For now, return it in response (NOT SECURE - for development only)
        res.status(200).json({
            success: true,
            message: 'Password reset token created',
            token // Remove this in production!
        });

    } catch (error) {
        console.error('Forgot password error:', error);

        // Don't reveal if user exists or not
        if (error.message === 'User not found') {
            return res.status(200).json({
                success: true,
                message: 'If the email exists, a reset link has been sent'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error processing password reset request',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/users/reset-password
 * @desc    Reset password using token
 * @access  Public
 */
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Token and new password are required'
            });
        }

        // Verify token
        const tokenData = await UserModel.verifyPasswordResetToken(token);

        if (!tokenData) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Reset password
        await UserModel.resetPassword(tokenData.email, newPassword);

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password',
            error: error.message
        });
    }
};