const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define the Evaluation schema
var evaluationSchema = new Schema({
    training: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Training',
        required: [true, "{PATH} is required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "{PATH} is required"]
    },
    note: {
        type: Number,
        min: 0,
        max: 20,
    },
    comment: {
        type: String,
        default: ''
    }

},{ timestamps: true });

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

module.exports = Evaluation;
