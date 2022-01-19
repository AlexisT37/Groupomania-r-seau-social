/* modèle de configuration des likes */

module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define("Likes");

  return Likes;
};
