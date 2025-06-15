const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var videoSchema = new Schema({
    formation: {
        type: Schema.Types.ObjectId,
        ref: 'Training',
        required: true
    },
    title: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: false
    }

},{ timestamps: true });

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
