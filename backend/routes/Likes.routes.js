const express = require("express");
const router = express.Router();
// const { Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

const likeCtrl = require("../controllers/Likes.controllers");

router.post("/", validateToken, likeCtrl.createLike);

module.exports = router;
