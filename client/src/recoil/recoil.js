import { atom, selector } from "recoil";
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();
export const token = atom({
  key: "token",
  // default: cookies.get("jwt"),
  default: "",
});
export const kToken = atom({
  key: "kToken",
  // default: cookies.get("kakao-jwt"),
  default: "",
});

export const accesstoken = atom({
  key: "accessToken",
  default: "",
});

//! 유저 주소 - Home.js, savePositioModal 에서 사용
export const usersaddress = atom({
  key: "usersaddress",
  // default: { area: "서울", sigg: "서초구", addr: "서울 서오구 반포동 70-1" },
  default: { area: "지도를", sigg: "클릭해주세요", addr: "서울 서오구 반포동 70-1" },
});
export const usersArea = atom({
  key: "usersArea",
  default: "지역선택",
});
export const usersSigg = atom({
  key: "usersSigg",
  default: "지역선택",
});

export const placelist = atom({
  key: "placelist",
  default: [],
});

export const canSearchPlace = atom({
  key: "cannotSearchPlace",
  default: true,
});

//메인페이지에서 유저주소, 좌표 넘어오면 연결시키기

//! 관광지 관련 전역변수
export const placeaddress = atom({
  key: "placeaddress",
  default: "",
});

export const placetitle = atom({
  key: "placetitle",
  default: "",
});

export const placelocation = atom({
  key: "placelocation",
  default: { lat: 0, lon: 0 },
});
export const placeimg = atom({
  key: "placeimg",
  default: "",
});

export const sendPlaceinfo = selector({
  key: "sendPlaceInfo",
  get: ({ get }) => {
    return {
      img: get(placeimg),
      location: get(placelocation),
      title: get(placetitle),
      address: get(placeaddress),
    };
  },
  set: ({ set }, img, location, title, address) => {
    set(placeimg, img);
    set(placetitle, title);
    set(placelocation, location);
    set(placeaddress, address);
  },
});
export const searcnPlaceBtnPressed = atom({
  key: "searcnPlaceBtnPressed",
  default: false,
});
//! 로딩state
export const loading = atom({
  key: "loading",
  default: true,
});
export const commentloading = atom({
  key: "commentloading",
  default: false,
});

//! Home화면에서 현재위치 저장 모달
export const isSavepositionOpen = atom({
  key: "isSavepositionOpen",
  default: false,
});

export const locations = atom({
  key: "location",
  default: {
    lat: 36,
    lon: 127,
  },
});

//! 로긴
export const loginState = atom({
  key: "loginState",
  default: false,
});
//! 로긴모달
export const loginModal = atom({
  key: "loginModal",
  default: false,
});
export const userInfo = atom({
  key: "userInfo",
  default: {
    email: "",
    createdAt: "",
    nickname: "",
    updatedAt: "",
    user_area: "",
    user_sigg: "",
    user_image_path: "",
  },
});

//! 현재위치 버튼때 필요한 값, 새로고침될때빼고는 안바뀐다.
export const nowlocation = atom({
  key: "nowlocation",
  default: { lat: 0, lon: 0 },
});

// ! 페이지번호를 리코일에 저장
// export const contentid = atom({
//   key: "contentid",
//   default: 0,
// });
// export const defaultcomments = atom({
//   key: "defaultcomments",
//   default: [],
// });

//! 댓글 수정신호
export const deleteCommentmode = atom({
  key: "deleteCommentMode",
  default: false,
});
//!pickpoint바뀔때마다 바뀌는 값
export const defaultposition = atom({
  key: "defaultPosition",
  default: { lat: 37.5, lon: 127 },
});

// ! 위치기반 API -> 지도위 나타나는 좌표 바꾸는거. 지도 클릭한효과랑 같음
export const pickpoint = selector({
  key: "pickpoint",
  get: ({ get }) => {
    return [get(defaultposition).lat, get(defaultposition).lon];
  },
});

export const infoEdit = atom({
  key: "infoEdit",
  default: "",
});
//! 홈화면 지역 검색 모달
export const searchPlaceModal = atom({
  key: "searchPlaceModal",
  default: false,
});

// ! 현재위치
export const isClickedNowLocation = atom({
  key: "isClickedNowLocation",
  default: false,
});

// ! 위치기반 API - Homemap.js랑 연결
export const getWTM = selector({
  key: "getWTM",
  get: async ({ get }) => {
    const result = await axios.get(
      // `https://dapi.kakao.com/v2/local/geo/transcoord.json?x=${get(pickpoint)[1]}&y=${
      //   get(pickpoint)[0]
      // }&input_coord=WGS84&output_coord=WTM`,
      `https://dapi.kakao.com/v2/local/geo/transcoord.json?x=${get(defaultposition).lon}&y=${
        get(defaultposition).lat
      }&input_coord=WGS84&output_coord=WTM`,
      {
        headers: { Authorization: `KakaoAK ${process.env.REACT_APP_REST_API}` },
      }
    );
    const data = { x: result.data.documents[0].x, y: result.data.documents[0].y };
    // .then((res) => {
    //   return { x: res.data.documents[0].x, y: res.data.documents[0].y };
    // })
    // .catch((err) => console.log(err));

    return data;
  },
});

// export const placelist = selector({
//   key: "placelist",
//   get: async ({ get }) => {
//     const wtm = get(getWTM);
//     const result = await axios
//       .get(`${process.env.REACT_APP_API_URL}/home`, {
//         headers: {
//           // Authorization: `Bearer ${accessToken || kakaoToken}`,
//           "Content-Type": "application/json",
//         },
//         params: {
//           areacode: "null",
//           sigungucode: "null",
//           radius: 10000,
//           clientwtmx: wtm.x,
//           clientwtmy: wtm.y,
//           tag: "null", //null로 넣으면 undefined되어서, 문자열로 넣겠음
//           searchWord: "null",
//         },
//         withCredentials: true,
//       })
//       .then((res) => {
//         const list = res.data.data.map((el) => {
//           return [
//             Number(el.post_mapy),
//             Number(el.post_mapx),
//             el.post_title,
//             el.post_firstimage,
//             el.post_addr1,
//             el.post_contentid,
//           ];
//         });

//         return list;
//       });

//     return result;
//   },
// });

//! myVisited 모달
export const visitedModal = atom({
  key: "visitedModal",
  default: false,
});
//! 내 장소 저장 후 모달
export const saveOrNotModal = atom({
  key: "saveOrNotModal",
  default: false,
});

//! 회원탈퇴 재확인모달
export const warningDeleteUserModal = atom({
  key: "warningDeleteUserModal",
  default: false,
});

//! 다시 로그인해주세요 모달
export const loginAgainModal = atom({
  key: "loginAgainModal",
  default: false,
});
//!로딩
export const setPlacelistLoading = atom({
  key: "setPlacelistLoading",
  default: false,
});
//! 마이페이지
export const newVisitedPlace = atom({
  key: "newVisitedPlace",
  default: "",
});
export const newVisitedMemo = atom({
  key: "newVisitedMemo",
  default: "",
});
export const savedVisitedPlaceInMyPage = atom({
  key: "savedVisitedPlaceInMyPage",
  default: false,
});
export const fromMyPage = atom({
  key: "fromMyPage",
  default: false,
});
export const getVisitedList = selector({
  key: "getVisitedList",
  get: async ({ get }) => {
    const result = await axios
      .get(`${process.env.REACT_APP_API_URL}/visited`, {
        headers: {
          Authorization: `Bearer ${get(token)}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        return res.data.data;
      });

    return result;
  },
});

// 댓글 삭제 모달
export const deleteCommentModal = atom({
  key: "deleteCommentModal",
  default: false,
});

// 댓글 포스트 id
export const commentPostId = atom({
  key: "commentPostId",
  default: null,
});

// 댓글 고유 id
export const commentUniqueId = atom({
  key: "commentUniqueId",
  default: null,
});

// 댓글 삭제 시 로딩
export const commentDeleteLoading = atom({
  key: "commentDeleteLoading",
  default: false,
});
