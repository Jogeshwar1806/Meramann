const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql2/promise");
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

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "Meramann",
//   password: "200306",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

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

//sign-up in database
// app.post("/signup", async (req, res) => {
//   let q = "select * from posts";
//   let connection;
//   try {
//     connection = await pool.getConnection();
//     const [result] = await connection.query(q);
//     console.log(result);
//     res.send("result");
//     // throw err;
//   } catch (err) {
//     console.log(err);
//   } finally {
//     if (connection) {
//       console.log("Releasing connection back to the pool...");
//       connection.release();
//     }
//   }
// });
// app.post("/signup", async (req, res) => {
//   let q = "select * from posts";
//   try {
//     const [result] = connection.query(q);
//     console.log(result);
//     res.send("result");
//   } catch (err) {
//     console.log(err);
//   } finally {
//     if (connection) {
//       console.log("Releasing connection back to the pool...");
//       connection.release();
//     }
//   }
// });
async function createConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to the database');
        return connection;
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        throw error;
    }
}
app.post("/signup", async (req, res) => {
    const query = "SELECT * FROM posts";
    let connection;
    try {
        connection = await createConnection();
        const [result] = await connection.execute(query);
        console.log(result);
        res.send(result); // Send the result back
    } catch (err) {
        console.error('Error during database operation:', err.message);
        res.status(500).send('Server Error');
    } finally {
        if (connection) {
            await connection.end();
            console.log('Connection closed');
        }
    }
});

//search page
app.get("/search", (req, res) => {
  res.render("search.ejs");
});

//listening port
app.listen(port, () => {
  console.log(`Your Port ${port} is working bro chill !!`);
});
