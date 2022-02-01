// const express = require("express");
// const router = express.Router();
const { Users } = require("../models");
const { sign } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const { validateToken } = require("../middlewares/AuthMiddleware");

const passwordValidator = require("password-validator");
const mdpSchema = new passwordValidator();
mdpSchema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(2) // Must have at least 2 digits
  .has()
  .not()
  .spaces(); // Should not have spaces

/* Si on va avec le navigateur sur /posts alors on a hello world */

exports.register = async (req, res) => {
  /* on fait une déstructuration car on ne veut pas le password tel quel: on va vouloir le hasher*/
  const { username, password } = req.body;

  const duplicate = await Users.findOne({
    where: { username: username },
  });

  if (duplicate) {
    console.log("deja pris");
    return res.status(401).json({ message: "nom d'utilisateur déjà pris" });
  }

  if (!mdpSchema.validate(req.body.password)) {
    return res.status(401).json({
      message:
        "Il faut des minuscules, majuscules, nombres et pas d'espace à votre mot de passe",
    });
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      Users.create({
        username: username,
        password: hash,
        //! Attention added admin
        // admin: true,
      });
      res.json("Utilisateur créé");
    })
    .catch((error) => {
      res.status(200).json({ error });
    });
};

exports.deactivate = async (req, res) => {
  console.log(req.body);
  /* on fait une déstructuration car on ne veut pas le password tel quel: on va vouloir le hasher*/
  Users.update({ actif: 0 }, { where: { username: req.body.username } });
  res.json("desactivation");
};

exports.login = async (req, res) => {
  /* on a encore besoin de la déstructuration car on va manipuler le nom d'utilisateur et le mot de passe */
  const { username, password } = req.body;
  /* requête sequelize pour trouver l'utilisateur de req.body dans la base de données tel que */
  /* SELECT * FROM users WHERE username = req.body.username */
  /* s'il n'y a pas d'utilisateur, user sera vide */
  const user = await Users.findOne({ where: { username: username } });
  if (!user) res.json({ error: "Cet utilisateur n'existe pas" });
  // console.log(user);
  /* si la valeur actif est fausse alors l'utilisateur ne peut pas se connecter */
  if (user.actif === false) res.json({ error: "Ce compte est désactivé" });
  /* on ne peut pas déhasher un mot de passe, mais on peut comparer les deux hash. */
  /* bcrypt va comparer les deux hashs */
  /* a gauche, le mot de passe de req.body, a droite, le mot de passe de la base de données */
  bcrypt
    .compare(password, user.password)
    .then(async (match) => {
      if (!match) res.json({ error: "Mot de passe incorrect" });

      /* //todo changer le seed et le mettre dans env */
      /* le token contiendra le nom et l'id de l'utilisateur */
      /* //todo verifier mais a priori pas necessaire de mettre le mot de passe dans un token, pas safe et login par token est suffisant */
      //! Attention added admin
      const accessToken = sign(
        {
          username: user.username,
          id: user.id,
          admin: user.admin,
          expiresIn: "10h",
        },
        // { username: user.username, id: user.id },
        "SECRET_TOKEN"
      );

      /* on renvoie les information sur l'utilsateur dont le nom et l'id */
      /* on aurait également pu utiliset user.username mais de toutes façons si le login est correct alors c'est le même que username */
      //! Attention added admin
      res.json({
        token: accessToken,
        username: username,
        id: user.id,
        //todo
        admin: user.admin,
      });
    })
    .catch((error) => {
      res.status(200).json({ error });
    });
};

exports.profile = async (req, res) => {
  console.log(req.body);

  const id = req.params.id;

  console.log(id);

  /* on va obtenir toutes les informations de l'utilisateur sauf le mot de passe, en utilisant la commande findByPk, ou
    trouver par clé primaire, qui est ici l'id */
  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  res.status(200).json(basicInfo);
};
