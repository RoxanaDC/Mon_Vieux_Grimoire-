const mongoose = require("mongoose"); // gestion des bases de données MongoDB

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: { type: String, required: true }, // - identifiant MongoDB unique de l'utilisateur qui a noté le livre
      grade: { type: Number, required: true }, // - note donnée à un livre
    },
  ], //- notes données à un livre
  averageRating: { type: Number, required: true }, // - note moyenne du livre
});

module.exports = mongoose.model("Book", bookSchema);
