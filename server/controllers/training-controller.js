const Training = require("../models/training-model");
const Formateur = require("../models/formateur-model");
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = {
    createTraining: async (req, res) => {
        upload.single('image')(req, res, async () => {
            try {
                const {
                    n_action,
                    theme_formation,
                    loi_des_finances,
                    lieu_de_deroulement,
                    type_formation,
                    date_debut, // Changed
                    date_fin,   // Added
                    credit_impot,
                    mode_formation,
                    droits_de_tirage_individuel,
                    droits_de_tirage_collectif,
                    num_salle,
                    pause,
                    etat,
                    horaire_debut, // Changed
                    horaire_fin,   // Added
                    formateurId,
                    image
                } = req.body;

                const formateur = await Formateur.findOne({ _id: formateurId });
                if (!formateur) {
                    return res.status(404).json({ message: "Formateur non trouvé" });
                }

                const imagePath = req.file ? `/uploads/${req.file.filename}` : image || null;

                const newTraining = await Training.create({
                    n_action,
                    theme_formation,
                    loi_des_finances,
                    lieu_de_deroulement,
                    type_formation,
                    date_debut, // Changed
                    date_fin,   // Added
                    credit_impot,
                    mode_formation,
                    droits_de_tirage_individuel,
                    droits_de_tirage_collectif,
                    num_salle,
                    pause,
                    etat,
                    horaire_debut, // Changed
                    horaire_fin,   // Added
                    formateur: formateurId,
                    image: imagePath
                });

                res.status(201).json({
                    message: "Session de formation créée avec succès !",
                    training: newTraining,
                });

            }  catch (error) {
                res.status(500).json({ message: error.toString() });
            }
        });
    },

    getAllTrainings: async (req, res) => {
        try {
            const trainings = await Training.find().populate('formateur', 'nom_et_prenom');
            res.status(200).json(trainings);
        } catch (error) {
            res.status(400).json({ message: error.toString() });
        }
    },

    getTrainingById: async (req, res) => {
        try {
            const training = await Training.findById(req.params.id).populate('formateur','nom_et_prenom');
            if (!training) {
                return res.status(404).json({ message: "Session de formation non trouvée" });
            }
            res.status(200).json(training);
        } catch (error) {
            res.status(400).json({ message: error.toString() });
        }
    },

    updateTraining: async (req, res) => {
        try {
            const { formateurName, ...otherTrainingDetails } = req.body;

            let formateurId;
            if(formateurName){
                const formateur = await Formateur.findOne({nom_et_prenom: formateurName})
                if(formateur){
                    formateurId = formateur._id
                } else {
                    return res.status(404).json({ message: "Formateur not found" });
                }
            }

            const updatedTraining = await Training.findByIdAndUpdate(
                req.params.id,
                { ...otherTrainingDetails, formateur: formateurId },
                { new: true }
            );

            if (!updatedTraining) {
                return res.status(404).json({ message: "Session de formation non trouvée" });
            }
            res.status(200).json({ message: "Session de formation mise à jour avec succès", updatedTraining });
        } catch (error) {
            res.status(400).json({ message: error.toString() });
        }
    },

    deleteTraining: async (req, res) => {
        try {
            const deletedTraining = await Training.findByIdAndDelete(req.params.id);
            if (!deletedTraining) {
                return res.status(404).json({ message: "Session de formation non trouvée" });
            }
            res.status(200).json({ message: "Session de formation supprimée avec succès" });
        } catch (error) {
            res.status(400).json({ message: error.toString() });
        }
    },
    getFilteredTrainings: async (req, res) => {
    try {
      const usertoken = req.cookies.usertoken;

      let trainings;

      if (usertoken) {
        // ✅ User is logged in — return all trainings
        trainings = await Training.find().populate('formateur', 'nom_et_prenom');
      } else {
        // 🔒 Guest — return only free trainings
        trainings = await Training.find({ type_formation: 'Gratuit' }).populate('formateur', 'nom_et_prenom');
      }

      res.status(200).json(trainings);
    } catch (error) {
      console.error('❌ Error fetching trainings:', error.message);
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};