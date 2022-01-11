const { User } = require("../../models");
const {
  generateAccessToken,
  generateRefreshToken,
  sendAccessToken,
  sendRefreshToken,
  sendKakaoRefreshToken,
} = require("../tokenFunctions");

//페이지 리로드 혹은 access token이 30분 지나 만료되었을때 여기로 요청
//refreshToken은 쿠키에 온거 그대로 다시 보내고 accessToken은 새로 만들어서

module.exports = (req, res) => {
  const refreshToken = req.cookies["jwt"] || req.cookies["kakao-jwt"];

  if (!refreshToken) {
    res.status(401).json({ data: null, message: "not authorized" });
  } else {
    User.findOne({
      raw: true,
      where: {
        refresh_token: refreshToken,
      },
    })
      .then((data) => {
        if (!data) {
          res.status(404).send("invalid user");
        } else {
          delete data.password;
          data.tokenCreated = new Date();

          //   let date = new Date();
          //   let expiresDate = date.setDate(date.getDate() + 7);

          const accessToken = generateAccessToken(data);
          //   const refreshToken = generateRefreshToken(expiresDate);
          // if (req.cookies["jwt"]) {
          //   sendRefreshToken(res, refreshToken);
          // }
          // if (req.cookies["kakao-jwt"]) {
          //   sendKakaoRefreshToken(res, refreshToken);
          // }
          sendAccessToken(res, accessToken);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("server err");
      });
  }
};
