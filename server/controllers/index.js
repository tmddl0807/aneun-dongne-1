module.exports = {
  //User
  // getAuth: require("./users/subAuth").get,
  // updateAuth: require("./users/subAuth").patch,
  deleteAuth: require("./users/auth").delete,
  getAuth: require("./users/auth").get,
  updateAuth: require("./users/auth").patch,
  signup: require("./users/signup"),
  signin: require("./users/signin"),
  signout: require("./users/signout"),
  silentRefresh: require("./users/silentRefresh"),
  //kakao
  kakaoCallBack: require("./users/kakaoCallback"),
  kakaoSignout: require("./users/kakaoSignout.js"),
  //Home
  home: require("./home/home"),
  bookmark: require("./home/bookmark"),
  //Post
  postDetails: require("./postDetails"),
  //Like
  getLikeCount: require("./like").getLikeCount,
  addLike: require("./like").addLike,
  deleteLike: require("./like").deleteLike,
  //Comment
  readComments: require("./comment").readComments,
  createComment: require("./comment").createComment,
  updateComment: require("./comment").updateComment,
  deleteComment: require("./comment").deleteComment,
  //Visited
  readVisiteds: require("./myPage/myVisiteds").readVisiteds,
  createVisited: require("./myPage/myVisiteds").createVisited,
  updateVisited: require("./myPage/myVisiteds").updateVisited,
  deleteVisited: require("./myPage/myVisiteds").deleteVisited,
  //MyPage
  myLikes: require("./myPage/myLikes"),
  myComments: require("./myPage/myComments"),
  //Hashtag
  getTags: require("./hashtags"),
};
