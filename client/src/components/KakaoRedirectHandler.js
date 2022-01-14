import React, { useEffect } from "react";

import { useRecoilState, useSetRecoilState } from "recoil";
import { accesstoken } from "../recoil/recoil";
import Loading from "./Loading/Loading";
import { useHistory } from "react-router-dom";
import axios from "axios";

const KakaoRedirectHandler = () => {
  // 인가코드
  let code = new URL(window.location.href).searchParams.get("code");
  const [accessToken, setAccessToken] = useRecoilState(accesstoken);
  const history = useHistory();

  useEffect(async () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/kakao/callback?code=${code}`, {
        "Content-Type": "application/json",
        withCredentials: true,
      })
      .then((res) => {
        setAccessToken(res.data.data.accessToken);
        window.localStorage.setItem("jwt", "카카오로긴");
      })
      .then(() => {
        history.push("/"); // 토큰 받았고 로그인됐으니 화면 전환시켜줌(메인으로)
      })
      .catch((err) => {
        console.log("소셜로그인 에러", err);
        history.push("/"); // 로그인 실패하면 돌려보냄
      });
  }, []);

  return <Loading />;
};

export default KakaoRedirectHandler;
