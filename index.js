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


const bodyParser = require("body-parser");
app.use(bodyParser.json());


// check for cors
const cors = require("cors");
app.use(cors({
  domains: '*',
  methods: "*"
}));


//SESSIION

app.post("/session", sessionPost);
app.get("/session", sessionGet);

//ROLE

app.post("/role", rolePost);
app.get("/role", roleGet);
app.patch("/role", rolePatch);
app.delete("/role", roleDelete);


//USERS

app.post("/user", userPost);
app.get("/user", userGet);
//app.post("/api/user/login", userSession);
//app.put("/api/user", userPatch);


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




app.listen(4000, () => console.log(`Project1 listening on port 4000!`))