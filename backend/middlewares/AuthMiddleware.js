/* on vérifie si le jsonwebtoken est valide, alors seulement on peut voir le contenu et poster des commentaires ou des posts */
/* on utilise les accolades car c'est un import nommé et pas un inmport default, */
/* c'est-a-dire qu'on importe un composant du module, ici jsonwebtoken, pas jsonwebtoken en entier */
const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  /* attention c'est la fonction req.header et pas l'objet req.headers */
  /* on stock le token dans une variable */
  const accessToken = req.header("accessToken");
  /* on commence par vérifier si l'utilisateur a un jsonwebtoken */
  /* si il n'y a pas de token dans le header, alors l'utilisateur n'est pas connecté, peu importe la raison */
  if (!accessToken) return res.json({ error: "Vous n'êtes pas connecté" });
  /* on vérifie si le token est valide */
  try {
    /* on stock le resultat de la verification, c'est un boolen*/
    const validToken = verify(accessToken, "SECRET_TOKEN");
    /* req va contenir les information présentes dans le validToken pour les utiliser  */
    /* après ce middleware d'autentification */
    // console.log(validToken);
    req.user = validToken;
    /* si le booleen est vrai, donc si le token valide */
    // console.log(validToken);
    if (validToken) {
      return next();
    }
  } catch (error) {
    return res.json({ error: error });
  }
};

module.exports = { validateToken };
