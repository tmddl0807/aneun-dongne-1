import React, { useState } from "react";
import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Styled } from "./style";
import { message } from "../../modules/message";
import { token, accesstoken, userInfo } from "../../recoil/recoil";
import KakaoLogin from "./KakaoLogin";

const ModalLogin = ({ ToSignupModal, closeLoginModalHandler, onLogin }) => {
  const [accessToken, setAccessToken] = useRecoilState(accesstoken);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const { email, password } = loginInfo;
  const handleInputValue = (key) => (e) => {
    setLoginInfo({ ...loginInfo, [key]: e.target.value });
  };
  const setInfo = useSetRecoilState(userInfo);

  const handleLogin = async () => {
    if (email === "") {
      setErrorMessage(message.loginEmail);
      return;
    } else if (password === "") {
      setErrorMessage(message.loginPassword);
      return;
    }

    onLogin(email, password);
  };

  return (
    <>
      <Styled.FormContainer>
        <div className="close-button" onClick={closeLoginModalHandler}>
          <i className="fas fa-times"></i>
        </div>
        <img className="form-title" src="/images/logo.png" />
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-email">
            <label htmlFor="email">Email</label>
            <input id="email" type="text" value={email} onChange={handleInputValue("email")} />
          </div>
          <div className="form-password">
            <label htmlFor="password">password</label>
            <input id="password" type="password" value={password} onChange={handleInputValue("password")} />
          </div>
          <div className="error-message">{errorMessage}</div>
          <button type="submit" className="login-button" onClick={handleLogin}>
            로그인
          </button>

          <KakaoLogin />

          <div className="signup-text">아직 회원이 아니신가요?</div>
          <div className="signup-link" onClick={ToSignupModal}>
            회원가입하기
          </div>
        </form>
      </Styled.FormContainer>
    </>
  );
};

export default ModalLogin;
