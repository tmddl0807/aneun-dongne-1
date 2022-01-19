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

  return (
    <>
      <Header />
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
