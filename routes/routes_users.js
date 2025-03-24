const express = require("express"); // besoin de express enfin de creer un router
const router = express.Router(); //le router avec la fonction Router de express
const controleursUsers = require("../controleurs/controleurs_users");

router.post("/signup", controleursUsers.signup);
router.post("/login", controleursUsers.login);

module.exports = router;
