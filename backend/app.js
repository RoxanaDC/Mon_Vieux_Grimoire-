const express = require("express"); // gestion des requêtes et des réponses
const mongoose = require("mongoose"); // gestion des bases de données MongoDB
const cors = require("cors"); //partage des ressources

const path = require("path"); // travailler avec les chemins de fichiers et de répertoires

const routesBooks = require("./routes/routes_books");
const routesUsers = require("./routes/routes_users");

// initialisation de l'application express
const app = express();

//connexion à la base de donneés
const { MONGO_DB_USER, MONGO_DB_PASSWORD } = process.env;
mongoose
  .connect(
    `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@cluster0.1lslq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("BRAVOOOO! >:D< - Connexion à MongoDB réussie !"))
  .catch(() => console.log("UFF .... :( - Connexion à MongoDB échouée !"));

app.use(express.json()); // permets le travail avec JSON dans les requêtes
app.use(cors()); //CORS
app.use("/api/books", routesBooks); // les routes de l'application

app.use("/api/auth", routesUsers);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
