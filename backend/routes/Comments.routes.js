const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");

/* on utilise le validateToken pour verifier si on a le droit de commenter */
const commentCtrl = require("../controllers/Comments.controllers");

router.get("/:postId", commentCtrl.getPostId);

router.post("/", validateToken, commentCtrl.postComment);

router.delete("/:commentId", validateToken, commentCtrl.deleteComment);

module.exports = router;
