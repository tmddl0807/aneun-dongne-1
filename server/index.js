require("dotenv").config();
const fs = require("fs"); //!!
const https = require("https"); //!!
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const { upload } = require("./upload");
const controllers = require("./controllers");
const app = express();

// const PORT = 3065; (배포)
const PORT = 80;

// const controllers = require("./controllers");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: ["https://localhost:3000", "http://localhost:3000", "https://aneun-dongne.com", "http://aneun-dongne.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/home", controllers.home);
app.get("/post", controllers.postDetails);

app.get("/user/info", controllers.getAuth);
app.patch("/user/info", upload.single("image"), controllers.updateAuth);

app.post("/user/signup", controllers.signup);
app.post("/user/login", controllers.signin);

app.post("/signout", controllers.signout);
app.post("/home/bookmark", upload.single("image"), controllers.bookmark);

app.get("/comment/:contentId", controllers.readComments);
app.post("/comment/:contentId", controllers.createComment);
app.patch("/comment/:contentId", controllers.updateComment);
app.delete("/comment/:contentId", controllers.deleteComment);

app.get("/like", controllers.getLikeCount);
app.post("/like", controllers.addLike);
app.delete("/like", controllers.deleteLike);

let server;
if (fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
  const privateKey = fs.readFileSync(__dirname + "/key.pem", "utf8");
  const certificate = fs.readFileSync(__dirname + "/cert.pem", "utf8");
  const credentials = { key: privateKey, cert: certificate };

  server = https.createServer(credentials, app);
  server.listen(PORT, () => console.log("https server runnning"));
} else {
  server = app.listen(PORT, () => console.log("http server runnning"));
}

// (배포)
// let server;
// server = app.listen(PORT, () => console.log("http server runnning"));
// module.exports = server;
