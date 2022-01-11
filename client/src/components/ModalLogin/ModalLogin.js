import React, { useState } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { Styled } from "./style";
import { message } from "../../modules/message";
import { token } from "../../recoil/recoil";
import KakaoLogin from "./KakaoLogin";

const ModalLogin = ({ handleResponseSuccess, ToSignupModal, closeLoginModalHandler }) => {
  // const setAccessToken = useSetRecoilState(token);
  const [accesstoken, setAccesstoken] = useState("");
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const { email, password } = loginInfo;
  const handleInputValue = (key) => (e) => {
    setLoginInfo({ ...loginInfo, [key]: e.target.value });
  };

  const onSilentRefresh = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/user/silent-refresh`, {})
      .then(onLoginSuccess)
      .then(() => {
        handleResponseSuccess();
        window.localStorage.setItem("jwt", "일반로긴"); //여기서 담고
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(message.loginError);
        // ... 로그인 실패 처리
      });
  };

  const onLoginSuccess = (response) => {
    console.log(response);
    const { accessToken } = response.data.data;
    setAccesstoken(accessToken);

    // accessToken 설정
    axios.defaults.headers.common["Authorization"] = `Bearer ${accesstoken}`;
    const JWT_EXPIRY_TIME = 30 * 60 * 1000; // 만료 시간 (24시간 밀리 초로 표현)
    // accessToken 만료하기 1분 전에 로그인 연장
    setTimeout(onSilentRefresh, JWT_EXPIRY_TIME - 60000);
  };

  const handleLogin = async () => {
    if (email === "") {
      setErrorMessage(message.loginEmail);
      return;
    } else if (password === "") {
      setErrorMessage(message.loginPassword);
      return;
    }

    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/user/login`,
        {
          email,
          password,
        },
        { "Content-Type": "application/json", withCredentials: true }
      )
      .then(onLoginSuccess)
      .then(() => {
        closeLoginModalHandler();
      })
      .then(() => {
        handleResponseSuccess();
        window.localStorage.setItem("jwt", "일반로긴"); //여기서 담고
      })
      .catch(() => {
        setErrorMessage(message.loginError);
      });
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
