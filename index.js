const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb://127.0.0.1:27017/project1");

const Role = require("./models/role");
const User = require("./models/user");
const Category = require("./models/category");
const Source = require("./models/source");
const News = require("./models/news");
const Session = require("./models/session");


//AUTH
const {
  registerPost,
  passwordLess,
  confirmAccountGet,
  login2FAPost,
  verifyPhoneCode,
} = require("./controllers/authController");

//SESSION

const {

  sessionPost,
  sessionGet,
} = require("./controllers/sessionController.js");

//ROLE

const {

  rolePost,
  roleGet,
  rolePatch,
  roleDelete,
} = require("./controllers/roleController.js");


//USER
const {

  userPost,
  userGet,
  userDelete,
  getAllUsers,
  //userSession,
} = require("./controllers/userController.js");


//CATEGORY

const {

  categoryPost,
  categoryGet,
  categoryPatch,
  categoryDelete,
} = require("./controllers/categoryController.js");


//SOURCE

const {

  sourcePost,
  sourceGet,
  sourcePatch,
  sourceDelete,
} = require("./controllers/sourceController.js");


//NOTICE

const {

  newsPost,
  newsGet,
  newsPatch,
  newsDelete,
} = require("./controllers/newsController");

//TAGS

const {
  tagsGet
} = require("./controllers/tagsController");


const bodyParser = require("body-parser");
app.use(bodyParser.json());


// check for cors
const cors = require("cors");
app.use(cors({
  domains: '*',
  methods: "*",
  origin: 'http://localhost:3000' 
}));

//AUTH
app.post("/auth/register", registerPost);
app.get("/auth/confirm/:confirmationCode", confirmAccountGet);
// app.post("/auth/login", loginPost);
app.post("/auth/login2FA", login2FAPost);
app.post("/auth/verifyPhoneCode", verifyPhoneCode);
app.post("/auth/passwordLess",passwordLess);



//SESSIION

app.post("/session", sessionPost);
app.get("/session", sessionGet);

//ROLE

app.post("/role", rolePost);
app.get("/role", roleGet);
app.patch("/role", rolePatch);
app.delete("/role:id", roleDelete);


//USERS

app.post("/user", userPost);
//app.get("/user", userGet);
app.get("/user", getAllUsers);
//app.post("/user/login", userSession);
//app.put("/user", userPatch);

app.delete("/user/:id", userDelete);



//CATEGORY

app.post("/category", categoryPost);
app.get("/category", categoryGet);
app.patch("/category", categoryPatch);
app.delete("/category", categoryDelete);


//SOURCE

app.post("/source", sourcePost);
app.get("/source", sourceGet);
app.patch("/source", sourcePatch);
app.delete("/source", sourceDelete);


//NOTICE

app.post("/news", newsPost);
app.get("/news", newsGet);
app.patch("/news", newsPatch);
app.delete("/news", newsDelete);

// TAGS
app.get("/api/tags", tagsGet);




app.listen(4000, () => console.log(`Project1 listening on port 4000!`))