const Video = require("../models/video-model");
const Training = require("../models/training-model");
const mongoose = require('mongoose');
const multer = require("multer");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = {
  uploadVideo: async (req, res) => {
    upload.single("video")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      try {
        const { title, url } = req.body;
        const trainingId = req.params.trainingId;
        const training = await Training.findById(trainingId);

        if (!training) {
          return res.status(404).json({ message: "Formation non trouvée" });
        }

        const videoPath = req.file ? `/uploads/${req.file.filename}` : url || null;

        const newVideo = await Video.create({
            formation: trainingId,
            title,
          url: videoPath,
        });

        res.status(201).json({
          message: "Vidéo ajoutée avec succès",
          video: newVideo,
        });
      } catch (error) {
        res.status(500).json({ message: error.toString() });
      }
    });
  },

  getVideosByTraining: async (req, res) => {
    try {
      const videos = await Video.find({ formation: req.params.trainingId });
      res.status(200).json(videos);
    } catch (error) {
      res.status(400).json({ message: error.toString() });
    }
  },

  updateVideo: async (req, res) => {
    try {
      const { title } = req.body;
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.videoId,
        { title },
        { new: true }
      );

      if (!updatedVideo) {
        return res.status(404).json({ message: "Vidéo non trouvée" });
      }

      res.status(200).json({
        message: "Vidéo mise à jour avec succès",
        video: updatedVideo,
      });
    } catch (error) {
      res.status(400).json({ message: error.toString() });
    }
  },

  deleteVideo: async (req, res) => {
    try {
      const deleted = await Video.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: "Vidéo non trouvée" });
      }
      res.status(200).json({ message: "Vidéo supprimée avec succès" });
    } catch (error) {
      res.status(400).json({ message: error.toString() });
    }
  },

  uploadMiddleware: upload
};
