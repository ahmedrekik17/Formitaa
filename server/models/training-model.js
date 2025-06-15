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
        enum: ['Présentiel', 'En ligne']
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
        validate: {
          validator: function (v) {
            if (this.mode_formation === 'Présentiel') {
              return v && v.trim() !== '';
            }
            return true;
          },
          message: 'num_salle is required for Présentiel training'
        }
      },      
    etat: {
        type: String,
        enum: ['Annoncé', 'En cours','Terminé'],
        default: 'Annoncé',
        required: [true, "{PATH} is required"],
    },
    pause: {
        type: String,
        validate: {
          validator: function (v) {
            if (this.mode_formation === 'Présentiel') {
              return v && v.trim() !== '';
            }
            return true;
          },
          message: 'pause is required for Présentiel training'
        }
      },
    
      horaire_debut: {
        type: String,
        validate: {
          validator: function (v) {
            if (this.mode_formation === 'Présentiel') {
              return v && v.trim() !== '';
            }
            return true;
          },
          message: 'horaire_debut is required for Présentiel training'
        }
      },
    
      horaire_fin: {
        type: String,
        validate: {
          validator: function (v) {
            if (this.mode_formation === 'Présentiel') {
              return v && v.trim() !== '';
            }
            return true;
          },
          message: 'horaire_fin is required for Présentiel training'
        }
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