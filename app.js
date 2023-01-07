var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var jwt = require("jsonwebtoken");
const secret_token = "login_generate_token";

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
  host: "https://demo-banana-api.azurewebsites.net",
  user: "root",
  password: "root",
  database: "mydb",
  port: 3306,
});

// app.get("/", (req, res) => {
//   // console.log(req);
//   res.json({ status: "200_ok", msg: "api run success" });
// });
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password)
  // console.log(req.body);
  if (!email || !password) {
    var data = {
      auth: false,
      meg: "กรุณากรอก Username หรือ Password ให้ครบถ้วน",
    };
    res.json(data);
  } else {
    connection.query(
      `SELECT * FROM tb_users WHERE email = '${email}' AND password = '${password}'`,
      [email, password],
      function (err, results, fields) {
        if (err) {
          res.json({ status: "error", msg: err });
          return;
        }
        if (results.length == 0) {
          {
            res.json({
              status: "ok_201",
              msg: "User or Password not corected.",
            });
            return;
          }
        } else if (results.length == 1) {
          var token = jwt.sign({ email: results[0].email }, secret_token, {
            expiresIn: "1h",
          });
          {
            res.json({ status: "ok_200", msg: "login Successed.", token });
            return;
          }
        } else {
          {
            res.json({ status: "err_else", msg: err });
            return;
          }
        }
        // res.json({ status: "200_ok", msg: results });
      }
    );
  }
});

app.post("/authen", (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, secret_token);
    // res.json({decoded})
    res.json({ status: "ok_200", decoded });
  } catch (err) {
    res.json({ status: "ok_202", msg: err.message });
  }
});

app.post("/add_userinfo", (req, res, next) => {
  const { data_ar_info } = req.body;
  const check = (data_ar_info) => {
    let err = true;
    data_ar_info.map((val, key) => {
      if (
        !val.email ||
        !val.nameTile ||
        !val.nValue ||
        !val.lValue ||
        !val.ageValue ||
        !val.inputValueEdu ||
        !val.expperyers
      ) {
        err = false;
      }
    });
    return err;
  };
  // console.log("amount", data_ar.length);
  console.log(data_ar_info);

  if (check(data_ar_info)) {
    data_ar_info.map((val, key) => {
      connection.query(
        `INSERT INTO tb_usersinfo (
          info_email,info_nametitle,info_fname,info_lname,info_age,info_edu,info_expyers,info_comname,info_comaddress,info_province,info_district,info_amphur,info_zipcode,info_yersbegin,info_proraw,info_proUnraw,info_source,info_qulity,info_amount) 
          VALUES ('${val.email}','${val.nameTile}','${val.nValue}','${val.lValue}','${val.ageValue}','${val.inputValueEdu}','${val.expperyers}','${val.comname}','${val.comaddress}','${val.province}','${val.district}','${val.amphur}','${val.zipcode}','${val.yersbegin}','${val.proraw}','${val.proUnraw}','${val.source}','${val.qulity}','${val.amount}')`,
        (err, result) => {
          err ? console.log(err) : null;
        }
      );
    });
    res.json({
      status: true,
      msg: "Nice pass values",
    });
  } else {
    res.json({
      status: false,
      msg: "Not pass values",
    });
  }
});

app.post("/add_weight", (req, res, next) => {
  const { data_ar } = req.body;
  const check = (data_ar) => {
    let err = true;
    data_ar.map((value, key) => {
      if (!value.w_wight || !value.w_name) {
        err = false;
      }
    });
    return err;
  };
  // console.log("amount", data_ar.length);
  console.log(data_ar);

  if (check(data_ar)) {
    data_ar.map((val, key) => {
      connection.query(
        `INSERT INTO tb_weight (w_name,w_wight,email) VALUES ('${val.w_name}','${val.w_wight}','${val.email}')`,
        (err, result) => {
          err ? console.log(err) : null;
        }
      );
    });
    res.json({
      status: true,
      msg: "Nice pass values",
    });
  } else {
    res.json({
      status: false,
      msg: "Not pass values",
    });
  }
});

// console.log(w_data.map);
app.post("/getuser", (req, res, next) => {
  const { email } = req.body;
  // console.log(email, password, fname, lname)
  // console.log(req.body);
  connection.query(
    `SELECT email, password, fname, lname FROM tb_users WHERE email = '${email}'`,
    (err, result) => {
      err ? console.log(err) : null;
      if (result.length === 1) {
        res.json({
          status: true,
          flag: false,
          meg: "email ซ้่า",
          result: result,
        });
        // console.log(result.length)
      } else {
        res.json({
          status: true,
          flag: true,
          meg: "email ไม่ซ้่า",
          result: result,
        });
        // console.log(result.length)
      }
    }
  );
});

app.post("/register", (req, res, next) => {
  const { email, password, fname, lname } = req.body;
  // console.log(email, password, fname, lname)
  // console.log(req.body);
  connection.query(
    "INSERT INTO tb_users (email, password, fname, lname) VALUES (?,?,?,?)",
    [email, password, fname, lname],
    function (err, results, fields) {
      if (err) {
        res.json({ status: "error", msg: "Not Found" });
        return;
      }
      if (results == 1) {
        res.json({ status: "200_ok", msg: "email ซำ้." });
      } else {
        res.json({ status: "200_ok", msg: "Register succesed." });
      }
    }
  );
});

app.listen(3001, function () {
  console.log("CORS-enabled web server listening on port 3001");
});
