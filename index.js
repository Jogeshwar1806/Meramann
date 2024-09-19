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

let inn = false;
let profile = "";
let signin = false;

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
  let q = `SELECT password from users where email="${email}";`;
  try {
    connection.query(q, (err, result) => {
      console.log(result[0].password);
      let pass = result[0].password;
      if (pass != password) {
        res.status(404).send("Wrong Password");
      } else {
        let q1 = `SELECT username from users where email="${email}";`;
        try {
          connection.query(q1, (error, result1) => {
            inn = true;
            profile = result1[0].username;
            signin = true;
            res.redirect("/users");
            if (error) throw error;
          });
        } catch (error) {
          console.log(error);
          res.send(error);
        }
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
  username = username.replace(/\s+/g, "");
  console.log(faker.string.uuid(), username, email, password);
  let q = `Insert into users (id,username,email,password) values ("${faker.string.uuid()}","${username}","${email}","${password}");`;

  try {
    connection.query(q, (err, result) => {
      console.log(result);
      if (err) throw err;
      res.redirect("/users");
    });
  } catch (err) {
    console.log(err);
  }

  let q2 = `create table ${username} (id varchar(50) primary key,contents VARCHAR(500) default NULL);`;
  try {
    connection.query(q2, (err, result) => {
      console.log(result);
      if (err) throw err;
    });
  } catch (err) {
    console.log(err);
  }
});

//show all users
app.get("/users", (req, res) => {
  let q = `SELECT * FROM users where username != "${profile}";`;
  try {
    if (inn) {
      try {
        connection.query(q, (err, result) => {
          res.render("users.ejs", { result });
          if (err) throw err;
        });
      } catch (err) {
        console.log(err);
        res.send(err);
      }
    } else {
      res.render("404 Error : Page Not Found.");
    }
  } catch (err) {
    console.log("Error Occured in Show all users");
    res.redirect("/");
  }
});

//show all posts of :id user
app.get("/users/:id", (req, res) => {
  let { id } = req.params;
  let q1 = `SELECT username FROM users WHERE id = "${id}";`;
  try {
    if (inn) {
      try {
        connection.query(q1, (err, result) => {
          console.log(result[0].username);
          let tablename = result[0].username;
          console.log(tablename);
          let q2 = `SELECT * FROM ${tablename};`;
          console.log("q2", tablename);
          try {
            connection.query(q2, (err, result1) => {
              console.log(result1);
              res.render("posts.ejs", { result1 });
              if (err) throw err;
            });
          } catch (err) {
            console.log(err);
          }
        });
      } catch (err) {
        console.log("Error Occured in all posts by user");
        res.send("Error Occured in all posts by user");
      }
    }
  } catch (err) {
    console.log("Error Occured in all posts by user");
    res.send("Error Occured in all posts by user");
  }
});

//forget password page
app.get("/forget", (req, res) => {
  try{
      res.render("forget.ejs");
  }catch(err){
    res.redirect("/");
    console.log("Error in search page.");
  }
});

//wronng password
app.get("/wrongpass", (req, res) => {
  try{
    if(inn){
      res.send("Wrong Password");
    }
  }catch(err){
    res.redirect("/");
    console.log("Error in search page.");
  }
});

//search page
app.get("/search", (req, res) => {
  try{
    if(inn){
      res.render("search.ejs");
    }
  }catch(err){
    res.redirect("/");
    console.log("Error in search page.");
  }
});

//Show Searched Result.
app.post("/posts", (req, res) => {
  let { username } = req.body;
  let q = `SELECT * FROM users WHERE username = "${username}";`;
  try{
    if(inn){
      try {
        connection.query(q,(err,result)=>{
          console.log(result);
          res.render("post.ejs",{result});
          if(err) throw err;
        })
      } catch (err) {
    console.log("Error found in show searched result.");
    res.redirect("/users");
      }
    }
  }catch(err){
    console.log("Error found in show searched result.");
  }
});

//Shows Profile Page
app.get("/profile", (req, res) => {
  let q = `SELECT * FROM ${profile}`;
  try {
    if (inn) {
      try {
        connection.query(q, (err, result) => {
          console.log(result);
          res.render("profile.ejs", { result });
          if (err) throw err;
        });
      } catch (err) {
        console.log("Error in profile");
      }
    }
  } catch (err) {}
});

//render to the creation of new post by user
app.get("/contents", (req, res) => {
  try{
    if(inn){
      res.render("newpostbyuser.ejs");
    }
  }catch(err){
    res.redirect("/");
    console.log("Error in search page.");
  }
});

//search get by username
app.post("/contents", (req, res) => {
  let { contents } = req.body;
  let q = `INSERT INTO ${profile} (id,contents) values ("${faker.string.uuid()}","${contents}"); `;
  try {
    if (inn) {
      try {
        connection.query(q, (err, result) => {
          console.log(result);
          res.redirect("/profile");
          if (err) throw err;
        });
      } catch (err) {
        console.log("Error Generated by creating Post");
      }
    }
  } catch (err) {
    console.log("Error Generated by creating Post");
  }
});

//listening port
app.listen(port, () => {
  console.log(`Your Port ${port} is working bro chill !!`);
});
