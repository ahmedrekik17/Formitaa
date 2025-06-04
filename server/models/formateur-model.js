const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define the Formateur schema
var formateurSchema = new Schema({
    nom_et_prenom: {
        type: String,
        required: [true, "{PATH} is required"],
    },
    nom_et_prenom_arab: {
        type: String,
        required: [true, "{PATH} is required"],
    },
    email: {
        type: String,
        match: [/.+\@.+\..+/, 'Veuillez entrer une adresse e-mail valide'],
        required: [true, "{PATH} is required"],
        unique: [true, 'Cet e-mail existe déjà. Essayez de vous connecter.']
    },
    phoneNumber: {
        type: String,
        required: [true, "{PATH} is required"],
    },
    specialite: {
        type: String,
        required: [true, "{PATH} is required"],
    },
    experience: {
        type: Number,
        required: [true, "{PATH} is required"],
    },
    formateur_disponible: {
        type: Boolean,
        default: true,
        required: [true, "{PATH} is required"],
    },
    status: {
        type: String,
        enum: ['actif', 'inactif'],
        default: 'actif',
        required: true
    }
},{ timestamps: true });
const Formateur = mongoose.model('Formateur', formateurSchema);

module.exports = Formateur;
