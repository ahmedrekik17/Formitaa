const mongoose = require("mongoose");

const guestFormationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    trainingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Training", // change if your model name differs
      required: true,
    },
  },
  { timestamps: true }
);

guestFormationSchema.index({ trainingId: 1, email: 1 }, { unique: true });


module.exports = mongoose.model("GuestFormation", guestFormationSchema);
