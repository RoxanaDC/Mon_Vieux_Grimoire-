const express = require("express"); // besoin de express enfin de creer un router
const controleursBooks = require("../controleurs/controleurs_books");
const auth = require("../middleware/auth");
const multerAndSharp = require("../middleware/multer_and_sharp_config");
const router = express.Router(); //le router avec la fonction Router de express

router.post("/", auth, multerAndSharp, controleursBooks.createBook);
router.get("/bestrating", controleursBooks.getTop3Books);
router.get("/", controleursBooks.getAllBooks);

router.post("/:id/rating", auth, controleursBooks.addRating);

router.get("/:id", controleursBooks.getOneBook);

router.put("/:id", auth, multerAndSharp, controleursBooks.modifyBook);

router.delete("/:id", auth, controleursBooks.deleteBook);

module.exports = router;
