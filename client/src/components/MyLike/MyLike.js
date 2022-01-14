import React, { useEffect, useState } from "react";
import axios from "axios";
import LikeLists from "./LikeLists.js";
import { useRecoilValue, useRecoilState } from "recoil";
import { token, kToken, accesstoken } from "../../recoil/recoil";

import styled from "styled-components";

import LikeLoading from "../Loading/LikeLoading";
import Empty from "../Empty/Empty.js";

import Cookies from "universal-cookie";

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @media screen and (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MyLike = () => {
  const [postsInfo, setPostsInfo] = useState([]);
  const [isLoing, setIsloading] = useState(true);
  const cookies = new Cookies();
  const [accessToken, setAccessToken] = useRecoilState(accesstoken);

  const renderMyLike = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/mypage/likelists`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: "true",
      })
      .then((res) => {
        setIsloading(true);
        setPostsInfo(res.data.data);
      })
      .then(() => {
        setIsloading(false);
      });
  };

  useEffect(() => {
    renderMyLike();
    return () => null;
  }, []);

  return (
    <div className="like-list">
      {isLoing ? (
        <div>
          <LikeLoading />
        </div>
      ) : (
        <>
          {postsInfo.length === 0 ? (
            <Empty />
          ) : (
            <List>
              {postsInfo.map((postsInfo) => (
                <LikeLists key={postsInfo.id} postsInfo={postsInfo} />
              ))}
            </List>
          )}
        </>
      )}
    </div>
  );
};

export default MyLike;
