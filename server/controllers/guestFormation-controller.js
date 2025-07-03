const GuestFormation = require("../models/guestFormation-model");
const Formation = require('../models/training-model'); // Import your Training model


// Create guest registration
exports.registerGuest = async (req, res) => {
    try {
        const { trainingId, name, email } = req.body;

        // 1. Basic Validation
        if (!trainingId || !name || !email) {
            return res.status(400).json({ message: 'Please provide trainingId, name, and email.' });
        }

        // 2. Check if the training exists
        const formationExists = await Formation.findById(trainingId);
        if (!formationExists) {
            return res.status(404).json({ message: 'Training not found.' });
        }

        // 3. Create and save the new guest registration
        // The unique index in the model will automatically handle duplicate registrations
        // and throw an error, which will be caught by the catch block.
        const guestRegistration = await GuestFormation.create({
            trainingId,
            name,
            email
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            data: guestRegistration
        });

    } catch (error) {
        // Handle potential duplicate key error from the unique index
        if (error.code === 11000) {
            return res.status(409).json({ message: 'You are already registered for this training with this email address.' });
        }
        // Handle other errors
        console.error('Guest registration error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Optional: Get all guests for a formation
exports.getGuestsByTraining = async (req, res) => {
  try {
    const { trainingId } = req.params;

    const guests = await GuestFormation.find({ trainingId });
    res.status(200).json(guests);
  } catch (error) {
    console.error("Get guests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
