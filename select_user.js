var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// app.use(
//   cors({
//     // origin: ["http://localhost:3001"],
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );

const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mydb",
  port: 3306,
});

app.get("/", (req, res) => {
  // console.log(req);
  res.json({ status: "200_ok", msg: "api run success" });
});

app.post("/register",(req, res, next) => {
  const { email, password, fname, lname } = req.body;
  console.log(email, password, fname, lname)
  console.log(req.body);
  connection.query(
    "INSERT INTO users (email, password, fname, lname) VALUES (?,?,?,?)",
    [email, password, fname, lname],
    function (err, results, fields) {
      if (err) {
        res.json({ status: "error", msg: "Not Found" });
        return;
      }
      res.json({ status: "200_ok", msg: "Nice pass register" });
    }
  );
});

app.listen(3001, function () {
  console.log("CORS-enabled web server listening on port 3333");
});
