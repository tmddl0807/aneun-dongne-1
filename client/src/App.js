import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import axios from "axios";
import "./App.css";
import { message } from "./modules/message";

import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { loginState } from "./recoil/recoil";
import { token, kToken, userInfo } from "./recoil/recoil";

import { MainPage, Home, MyPage, DetailPage, KakaoRedirectHandler } from "./pages";
import Header from "./components/Header/Header";
import Cookies from "universal-cookie";
const App = () => {
  const cookies = new Cookies();
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const setInfo = useSetRecoilState(userInfo);
  // const accessToken = useRecoilValue(token);
  // const kakaoToken = useRecoilValue(kToken);
  // const [accesstoken, setAccesstoken] = useState("");

  const isAuthenticated = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/user/info`, {
        headers: {
          // Authorization: `Bearer ${cookies.get("jwt") || cookies.get("kakao-jwt")}`,
          // Authorization: `Bearer ${accesstoken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true, //ㅇㅓ차피 쿠키는 전송됨
      })
      .then((res) => {
        setInfo(res.data.data.userInfo);
        setIsLogin(true);
      });
  };

  useEffect(() => {
    // if (cookies.get("jwt") || cookies.get("kakao-jwt")) {
    if (window.localStorage.getItem("jwt")) {
      //조회
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [, window.localStorage.getItem("jwt")]);

  const handleResponseSuccess = () => {
    isAuthenticated();
  };

  return (
    <>
      <Header handleResponseSuccess={handleResponseSuccess} />
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route exact path="/home" component={Home} />
        <Route path="/mypage" component={MyPage} />
        <Route exact path="/detailpage/:id" component={DetailPage} />
        <Route path="/user/kakao/callback" component={KakaoRedirectHandler} />
      </Switch>
    </>
  );
};

export default App;
