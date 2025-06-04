const { createEvaluation, getEvaluationsByTraining, getEvaluationById, updateEvaluation, deleteEvaluation, getLatestEvaluations } = require('../controllers/evaluation-controller');

module.exports = (app) => {
    app.post('/api/evaluations/register', createEvaluation); // Register a user for training
    app.get('/api/evaluations/training/:trainingId', getEvaluationsByTraining); // Get evaluations for a training session
    app.get('/api/evaluations/user/:userId', getEvaluationById); // Get an evaluation by ID
    app.put('/api/evaluations/:id', updateEvaluation); // Update an evaluation
    app.delete('/api/evaluations/:id', deleteEvaluation); // Delete an evaluation
    app.get('/api/evaluations/latest', getLatestEvaluations);
};
