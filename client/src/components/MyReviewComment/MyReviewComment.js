import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useRecoilValue, useRecoilState } from "recoil";
import { token, kToken, accesstoken } from "../../recoil/recoil";

import { Icon } from "react-icons-kit";
import { ic_cancel_outline } from "react-icons-kit/md/ic_cancel_outline";

import { Styled } from "./style";
import { getAreaNames } from "../../modules/AreaCodetoName";
import Cookies from "universal-cookie";
import LikeLoading from "../Loading/LikeLoading";

const MyReviewComment = ({ comment, renderMyComments }) => {
  const [accessToken, setAccessToken] = useRecoilState(accesstoken);
  const kakaoToken = useRecoilValue(kToken);
  const [isLoing, SetIsloading] = useState(false);

  const history = useHistory();
  const cookies = new Cookies();

  const sigungu = getAreaNames(comment.post.areacode, comment.post.sigungucode);
  const { user_image_path, nickname } = comment.user;
  const { id, comment_content, comment_tags, comment_post_contentid, createdAt } = comment.comments;
  const { title } = comment.post;
  const created = createdAt.slice(0, 10);
  const tagArr = comment_tags.split(",");

  const handleContentClick = () => {
    history.push(`/detailpage/${comment_post_contentid}`);
  };

  const deleteComment = async () => {
    SetIsloading(true);
    await axios
      .delete(`${process.env.REACT_APP_API_URL}/comment/${comment_post_contentid}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
        params: { commentId: id },
      })
      .then(() => {
        renderMyComments();
      })
      .then(() => {
        SetIsloading(false);
      });
  };

  return (
    <>
      <Styled.Comment>
        <div className="user-container">
          <div className="user-info-wrapper">
            <img src={user_image_path} className="user-image" />
            <div className="user-name">{nickname}</div>
          </div>
          <div className="user-content-wrapper">
            {isLoing ? (
              <>
                <LikeLoading />
              </>
            ) : (
              <div className="user-content" onClick={handleContentClick}>
                {comment_content}
              </div>
            )}
            <div className="user-hastag-wrapper">
              {tagArr.map((tag, idx) => (
                <span key={idx} className="user-hastag">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="user-content-bottom">
              <div className="user-location-wrapper">
                <span className="user-location">
                  [{sigungu.areaName} {sigungu.siggName}]
                </span>
                <span className="user-place" onClick={handleContentClick}>
                  {title}
                </span>
              </div>
              <div className="created-date">작성날짜 : {created}</div>
            </div>
          </div>
        </div>
        <div className="side" onClick={deleteComment}>
          <Icon size={28} icon={ic_cancel_outline} className="delete-button" />
        </div>
      </Styled.Comment>
    </>
  );
};

export default React.memo(MyReviewComment);
