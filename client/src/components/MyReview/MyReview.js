import React, { useState, useEffect } from "react";
import axios from "axios";

import { useRecoilValue, useRecoilState } from "recoil";
import { token, kToken, commentDeleteLoading, accesstoken } from "../../recoil/recoil";

import MyReviewComment from "../MyReviewComment/MyReviewComment";
import LikeLoading from "../Loading/LikeLoading";
import Empty from "../Empty/Empty";
import Cookies from "universal-cookie";

const MyReview = () => {
  const [accessToken, setAccessToken] = useRecoilState(accesstoken);
  const [isLoading, setIsloading] = useRecoilState(commentDeleteLoading);
  const [comments, setComments] = useState([]);

  const renderMyComments = async () => {
    setIsloading(true);
    await axios
      .get(`${process.env.REACT_APP_API_URL}/mypage/commentlists`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        setComments(res.data.data);
      })
      .then(() => {
        setIsloading(false);
      });
  };

  useEffect(() => {
    renderMyComments();
  }, []);

  return (
    <>
      <div className="comment-list">
        {isLoading ? (
          <div>
            <LikeLoading />
          </div>
        ) : (
          <div>
            {comments.length === 0 ? (
              <Empty />
            ) : (
              comments.map((comment) => {
                return (
                  <div key={comment.comments.id}>
                    <MyReviewComment comment={comment} renderMyComments={renderMyComments} />
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MyReview;
