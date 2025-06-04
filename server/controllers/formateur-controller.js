const Formateur = require("../models/formateur-model");

module.exports = {
    // Create a new formateur
    createFormateur: async (req, res) => {
        try {
            const { nom_et_prenom, nom_et_prenom_arab, email, phoneNumber, specialite, experience, formation_disponible, status } = req.body;

            // Check if email already exists
            const existingFormateur = await Formateur.findOne({ email });
            if (existingFormateur) {
                return res.status(400).json({ message: "L'email existe déjà" });
            }

            // Create new formateur
            const newFormateur = await Formateur.create({
                nom_et_prenom,
                nom_et_prenom_arab,
                email,
                phoneNumber,
                specialite,
                experience,
                formation_disponible,
                status
            });

            res.status(201).json({
                message: "Formateur créé avec succès !",
                formateur: newFormateur,
            });
        } catch (error) {
            res.status(500).json({ message: error.toString() });
        }
    },

    // Get all formateurs
    getAllFormateurs: async (req, res) => {
        try {
            const formateurs = await Formateur.find();
            res.status(200).json(formateurs);
        } catch (error) {
            res.status(400).json({ message: error.toString() });
        }
    },

    // Get formateur by ID
    getFormateurById: async (req, res) => {
        try {
            const formateur = await Formateur.findById(req.params.id);
            if (!formateur) {
                return res.status(404).json({ message: "Formateur introuvable" });
            }
            res.status(200).json(formateur);
        } catch (error) {
            res.status(400).json({ message: error.toString() });
        }
    },

    // Update formateur by ID
    updateFormateur: async (req, res) => {
        try {
            const updatedFormateur = await Formateur.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

            if (!updatedFormateur) {
                return res.status(404).json({ message: "Formateur introuvable" });
            }

            res.status(200).json({ message: "Formateur mis à jour avec succès", updatedFormateur });
        } catch (error) {
            res.status(400).json({ message: error.toString() });
        }
    },

    // Delete formateur by ID
    deleteFormateur: async (req, res) => {
        try {
            const deletedFormateur = await Formateur.findByIdAndDelete(req.params.id);
            if (!deletedFormateur) {
                return res.status(404).json({ message: "Formateur introuvable" });
            }
            res.status(200).json({ message: "Formateur supprimé avec succès" });
        } catch (error) {
            res.status(400).json({ message: error.toString() });
        }
    }
};
