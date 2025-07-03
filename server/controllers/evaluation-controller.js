const Evaluation = require("../models/evaluation-model");
const Training = require("../models/training-model");
const User = require("../models/user");

module.exports = {
  // Create a new evaluation
  createEvaluation: async (req, res) => {
    try {
      const { trainingId, userId, note } = req.body;

      // Check if training exists
      const training = await Training.findById(trainingId);
      if (!training) {
        return res
          .status(404)
          .json({ message: "Session de formation non trouvée" });
      }

      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Check if the user is already registered for the training
      const existingEvaluation = await Evaluation.findOne({
        training: trainingId,
        user: userId,
      });
      if (existingEvaluation) {
        return res
          .status(400)
          .json({
            message: "Utilisateur déjà inscrit à cette session de formation",
          });
      }

      // Create a new evaluation
      const newEvaluation = await Evaluation.create({
        training: trainingId,
        user: userId,
        note: note || null, // Set note to null if not provided
      });

      res.status(201).json({
        message: "Inscription réussie",
        evaluation: newEvaluation,
      });
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }
  },

  // Get all evaluations for a training session
  getEvaluationsByTraining: async (req, res) => {
    try {
      const evaluations = await Evaluation.find({
        training: req.params.trainingId,
      })
        .populate({
          path: "training",
          select: "theme_formation periode", // Select specific fields
        })
        .populate({
          path: "user",
          select: "nom_et_prenom email", // Select specific user details if needed
        });

      if (!evaluations || evaluations.length === 0) {
        return res
          .status(404)
          .json({
            message:
              "Aucune évaluation trouvée pour cette session de formation",
          });
      }

      // Format data for the response
      const result = evaluations.map((evaluation) => ({
        formationName: evaluation.training.theme_formation,
        formationDate: evaluation.training.periode,
        user: {
          name: evaluation.user.nom_et_prenom,
          email: evaluation.user.email,
        },
        note: evaluation.note,
      }));

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.toString() });
    }
  },

  // Get the latest evaluations with comments
  getLatestEvaluations: async (req, res) => {
    try {
      const evaluations = await Evaluation.find({
        comment: { $exists: true, $ne: "" },
      })
        .sort({ updatedAt: -1 })
        .limit(3)
        .populate("user", "nom_et_prenom");

      if (!evaluations || evaluations.length === 0) {
        return res.status(200).json([]); // ✅ empty list instead of error
      }

      res.status(200).json(evaluations);
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }
  },

  // Get an evaluation by ID
  getEvaluationById: async (req, res) => {
    try {
      const evaluations = await Evaluation.find({ user: req.params.userId }) // Query evaluations for a specific user
        .populate("training") // Populate training details
        .populate("user"); // Populate user details

      if (!evaluations || evaluations.length === 0) {
        return res
          .status(404)
          .json({ message: "No evaluations found for this user." });
      }

      res.status(200).json(evaluations);
    } catch (error) {
      res.status(400).json({ message: error.toString() });
    }
  },

  // Update an evaluation by ID
  updateEvaluation: async (req, res) => {
    try {
      const { training, user, note, comment } = req.body;

      // Check if the note is a valid number between 0 and 20
      if (note < 0 || note > 20) {
        return res
          .status(400)
          .json({ message: "Invalid note, it must be between 0 and 20." });
      }

      // Update the evaluation based on the ID from the URL
      const updatedEvaluation = await Evaluation.findByIdAndUpdate(
        req.params.id,
        { training, user, note, comment }, // Update the fields
        { new: true }
      );

      if (!updatedEvaluation) {
        return res.status(404).json({ message: "Évaluation non trouvée" });
      }

      res
        .status(200)
        .json({
          message: "Évaluation mise à jour avec succès",
          updatedEvaluation,
        });
    } catch (error) {
      res.status(400).json({ message: error.toString() });
    }
  },

  // Delete an evaluation by ID
  deleteEvaluation: async (req, res) => {
    try {
      const deletedEvaluation = await Evaluation.findByIdAndDelete(
        req.params.id
      );
      if (!deletedEvaluation) {
        return res.status(404).json({ message: "Évaluation non trouvée" });
      }
      res.status(200).json({ message: "Évaluation supprimée avec succès" });
    } catch (error) {
      res.status(400).json({ message: error.toString() });
    }
  },

getWeeklyTrainingsByUser: async (req, res) => {
  try {
    const userId = req.params.userId;
    const startParam = req.query.start; // Expect ISO string e.g. '2025-06-30T00:00:00Z'
    const endParam = req.query.end;

    if (!startParam || !endParam) {
      return res.status(400).json({ message: 'Missing start or end date query parameters' });
    }

    const weekStart = new Date(startParam);
    const weekEnd = new Date(endParam);

    const evaluations = await Evaluation.find({ user: userId })
      .populate({
        path: 'training',
        match: {
          date_debut: { $gte: weekStart, $lte: weekEnd }
        },
        select: 'theme_formation date_debut date_fin horaire_debut horaire_fin lieu_de_deroulement'
      });

    const weeklyFormations = evaluations
      .filter(e => e.training)
      .map(e => ({
        id: e.training._id,
        title: e.training.theme_formation,
        date: e.training.date_debut,
        start: e.training.horaire_debut,
        end: e.training.horaire_fin,
        location: e.training.lieu_de_deroulement
      }));

    res.status(200).json(weeklyFormations);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des formations de la semaine" });
  }
}

};
