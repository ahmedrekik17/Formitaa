const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();


module.exports = {
    register: async (req, res) => {
        try {
            const { nom_et_prenom, nom_et_prenom_arab,cin, email, password, phoneNumber, ville, date_naissance, role } = req.body;
            const userRole = role || 'user';
    
            // Check if email already exists
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: "Email already in use" });
            }
    
    
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                nom_et_prenom,
                nom_et_prenom_arab,
                cin,
                email,
                password: hashedPassword, 
                phoneNumber,
                ville,
                date_naissance,
                role: userRole
            });

    
            // Generate JWT token
            const userToken = jwt.sign({ id: newUser._id, role: userRole }, process.env.JWT_SECRET);
    
            // Send response with user token
            res.status(201).cookie("usertoken", userToken, { httpOnly: true }).json({
                token: userToken,
                user: newUser._id,
                message: "User created!"
            });
        } catch (error) {
            res.status(400).json({ message: error.toString() });
        }
    },
    

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
    
            if (!user) {
                return res.status(400).json({ message: "Invalid Email" });
            }
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid Passwod" });
            }
    
            // ✅ Declare and initialize the token properly
            const usertoken = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    cin:user.cin,
                    nom_et_prenom_arab: user.nom_et_prenom_arab,
                    nom_et_prenom: user.nom_et_prenom,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                }, process.env.JWT_SECRET);
    
            // ✅ Now, use the token
            res.cookie("usertoken", usertoken, { httpOnly: true });
    
            return res.json({ userId: user._id, message: "Login successful" });
        } catch (error) {
            res.status(400).json({ message: error.toString() });
        }
    },

    logout: async (req, res) => {
        const { usertoken } = req.cookies;
        if (!usertoken) {
          return res.status(400).json({ message: 'Token not found.' });
        }
        try {
          res.clearCookie('usertoken');
          res.status(200).json({ message: "User Logged out successfully." });
        } catch (error) {
          console.error("Logout error:", error);
          res.status(400).json({ message: error.message });
        }
      },
      
    

    getAllUsers: async (req, res) => {
        try {
            const users = await User.find().sort({ createdAt: -1 });
            res.json(users);
        } catch (error) {
            res.status(400).json({ message: error.toString() });
        }
    },

    deleteAll: async (req, res) => {
        try {
            await User.deleteMany({});
           
            res.send("Deleted all users and tokens");
        } catch (error) {
            res.status(400).send("Failed to delete all users and tokens");
        }
    },
    deleteOneUser:(req,res) =>{
        User.findByIdAndDelete({_id:req.params.id})
        .then(deletedUser=> {

            res.status(200).json({data:deletedUser, message:'User deleted With Success', ok: true})
        }  )
        .catch(error =>{
            console.log(error);
            res.status(500).json({error})
        })},

    getLoggedUser: async (req, res) => {
        const { usertoken } = req.cookies;

        if (!usertoken) {
            return res.status(400).json({ message: "You are not logged in." });
        }

        try {
            const decoded = jwt.verify(usertoken, process.env.JWT_SECRET);
            const loggedUser = await User.findById(decoded.id).select("nom_et_prenom_arab nom_et_prenom cin email phoneNumber role");
            return res.json(loggedUser);
        } catch (error) {
            res.status(400).json({ message: error.toString() });
        }
    },
    updateUser: async (req, res) => {
        const { id } = req.params;
        const updateData = req.body;
        try {
          const updatedUser = await User.findByIdAndUpdate(id,updateData,{ new: true } );      
          if (!updatedUser) {
            return res.status(405).json({ message: "User not found" });
          }
           // No need to create a new token on update when using session cookies
          res.status(200).json({ message: "User updated successfully", user: updatedUser});
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Error updating user profile", error: error.message });
        }
      }
};