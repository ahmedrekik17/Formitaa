const mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

// Define the User schema
var userSchema = new Schema({
    nom_et_prenom: { 
        type: String, 
        required: [true, "{PATH} is required"], 
    },
    nom_et_prenom_arab:{
        type:String,
        required: [true, "{PATH} is required"],

    },
    cin:{
        type:String,
        required: [true, "{PATH} is required"],
        minlength:[8, "{PATH} must be at least {MINLENGTH} characters"],
    },
    email: {
        type: String, 
        match: [/.+\@.+\..+/, 'Please enter a valid e-mail address'],
        required: [true, "{PATH} is required"],
        unique:[true, 'Email already exists. Try to Login.']
    },
    password: { 
        type: String, 
        required: [true, "{PATH} is required"],
        minlength:[8,"{PATH} has length inferieur 8"]
    },    
  
    phoneNumber:{
        type:String,
        minlength:[8,"{PATH} has length inferieur 8"],
        required: [true, "{PATH} is required"],
    },
    ville:{
        type:String,
        required: [true, "{PATH} is required"],
    },
    date_naissance:{
        type:Date,
        required: [true, "{PATH} is required"],
    },
    role:{
        type:String,
        enum:['admin','user'],
        default: 'user',
        require: true
    }
},{ timestamps: true });

const users= mongoose.model('User', userSchema);
module.exports = users;