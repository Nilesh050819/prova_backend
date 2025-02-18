const sql = require("./db.js");

// constructor

const Register = function(register) {
  this.email = register.email;
  this.password = register.password;
  this.origional_password = register.origional_password;
 
};





//register'


Register.createUser = (registerData, result) => {
  //console.log(registerData);
  //console.log(registerData);
 
  sql.query("INSERT INTO login SET ?", registerData, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

   // console.log("created user: ", { id: res.insertId, ...registerData });
    result(null, { id: res.insertId, ...registerData });
  });
};



module.exports = Register;