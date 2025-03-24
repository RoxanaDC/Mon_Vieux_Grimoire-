const Book = require("../models/Book");
const fs = require("fs"); //contrôle détaillé sur le système de fichiers - manipulation d'images

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  console.log("creez cartea");
  delete bookObject.id;
  delete bookObject.userId;

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  book
    .save()

    .then(() => res.status(201).json({ message: "Livre bien enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Non authorisé" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Livre bien modifié!" }))
          .catch((error) => res.status(403).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre bien supprimé !" });
            })
            .catch((error) => res.status(403).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.getTop3Books = (req, res, next) => {
  const sortOrder = -1; // -1 pour une ordre décroissante (1 pour ordre croissante)
  Book.find()
    .sort({ averageRating: sortOrder }) // Sorter les livres par moyenne d'évaluation en ordre décroissant
    .limit(3)
    .then((top3Books) => {
      res.status(200).json(top3Books); // Fournit la liste de 3 livres de la DB, qui ont les meilleures évaluations moyennes.
    })
    .catch((error) => res.status(500).json({ error }));
};

// Ajouter une note à un livre
exports.addRating = (req, res, next) => {
  const { userId, rating } = req.body;

  // Calculer la nouvelle note moyenne d'un livre
  const determineAverageRating = (anyBook) => {
    const totalGrades = anyBook.ratings.reduce(
      (sum, rating) => sum + rating.grade,
      0
    );
    return totalGrades / anyBook.ratings.length;
  };

  // Vérifier si la note est entre 0 et 5

  const minRating = 0;
  const maxRating = 5;

  if (rating < minRating || rating > maxRating) {
    return res
      .status(400)
      .json({ message: "La note doit être comprise entre 0 et 5" });
  }

  // Chercher le livre dans la base de données
  Book.findById(req.params.id)
    .then((foundBook) => {
      // Vérifier si l'utilisateur a déjà noté le livre
      const checkIfUserRated = foundBook.ratings.some(
        (ratingNote) => ratingNote.userId === userId
      );
      if (checkIfUserRated) {
        return res
          .status(403)
          .json({ message: "L'utilisateur a déjà noté ce livre" });
      }

      // Ajouter la nouvelle note et recalculer la note moyenne
      foundBook.ratings.push({ userId, grade: rating });
      foundBook.averageRating = determineAverageRating(foundBook);

      // Sauvegarder les changements dans la base de données
      foundBook
        .save()
        .then(() => res.status(200).json(foundBook))
        .catch((error) => res.status(500).json({ error: error.message }));
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};
