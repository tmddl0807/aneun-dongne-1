import React, { useState, useEffect } from "react";
import axios from "axios";
import { Styled } from "./style";
import Cookies from "universal-cookie";
import { areaNameArr, allSigg } from "../../modules/AreaCodetoName";
import { useSetRecoilState, useResetRecoilState, useRecoilState } from "recoil";
import {
  token,
  kToken,
  placelist,
  usersArea,
  usersSigg,
  canSearchPlace,
  searchPlaceModal,
  searcnPlaceBtnPressed,
  setPlacelistLoading,
  usersaddress,
  accesstoken,
} from "../../recoil/recoil";
import HomeRightBtn from "../HomeSearchBtn/HomeRightBtn-index";

import { Autocomplete } from "../Autocomplete/Autocomplete";
import { getCodes } from "../../modules/AreaCodetoName";
function HomeRightbar() {
  const setOpenSearchPlaceModal = useSetRecoilState(searchPlaceModal);
  // const placeListReset = useResetRecoilState(placelist);
  const setSearchPlaceBtnPressed = useSetRecoilState(searcnPlaceBtnPressed);
  const setAbleToSearchPlace = useSetRecoilState(canSearchPlace);
  // const [area, setArea] = useState("null");
  const [add, setAdd] = useRecoilState(usersaddress);
  const [areaIdx, setAreaIdx] = useState(0);
  const cookies = new Cookies();
  const [accessToken, setAccessToken] = useRecoilState(accesstoken);
  const [area, setArea] = useRecoilState(usersArea);
  const [sigg, setSigg] = useRecoilState(usersSigg);
  const [place, setPlace] = useState("");

  const [hashtag, setHashtag] = useState("");
  const setPlaceList = useSetRecoilState(placelist);
  useEffect(() => {
    if (area === "null") setAreaIdx(0);
    else setAreaIdx(areaNameArr.indexOf(area));
  }, [, area]);
  const changeArea = (area) => {
    if (area === "지역선택") {
      setArea("null");
    } else {
      setArea(area);
    }
    setSigg("null");
    // setAreaIdx(areaNameArr.indexOf(area));
  };
  const changeSigg = (sigg) => {
    if (sigg === "지역선택") {
      setSigg("null");
    } else {
      setSigg(sigg);
    }
    // setLevel(10);
  };
  const handleSearch = (e) => {
    setPlace(e.target.value);
  };
  const handleTagSearch = (e) => {
    setHashtag(e.target.value);
    // console.log("handleTagSearch", hashtag);
  };
  const searchPlace = (area, sigg, place, hashtag) => {
    console.log(area, sigg, place, hashtag);
    // console.log("hash", hashtag);
    let areaCode = "";
    let siggCode = "";
    if (area === "null") {
      areaCode = 0;
      siggCode = 0;
    } else if (area !== "null" && sigg === "null") {
      areaCode = getCodes(area).areaCode;
      siggCode = 0;
    } else if (sigg !== "null") {
      areaCode = getCodes(area).areaCode;
      siggCode = getCodes(area, sigg).siggCode;
    }
    axios
      .get(`${process.env.REACT_APP_API_URL}/home`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          areacode: areaCode,
          sigungucode: siggCode,
          radius: 10000,
          clientwtmx: "null",
          clientwtmy: "null",
          tag: hashtag,
          searchWord: place,
        },
        withCredentials: true,
      })
      .then((res) => {
        // console.log(res.data.data);
        if (res.data.data.length === 0) {
          setAbleToSearchPlace(false);

          return;
        }
        console.log(res.data.data);
        const list = res.data.data
          .filter((el) => el.post_mapy !== "0.00000000000000000000" && el.post_mapx !== "0.00000000000000000000")
          .map((el) => {
            return [
              Number(el.post_mapy),
              Number(el.post_mapx),
              el.post_title,
              el.post_firstimage,
              el.post_addr1,
              el.post_contentid,
              el.post_tags ? el.post_tags.split(",") : [],
            ];
          });
        console.log(list);

        setSearchPlaceBtnPressed(true);
        setAdd(() => {
          console.log(area, sigg);
          if (area === "지역선택") area = "전체지역";
          if (sigg === "null" || sigg === "지역선택") sigg = "인기순 30";
          console.log(area, sigg);
          return { ...add, ...{ area, sigg, address: `${area} ${sigg}` } };
        });
        if (list.length > 0) {
          //검색결과 있으면 '텅비어있어요' 안나오게하기
          setAbleToSearchPlace(true);
        }
        setPlaceList(list);
      })
      .catch((err) => console.log(err));
    setAreaIdx(areaNameArr.indexOf(area));
    // console.log(areaNameArr.indexOf(area));
    // console.log(allSigg[areaIdx]);
  };
  // console.log(area);
  // console.log(areaNameArr.indexOf(area));

  // console.log([areaIdx]);
  useEffect(() => {
    //searchPlace실행되고 나면 지역검색에 null입력되기 때문에 다시 바꿔줌.
    if (area === "null") {
      setArea("지역선택");
      setSigg("지역선택");
    }
  }, [area, sigg]);

  return (
    <div>
      <Styled.MapRightBar>
        {/* <p>오늘 떠나볼 동네는?</p> */}
        <Styled.CloseBtn onClick={() => setOpenSearchPlaceModal(false)}>
          <i className="fas fa-times"></i>
        </Styled.CloseBtn>
        <Styled.SearchWrapper>
          <Styled.SearchBar>
            <Styled.SearchLocation first value={area} onChange={(e) => changeArea(e.target.value)} name="h_area1">
              {areaNameArr.map((el, idx, arr) => {
                return <option key={idx}>{el}</option>;
              })}
            </Styled.SearchLocation>
            <Styled.SearchLocation value={sigg} onChange={(e) => changeSigg(e.target.value)} name="h_area2">
              {allSigg[areaIdx].map((el, idx, arr) => {
                if (areaIdx === -1) console.log([areaIdx]);

                return <option key={idx}>{el}</option>;
              })}
            </Styled.SearchLocation>
          </Styled.SearchBar>
          <Autocomplete
            hashtag={hashtag}
            setHashtag={setHashtag}
            area={area}
            sigg={sigg}
            place={place}
            searchPlace={searchPlace}
          />
          {/* <Styled.SearchPlace
            type="text"
            value={hashtag}
            onChange={(e) => handleTagSearch(e)}
            placeholder="#해시태그 검색"
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                searchPlace(area, sigg, place, hashtag);
              }
            }}
          ></Styled.SearchPlace> */}
          <Styled.SearchPlace
            type="text"
            value={place}
            onChange={(e) => handleSearch(e)}
            placeholder="관광지 검색"
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                searchPlace(area, sigg, place, hashtag);
              }
            }}
          ></Styled.SearchPlace>
          {/* <div> */}
          <Styled.SearchBtn onClick={() => searchPlace(area, sigg, place, hashtag)}>
            <i className="fas fa-search"></i>
          </Styled.SearchBtn>
          {/* </div> */}
        </Styled.SearchWrapper>
        <HomeRightBtn />
      </Styled.MapRightBar>
    </div>
  );
}

export default HomeRightbar;
