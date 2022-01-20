/* modèle de configuration des posts */

module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imgId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  /* on crée une association de type cascade entre la base de données des posts */
  /* et la base de données des commentaires. */
  /* Ainsi, quand on supprimera un post plus tard, tous les commentaires associés */
  /* seront également supprimés */

  Posts.associate = (models) => {
    Posts.hasMany(models.Comments, {
      onDelete: "cascade",
    });
    Posts.hasMany(models.Likes, {
      onDelete: "cascade",
    });
  };

  return Posts;
};
