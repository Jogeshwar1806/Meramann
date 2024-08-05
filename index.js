const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql2");
const methodOverride = require("method-override");
const { faker } = require("@faker-js/faker");
const { encode } = require("querystring");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

let port = 8080;

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "Meramann",
  password: "200306",
});

//home page
app.get("/", (req, res) => {
  res.render("home.ejs");
});

//login page(sign-in & sign-up)
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

//sign-in in website
app.post("/signin", (req, res) => {
  let { email, password } = req.body;
  let q = `SELECT password from posts where email="${email}";`;
  try {
    connection.query(q, (err, result) => {
      let pass = result[0].password;
      if (pass == password) {
        res.redirect("/posts");
      }
      if (err) throw err;
    });
  } catch (err) {
    console.log(err);
  }
});

//sign-up in database
app.post("/signup", (req, res) => {
  let { username, email, password } = req.body;
  console.log(faker.string.uuid(), username, email, password);
  let q = `Insert into posts (id,username,email,password) values ("${faker.string.uuid()}","${username}","${email}","${password}");`;
  try {
    connection.query(q, (err, result) => {
      console.log(result);
      if (err) throw err;
      res.redirect("/posts");
    });
  } catch (err) {
    console.log(err);
  }
});

//show all posts
app.get("/posts", (req, res) => {
  let q = "SELECT * FROM posts;";
  try {
    connection.query(q, (err, result) => {
      console.log(result);
      console.log(faker.string.uuid());
      res.render("posts.ejs", { result });
      if (err) throw err;
    });
  } catch (err) {
    console.log(err);
  }
});

//forget password page
app.get("/forget", (req, res) => {
  res.render("forget.ejs");
});

//wronng password
app.get("/wrongpass", (req, res) => {
  res.send("Wrong Password");
});

//search page
app.get("/search", (req, res) => {
  res.render("search.ejs");
});

//search get by username
app.get("/post", (req, res) => {
  let {username} = req.query;
  console.log(username);
  let q = `SELECT content FROM posts WHERE username = "${username}"`;
  try{
    connection.query(q,(err,result)=>{
      console.log(result[0].content);
      if(err) throw err;
      res.send("noooo");
    });
  }catch(err){
    console.log(err);
  }
});

//listening port
app.listen(port, () => {
  console.log(`Your Port ${port} is working bro chill !!`);
});
