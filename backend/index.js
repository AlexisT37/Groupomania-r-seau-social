const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const AuthMiddleware = require("./middlewares/AuthMiddleware");

/* pour pouvoir utiliser le format json dans les requetes */
app.use(express.json());
/* pour les autorisations de cors */
app.use(cors());

/* sécurité helmet */
app.use(helmet());
/* on utilise les modèles */
const db = require("./models");

/* on utilise la validation de token pour toutes les routes */
app.get("*", AuthMiddleware.validateToken);

//routeurs
const postRouter = require("./routes/Posts.routes");
app.use("/posts", postRouter);

const commentsRouter = require("./routes/Comments.routes");
app.use("/comments", commentsRouter);

const usersRouter = require("./routes/Users.routes");
app.use("/auth", usersRouter);

const likesRouter = require("./routes/Likes.routes");
app.use("/likes", likesRouter);

/* on utilisera la base de données sql grâce a sequelize */
db.sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log("Le serveur est lancé !");
    });
  })
  .catch((error) => {
    res.status(200).json({ error });
  });
