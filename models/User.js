const mongoose = require("mongoose"); // gestion des bases de données MongoDB

const uniqueValidator = require("mongoose-unique-validator"); //ajout de contraintes d'unicité aux champs de modèle
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
