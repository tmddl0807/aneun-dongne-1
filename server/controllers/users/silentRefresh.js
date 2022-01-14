const { User } = require("../../models");
const {
  isAuthorized,
  generateAccessToken,
  generateRefreshToken,
  sendAccessToken,
  sendRefreshToken,
  sendKakaoRefreshToken,
} = require("../tokenFunctions");

//페이지 리로드 혹은 access token이 만료되기 1분 전 여기로 요청
//refreshToken은 쿠키에 온거 그대로 다시 보내고 accessToken은 새로 만들어서

module.exports = (req, res) => {
  console.log("req-c", req.cookies);
  console.log("req-h", req.headers);
  const refreshToken = req.cookies["jwt"] || req.cookies["kakao-jwt"];
  const accessTokenData = isAuthorized(req);

  if (!accessTokenData) {
    res.status(401).json({ data: null, message: "not authorized" });
  } else {
    const { id } = accessTokenData;
    User.findOne({
      raw: true,
      where: {
        id: id,
      },
    })
      .then((data) => {
        if (!data) {
          return res.status(404).send("invalid user");
        } else {
          delete data.password;
          delete data.refresh_token;
          data.tokenCreated = new Date();
          const userInfo = data;
          //   let date = new Date();
          //   let expiresDate = date.setDate(date.getDate() + 7);

          const accessToken = generateAccessToken(data);
          sendAccessToken(res, accessToken, userInfo);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("server err");
      });
  }
};
