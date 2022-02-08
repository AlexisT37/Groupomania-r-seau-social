const { Likes } = require("../models");

exports.createLike = async (req, res) => {
  /* on va avoir le userId et le postId par le req.body */
  const { PostId } = req.body;
  const UserId = req.user.id;

  /* variable pour déterminer si l'utilisateur peut aimer le post en essayant de trouver un like correspondant déjà */
  /* existant dans la base de données. Si il n'y a rien, alors l'utilisateur peut liker */
  /* si il y a quelque chose alors cela veut dire que l'utilisateur veut enlever son like */
  const dejaLike = await Likes.findOne({
    where: { PostId: PostId, UserId: UserId },
  });

  if (!dejaLike) {
    await Likes.create({ PostId: PostId, UserId: UserId });
    res.json({ liked: true });
  } else {
    await Likes.destroy({
      where: { PostId: PostId, UserId: UserId },
    });
    res.json({ liked: false });
  }
};
