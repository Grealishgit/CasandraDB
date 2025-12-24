import express from 'express';
import {
    createGoal,
    getGoals,
    getGoal,
    getGoalsByStatus,
    getGoalsByCategory,
    getUpcomingGoals,
    updateGoal,
    deleteGoal,
    uploadBanner
} from '../controllers/goals.js';
import { authenticate } from '../middleware/auth.js';
import multer from 'multer';

// Configure multer for file uploads (in-memory storage)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

const goalsRouter = express.Router();

// All routes require authentication
goalsRouter.use(authenticate);

// Image upload route
goalsRouter.post('/upload-banner', upload.single('banner'), uploadBanner);

// Goal CRUD routes
goalsRouter.post('/', createGoal);
goalsRouter.get('/', getGoals);
goalsRouter.get('/status/:status', getGoalsByStatus);
goalsRouter.get('/category/:category', getGoalsByCategory);
goalsRouter.get('/upcoming', getUpcomingGoals);
goalsRouter.get('/:id', getGoal);
goalsRouter.put('/:id', updateGoal);
goalsRouter.delete('/:id', deleteGoal);

export default goalsRouter;