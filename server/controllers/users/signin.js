const { User } = require("../../models");
const { generateAccessToken, generateRefreshToken, sendAccessToken, sendRefreshToken } = require("../tokenFunctions");

module.exports = (req, res) => {
  const { email, password } = req.body;
  User.findOne({
    raw: true,
    where: {
      email,
      password,
    },
  })
    .then((data) => {
      if (!data) {
        res.status(404).send("invalid user");
      } else {
        delete data.password;
        data.tokenCreated = new Date();

        let date = new Date();
        let expiresDate = date.setDate(date.getDate() + 7);
        const userInfo = data;

        const accessToken = generateAccessToken(data);
        const refreshToken = generateRefreshToken({ expiresDate: expiresDate });
        console.log("refresh", refreshToken);

        User.update(
          {
            refresh_token: String(refreshToken),
          },
          {
            where: {
              id: data.id,
            },
          }
        );

        sendRefreshToken(res, refreshToken);
        sendAccessToken(res, accessToken, userInfo);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("server err");
    });
};
