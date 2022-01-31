/* route des utilisateurs */

const express = require("express");
const router = express.Router();
// const { Users } = require("../models");
// const { sign } = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");

const userCtrl = require("../controllers/Users.controllers");
/* password validator */

router.post("/register", userCtrl.register);

router.put("/deactivate/:id", userCtrl.deactivate);

router.post("/login", userCtrl.login);

/* ceci permet de vérifier si ce qui est présent dans le localstorage est bien un token valide */
router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/basicinfo/:id", userCtrl.profile);

module.exports = router;
