/* route des utilisateurs */

const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");

const userCtrl = require("../controllers/Users.controllers");
/* password validator */

router.post("/register", userCtrl.register);

router.put("/deactivate/:id", validateToken, userCtrl.deactivate);

router.post("/login", userCtrl.login);

router.get("/basicinfo/:id", validateToken, userCtrl.profile);

module.exports = router;
