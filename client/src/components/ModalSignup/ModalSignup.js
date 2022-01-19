import React, { useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { valid } from "../../modules/validator";
import { message } from "../../modules/message";
import { token, accesstoken } from "../../recoil/recoil";
import { Styled } from "../ModalSignup/style";

const ModalSignup = ({
  handleResponseSuccess,
  ToLoginModal,
  closeLogoutModalHandler,
  onSignUp,
  onSilentRefresh,
  setTimeSilentRefresh,
}) => {
  const [userInfo, setUserInfo] = useState({
    nickname: "",
    email: "",
    password: "",
    passwordConfirm: "",
    user_image_path: "/images/men.png",
    user_thumbnail_path: "/images/men.png",
  });

  const [errorMessage, setErrorMessage] = useState({
    nickname: "",
    email: "",
    password: "",
    passwordConfirm: "",
    confirm: "",
  });

  const [accessToken, setAccessToken] = useRecoilState(accesstoken);

  const handleInputValue = (key) => (e) => {
    setUserInfo({ ...userInfo, [key]: e.target.value });
    const id = e.target.id;
    const value = e.target.value;
    if (id === "password-confirm") {
      if (userInfo.password === e.target.value) {
        setErrorMessage({ ...errorMessage, passwordConfirm: "" });
      } else {
        setErrorMessage({
          ...errorMessage,
          passwordConfirm: message.passordConfirm,
        });
      }
      return;
    }
    if (valid[id](value)) {
      setErrorMessage((prev) => {
        prev[id] = "";
        return prev;
      });
    } else {
      setErrorMessage((prev) => {
        prev[id] = message[id];
        return prev;
      });
    }
  };

  const handleSignup = () => {
    const { nickname, email, password, passwordConfirm, user_image_path, user_thumbnail_path } = userInfo;
    if (nickname === "" || email === "" || password === "" || passwordConfirm === "") {
      setErrorMessage({
        ...errorMessage,
        confirm: message.blankConfirm,
      });
      return;
    }

    if (errorMessage.nickname || errorMessage.email || errorMessage.password || errorMessage.passwordConfirm) {
      setErrorMessage({
        ...errorMessage,
        confirm: message.correctConfirm,
      });
      return;
    }

    onSignUp(nickname, email, password, user_image_path, user_thumbnail_path);
  };

  return (
    <>
      <Styled.FormContainer>
        <img src="/images/logo.png" className="form-title" />
        <div className="close-icon">
          <i className="fas fa-times" onClick={closeLogoutModalHandler}></i>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-nickname">
            <label htmlFor="nickname">Nickname</label>
            <input id="nickname" type="text" value={userInfo.nickname} onChange={handleInputValue("nickname")} />
            <div className="error-message">{errorMessage.nickname}</div>
          </div>
          <div className="form-email">
            <label htmlFor="email">Email</label>
            <input id="email" type="text" value={userInfo.email} onChange={handleInputValue("email")} />
            <div className="error-message">{errorMessage.email}</div>
          </div>

          <div className="form-password">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={userInfo.password} onChange={handleInputValue("password")} />
            <div className="error-message">{errorMessage.password}</div>
          </div>
          <div className="form-password-confirm">
            <label htmlFor="password-confirm">Password Confirm</label>
            <input
              id="password-confirm"
              type="password"
              value={userInfo.passwordConfirm}
              onChange={handleInputValue("passwordConfirm")}
            />
            <div className="error-message">{errorMessage.passwordConfirm}</div>
          </div>
          <div className="error-message">{errorMessage.confirm}</div>
          <button type="submit" className="signup-button" onClick={handleSignup}>
            회원가입
          </button>
          <div className="login-link" onClick={ToLoginModal}>
            로그인창으로 가기
          </div>
        </form>
      </Styled.FormContainer>
    </>
  );
};

export default ModalSignup;
