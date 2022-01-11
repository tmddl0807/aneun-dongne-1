const { User } = require("../../models");
const { generateAccessToken, generateRefreshToken, sendAccessToken, sendRefreshToken } = require("../tokenFunctions");

module.exports = (req, res) => {
  const { nickname, email, password, user_image_path, user_thumbnail_path } = req.body;
  if (!nickname || !email || !password) {
    return res.status(422).send("insufficient parameters supplied");
  }

  User.findOrCreate({
    raw: true,
    where: {
      nickname: nickname,
      email: email,
    },
    defaults: {
      password: password,
      user_image_path: user_image_path,
      user_thumbnail_path: user_thumbnail_path,
    },
  })
    .then(([save, created]) => {
      if (!created) {
        return res.status(409).send("email or nickname exists");
      } else {
        console.log("this is save : ", save);
        delete save.password;
        save.tokenCreated = new Date();

        let date = new Date();
        let expiresDate = date.setDate(date.getDate() + 7);
        console.log("expiresDate : ", expiresDate);
        // refreshToken 정보를 토큰 만료일로 넣기

        const accessToken = generateAccessToken(save);
        const refreshToken = generateRefreshToken(expiresDate);

        User.create(
          {
            refresh_token: refreshToken,
          },
          {
            where: {
              id: save.id,
            },
          }
        );

        sendRefreshToken(res, refreshToken);
        sendAccessToken(res, accessToken);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("server err");
    });
};
