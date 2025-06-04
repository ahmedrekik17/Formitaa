const { createFormateur, getAllFormateurs, getFormateurById, updateFormateur, deleteFormateur } = require('../controllers/formateur-controller');

module.exports = (app) => {
    app.post('/api/formateur', createFormateur);
    app.get('/api/formateurs', getAllFormateurs);
    app.get('/api/formateur/:id', getFormateurById);
    app.put('/api/formateur/:id', updateFormateur);
    app.delete('/api/formateur/:id', deleteFormateur);
};
