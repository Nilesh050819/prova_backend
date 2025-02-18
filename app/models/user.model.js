const sql = require("./db.js");

// constructor
const Login = function(login) {
  this.email = login.email;
  this.password = login.password;
 
};




Login.checkLogin = (loginCred, result) => {
 // console.log(loginCred.body.email);
  email = loginCred.body.email;
  password = loginCred.body.password;
const query = "SELECT * FROM tbl_users where username = $1 AND is_deleted = $2";
//console.log(query)
  //sql.query("SELECT * FROM neo_users where user_name = $1", [email], (err, res) => {
  sql.query(query, [email,0], (err, res) => {
    //console.log('nilesh',res)
    if (err) {
      //onsole.log("error: ", err);
      result(err, null);
      return;
    }

    if (res['rows'].length) {
      //console.log("data found: ", res['rows'][0]);
     // result(null, res[0]);
      result(null, res['rows'][0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};



Login.getAll = (title, result) => {
  let query = "SELECT * FROM login";

  if (title) {
    query += ` WHERE title LIKE '%${title}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
     // console.log("error: ", err);
      result(null, err);
      return;
    }

    //console.log("tutorials: ", res);
    result(null, res);
  });
};



module.exports = Login;