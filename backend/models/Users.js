/* modèle de configuration des utilisateurs */

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    actif: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });

  Users.associate = (models) => {
    Users.hasMany(models.Likes, {
      onDelete: "cascade",
    });
    Users.hasMany(models.Posts, {
      onDelete: "cascade",
    });
  };

  return Users;
};
