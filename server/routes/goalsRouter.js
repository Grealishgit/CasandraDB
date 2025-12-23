import express from 'express';

const goalsRouter = express.Router();


goalsRouter.post('/create', createGoal);
goalsRouter.get('/:id', getGoal);
goalsRouter.get('/all', getAllGoals);
goalsRouter.put('/:id', updateGoal);
goalsRouter.delete('/:id', deleteGoal);



export default goalsRouter;