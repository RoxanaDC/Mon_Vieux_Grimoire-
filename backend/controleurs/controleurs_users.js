const bcrypt = require("bcrypt"); // chiffrement de données sensibles
const jsonWebToken = require("jsonwebtoken"); // création, vérification, définition de la durée de vie des tokens
const User = require("../models/User");
require("dotenv").config();
const { SECRET_TOKEN } = process.env;

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res.status(401).json({ message: "Paire user/password incorrecte" });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((passwordValide) => {
            if (!passwordValide) {
              res.status(401).json({
                message: "Paire user/password incorrecte",
              });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jsonWebToken.sign({ userId: user._id }, SECRET_TOKEN, {
                  expiresIn: "24h",
                }),
              });
            }
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
