/* route des posts */
/* voir tous les posts */
/* créer un nouveau post */

const express = require("express");
const router = express.Router();
// const { Posts, Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

const postCtrl = require("../controllers/Posts.controllers");

/* Si on va avec le navigateur sur /posts alors on a hello world */
router.get("/", validateToken, postCtrl.getAllPosts);

router.get("/latest", validateToken, postCtrl.latest);

router.get("/byId/:id", validateToken, postCtrl.getPostById);

router.get("/byuserId/:id", validateToken, postCtrl.getPostByUserId);

router.post("/", validateToken, postCtrl.createPost);

router.delete("/:postId", validateToken, postCtrl.deletePost);

module.exports = router;
