require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");

module.exports = {
  generateAccessToken: (data) => {
    return sign(data, process.env.ACCESS_SECRET, { expiresIn: "1800s" });
  },
  generateRefreshToken: (data) => {
    return sign(data, process.env.REFRESH_SECRET, { expiresIn: "7d" });
  },
  sendAccessToken: (res, accessToken, userInfo) => {
    res.status(201).json({ data: { accessToken, userInfo }, message: "ok" });
  },
  sendRefreshToken: (res, refreshToken) => {
    res.cookie("jwt", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      // domain: ".aneun-dongne.com",
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "None",
    });
  },
  sendKakaoRefreshToken: (res, refreshToken) => {
    res.cookie("kakao-jwt", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      // domain: ".aneun-dongne.com",
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "None",
    });
  },
  isAuthorized: (req) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return null;
    }

    const accessToken = authorization.split(" ")[1];

    try {
      return verify(accessToken, process.env.ACCESS_SECRET);
    } catch (err) {
      return null;
    }
  },
  isRefreshAuthorized: (req) => {
    const refreshToken = req.cookies["jwt"] || req.cookies["kakao-jwt"];

    if (!refreshToken) {
      return null;
    }

    const refreshTokenOnly = authorization.split("=")[1];

    try {
      return verify(refreshTokenOnly, process.env.REFRESH_SECRET);
    } catch (err) {
      return null;
    }
  },
};
