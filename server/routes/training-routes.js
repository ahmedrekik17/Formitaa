const {
    createTraining,
    getAllTrainings,
    getTrainingById,
    updateTraining,
    deleteTraining
} = require('../controllers/training-controller');



module.exports = (app) => {
    app.post('/api/training', createTraining);
    app.get('/api/trainings', getAllTrainings);
    app.get('/api/training/:id', getTrainingById);
    app.put('/api/training/:id', updateTraining);
    app.delete('/api/training/:id', deleteTraining);
};
