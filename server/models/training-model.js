const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define the Training schema
var trainingSchema = new Schema({
    n_action: {
        type: String,
        required: [true, "{PATH} is required"],
        unique: true
    },
    theme_formation: {
        type: String,
        required: [true, "{PATH} is required"],
    },
    loi_des_finances: {
        type: String,
        required: [true, "{PATH} is required"],
    },
    lieu_de_deroulement: {
        type: String,
        required: [true, "{PATH} is required"],
    },
    date_debut: { // Changed from periode
        type: Date,
        required: [true, "{PATH} is required"],
    },
    date_fin: { // Added
        type: Date,
        required: [true, "{PATH} is required"],
    },
    credit_impot: {
        type: Boolean,
        required: true,
        default: false
    },
    mode_formation: {
        type: String,
        required: [true, "{PATH} is required"],
    },
    droits_de_tirage_individuel: {
        type: Boolean,
        required: true,
        default: false
    },
    droits_de_tirage_collectif: {
        type: Boolean,
        required: true,
        default: false
    },
    num_salle: {
        type: String,
        required: [true, "{PATH} is required"],
    },
    etat: {
        type: String,
        enum: ['Annoncé', 'En cours','Terminé'],
        default: 'Annoncé',
        required: [true, "{PATH} is required"],
    },
    pause: {
        type: String,
        required: [true, "{PATH} is required"],
    },
    horaire_debut: { // Changed from horaire
        type: String,
        required: [true, "{PATH} is required"],
    },
    horaire_fin: { // Added
        type: String,
        required: [true, "{PATH} is required"],
    },
    formateur: {
        type: Schema.Types.ObjectId,
        ref: 'Formateur',
        required: true
    },
    image: {
        type: String, // Store the file path or URL
        required: false
    }
},{ timestamps: true });


const Training = mongoose.model('Training', trainingSchema);

module.exports = Training;