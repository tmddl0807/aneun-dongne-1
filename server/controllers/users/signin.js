const { User } = require("../../models");
const {
  isRefreshAuthorized,
  generateAccessToken,
  generateRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require("../tokenFunctions");
require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");

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
        const verifyRefreshToken = verify(refreshToken, process.env.REFRESH_SECRET);
        const jsonRefreshToken = JSON.stringify(verifyRefreshToken);
        console.log("refresh", refreshToken);
        console.log("refresh-r", verifyRefreshToken);
        console.log("refresh-re", jsonRefreshToken);
        console.log("refresh-rer", JSON.parse(jsonRefreshToken));
        console.log("refresh-rer", data.id);

        User.update(
          {
            refresh_token: String(jsonRefreshToken),
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
