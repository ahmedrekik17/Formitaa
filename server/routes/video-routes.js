const {
    uploadVideo,
    getVideosByTraining,
    updateVideo,
    deleteVideo
} = require('../controllers/video-controller');


module.exports = (app) => {
    // Upload a new video for a training (expects form-data with 'video' file)
    app.post('/api/training/:trainingId/videos', uploadVideo);

    // Get all videos for a specific training
    app.get('/api/training/:trainingId/videos', getVideosByTraining);

    // Update a specific video (title, etc.)
    app.put('/api/videos/:id', updateVideo);

    // Delete a specific video
    app.delete('/api/videos/:id', deleteVideo);
};
