import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import ModalLogin from "../ModalLogin/ModalLogin";
import ModalSignup from "../ModalSignup/ModalSignup";
import { Styled } from "./style";
import {
  isSavepositionOpen,
  loginState,
  loginModal,
  visitedModal,
  saveOrNotModal,
  loginAgainModal,
  warningDeleteUserModal,
  searchPlaceModal,
  accesstoken,
  userInfo,
} from "../../recoil/recoil";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import Cookies from "universal-cookie";

import WarningDeleteUserModal from "../ModalWarningDeleteUserInfo/WarningDeleteUserInfo";
import ModalSavePosition from "../ModalSavePosition/ModalSavePosition";
import SaveOrNotModal from "../ModalSaveOrNot/SaveOrNotModal";
import ModalLoginAgain from "../ModalLoginAgain/ModalLoginAgain";
import HomeRightbar from "../HomeSearchBar/Home-Rightbar-index";
import { message } from "../../modules/message";

const Header = () => {
  const cookies = new Cookies();
  // const setAccessToken = useSetRecoilState(accessToken);
  const [accessToken, setAccessToken] = useRecoilState(accesstoken);
  const history = useHistory();
  const [isLoginOpen, setIsLoginOpen] = useRecoilState(loginModal);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isSavePositionOpen, setIsSavePositionOpen] = useRecoilState(isSavepositionOpen);
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const [isSaveOrNotModal, setIsSaveOrNotModal] = useRecoilState(saveOrNotModal);
  const [isLoginAgainOpen, setIsLoginAgainOpen] = useRecoilState(loginAgainModal);
  const [isWarningModal, setWarningModal] = useRecoilState(warningDeleteUserModal);
  const [isOpenSearchPlaceModal, setIsOpenSearchPlaceModal] = useRecoilState(searchPlaceModal);
  const [errorMessage, setErrorMessage] = useState("");
  const setInfo = useSetRecoilState(userInfo);

  // const setTimeSilentRefresh = () => {
  //   // accessToken 만료하기 1분 전에 로그인 연장
  //   // setTimeout(onSilentRefresh(), 1740000);
  //   // console.log("시간");
  //   setTimeout(console.log("시간1"), 1000);
  // };

  const onLogin = (email, password) => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/user/login`,
        {
          email,
          password,
        },
        { "Content-Type": "application/json", withCredentials: true }
      )
      .then((res) => {
        if (res.status === 201) {
          setAccessToken(res.data.data.accessToken);
          setInfo(res.data.data.userInfo);
          setIsLogin(true);
          window.localStorage.setItem("jwt", "일반로긴"); //여기서 담고
          closeLoginModalHandler();
        }
      })
      .catch(() => {
        setErrorMessage(message.loginError);
      });
  };

  const onSignUp = (nickname, email, password, user_image_path, user_thumbnail_path) => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/user/signup`,
        {
          nickname,
          email,
          password,
          user_image_path,
          user_thumbnail_path,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status === 201) {
          setAccessToken(res.data.data.accessToken);
          setInfo(res.data.data.userInfo);
          setIsLogin(true);
          window.localStorage.setItem("jwt", "일반로긴"); //여기서 담고
          closeSignupModalHandler();
        }
      })
      .catch(() => {
        setErrorMessage(message.loginError);
      });
  };

  const onSilentRefresh = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/silent-refresh`, {
        headers: {
          // Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 201) {
          setAccessToken(res.data.data.accessToken);
          setInfo(res.data.data.userInfo);
          setIsLogin(true);
        }
      })
      .then(() => {
        console.log("onSilentRefresh");
      })
      .catch(() => {
        setErrorMessage(message.unauthorized);
      });
  };

  useEffect(() => {
    // if (cookies.get("jwt") || cookies.get("kakao-jwt")) {
    // if (window.localStorage.getItem("jwt")) {
    //조회
    onSilentRefresh();

    // setIsLogin(true);
    // } else {
    //   setIsLogin(false);
    // }
  }, []);
  // const isAuthenticated = async () => {
  //   console.log("isAuthenticated Accesstoken", accessToken);
  //   await axios
  //     .get(`${process.env.REACT_APP_API_URL}/user/info`, {
  //       headers: {
  //         // Authorization: `Bearer ${cookies.get("jwt") || cookies.get("kakao-jwt")}`,
  //         Authorization: `Bearer ${accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //       withCredentials: true,
  //     })
  //     .then((res) => {
  //       console.log("로그인성공", res);
  //       setInfo(res.data.data.userInfo);
  //       setIsLogin(true);
  //     });
  // };

  // const handleResponseSuccess = () => {
  //   isAuthenticated();
  // };

  const openLoginModalHandler = (e) => {
    if (isLoginOpen) {
      setIsLoginOpen(false);
    } else if (!isLoginOpen) {
      setIsLoginOpen(true);
    }
  };

  const closeLoginModalHandler = (e) => {
    if (isLoginOpen) {
      setIsLoginOpen(false);
    }
  };

  const closeLogoutModalHandler = (e) => {
    if (isSignupOpen) {
      setIsSignupOpen(false);
    }
  };

  const openSignupModalHandler = (e) => {
    if (isSignupOpen) {
      setIsSignupOpen(false);
    } else if (!isSignupOpen) {
      setIsSignupOpen(true);
    }
  };

  const closeSignupModalHandler = (e) => {
    if (isSignupOpen) {
      setIsSignupOpen(false);
    }
  };

  const closeSavePositionModalHandler = (e) => {
    setIsSavePositionOpen(false);
  };

  const closeSaveOrNotModalHandler = (e) => {
    setIsSaveOrNotModal(false);
  };

  const ToLoginModal = () => {
    if (isSignupOpen) {
      setIsSignupOpen(false);
      setIsLoginOpen(true);
    }
  };

  const ToSignupModal = () => {
    if (isLoginOpen) {
      setIsLoginOpen(false);
      setIsSignupOpen(true);
    }
  };
  const closeLoginAgainModalHandler = () => {
    setIsLoginAgainOpen(false);
  };
  const kakaologoutHandler = () => {
    window.location.assign(
      `https://kauth.kakao.com/oauth/logout?client_id=${process.env.REACT_APP_KAKAO_REST_API_KEY}&logout_redirect_uri=${process.env.REACT_APP_API_URL}/signout`
    );
    setIsLogin(false);
    window.localStorage.removeItem("jwt"); //제거
  };

  const logoutHandler = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/signout`, {}, { withCredentials: true }).then((res) => {
      setIsLogin(false);
      window.localStorage.removeItem("jwt"); //제거
    });

    history.push("/");
  };

  const closeWarningModalHandler = () => {
    setWarningModal(false);
  };

  return (
    <>
      {/* // 로그인 모달 */}
      <Styled.ModalContainer>
        {isLoginOpen ? (
          <>
            <Styled.ModalBackdrop onClick={closeLoginModalHandler}>
              <Styled.ModalView onClick={(e) => e.stopPropagation()}>
                <ModalLogin
                  ToSignupModal={ToSignupModal}
                  closeLoginModalHandler={closeLoginModalHandler}
                  onLogin={onLogin}
                  onSilentRefresh={onSilentRefresh}
                />
              </Styled.ModalView>
            </Styled.ModalBackdrop>
          </>
        ) : null}
      </Styled.ModalContainer>
      {/* // 회원가입 모달 */}
      <Styled.ModalContainer>
        {isSignupOpen ? (
          <>
            <Styled.ModalBackdrop onClick={closeSignupModalHandler}>
              <Styled.ModalView onClick={(e) => e.stopPropagation()}>
                <ModalSignup
                  ToLoginModal={ToLoginModal}
                  closeLogoutModalHandler={closeLogoutModalHandler}
                  onSignUp={onSignUp}
                  onSilentRefresh={onSilentRefresh}
                />
              </Styled.ModalView>
            </Styled.ModalBackdrop>
          </>
        ) : null}
      </Styled.ModalContainer>
      {/* // HomeMap.js - 현재위치 저장 모달 */}
      <Styled.ModalContainer>
        {isSavePositionOpen ? (
          <>
            <Styled.ModalBackdrop onClick={closeSavePositionModalHandler}>
              <Styled.ModalView onClick={(e) => e.stopPropagation()}>
                <ModalSavePosition />
              </Styled.ModalView>
            </Styled.ModalBackdrop>
          </>
        ) : null}
      </Styled.ModalContainer>
      {/* // profile.js - 회원탈퇴 경고모달창*/}
      <Styled.ModalContainer>
        {isWarningModal ? (
          <>
            <Styled.ModalBackdrop onClick={closeWarningModalHandler}>
              <Styled.ModalView height="300px" onClick={(e) => e.stopPropagation()}>
                <WarningDeleteUserModal />
              </Styled.ModalView>
            </Styled.ModalBackdrop>
          </>
        ) : null}
      </Styled.ModalContainer>

      {/* 홈화면에서 내장소 저장 후 뜨는 saveOrNot 모달 */}
      <Styled.ModalContainer>
        {isSaveOrNotModal ? (
          <>
            <Styled.ModalBackdrop onClick={closeSaveOrNotModalHandler}>
              <Styled.ModalView height="300px" onClick={(e) => e.stopPropagation()}>
                <SaveOrNotModal />
              </Styled.ModalView>
            </Styled.ModalBackdrop>
          </>
        ) : null}
      </Styled.ModalContainer>
      {/* 토큰만료되었을때 */}
      <Styled.ModalContainer>
        {isLoginAgainOpen ? (
          <>
            <Styled.ModalBackdrop onClick={closeLoginAgainModalHandler}>
              <Styled.ModalView height="300px" onClick={(e) => e.stopPropagation()}>
                <ModalLoginAgain />
              </Styled.ModalView>
            </Styled.ModalBackdrop>
          </>
        ) : null}
      </Styled.ModalContainer>
      {/* 지역검색창 모달 */}
      <Styled.ModalContainer>
        {isOpenSearchPlaceModal ? (
          <>
            <HomeRightbar />
          </>
        ) : null}
      </Styled.ModalContainer>

      <Styled.HeaderContainer>
        <div className="header-wrapper">
          <Link to="/home">
            <img src="/images/logo.png" id="logo" alt="logo"></img>
          </Link>
          <div className="header-button-wrapper">
            {!isLogin ? (
              <>
                <div className="mainpage-button" onClick={openLoginModalHandler}>
                  login
                </div>
                <div className="mainpage-button" onClick={openSignupModalHandler}>
                  Sign Up
                </div>
              </>
            ) : (
              <>
                {window.localStorage.getItem("jwt") === "카카오로긴" ? (
                  <div className="kakao_mainpage-button mainpage-button" onClick={kakaologoutHandler}>
                    Log Out
                  </div>
                ) : (
                  <div className="mainpage-button" onClick={logoutHandler}>
                    Log Out
                  </div>
                )}

                <Styled.StyledLink to="/mypage/like">
                  <div className="mainpage-button">My Page</div>
                </Styled.StyledLink>
              </>
            )}
          </div>
        </div>
      </Styled.HeaderContainer>
    </>
  );
};

export default Header;
