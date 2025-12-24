import { verifyToken } from '../utils/jwt.js';

/**
 * Middleware to verify JWT token and authenticate user
 * Checks for token in cookies or Authorization header
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get token from cookie or Authorization header
        const token = req.cookies.token;

        // If not in cookie, check Authorization header
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please login.'
            });
        }

        // Verify token
        const decoded = verifyToken(token);

        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            username: decoded.username
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token. Please login again.'
        });
    }
};

/**
 * Middleware to check if user is authenticated (optional auth)
 * Doesn't block the request if no token is provided
 */
export const optionalAuth = async (req, res, next) => {
    try {
        let token = req.cookies.token;

        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (token) {
            const decoded = verifyToken(token);
            req.user = {
                userId: decoded.userId,
                email: decoded.email,
                username: decoded.username
            };
        }

        next();
    } catch (error) {
        // Continue even if token is invalid
        next();
    }
};
