const fs = require('fs');
const util = require('util');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const Login = require("../models/user.model.js");
const Register = require("../models/register.model.js");
require("dotenv").config();
/*
const app = express();

var corsOptions = {
  origin: "http://localhost:8080/",
};
app.use(cors(corsOptions));*/
// Find a single Tutorial with a id
exports.autheticate = (req, res) => {
 
    Login.checkLogin(req, (err, data) => {
    // console.log(data,'nilesh');
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: "Invalid Credentials "
            });
          } else {
            res.status(500).send({
              message: "Invalid Credentials "
            });
          }
        } else{
        // console.log(   "-->",req.body.password,data);
            var passwordIsValid = bcrypt.compareSync(
              req.body.password,
              data['password']
            );
            if(!passwordIsValid){
              return res.status(401)
              .send({
                accessToken: null,
                message: "Invalid Password!"
              })
            }
            var token = jwt.sign({
              id: data['id']
            }, process.env.ACCESS_TOKEN_SECRET, {
            //  algorithm: "HS256",
              expiresIn: process.env.ACCESS_TOKEN_LIFE

            });

            res.status(200)
            .send({
                user: {
                  id: data['id'],
                  username: data['username'],
                  email: data['email'],
                  type: data['type'],
                  mobile_no: data['mobile_no'],
                  full_name: (data['first_name']) ?data['first_name'] : ''+" "+(data['last_name']) ? data['last_name'] : '',
                  

                },
                message: "Login Successfull",
                accessToken: token,
            })
        }

          //else res.send(data);
        });
};

exports.findAll = (req, res) => {
  const title = req.query.title;

  Login.getAll(title, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    else res.send(data);
  });    
};
async function myF($pw) {
  let names;
  let passwordHash = await bcrypt.hash($pw.toString(), 10);
  //console.log(passwordHash);
  //return passwordHash;
}
exports.setRegister = (req, res) => {
  
  //console.log(req.body)
  //const salt =  bcrypt.genSalt(10);
    // now we set the user password to hashed password
   // const encPassword =  bcrypt.hash(req.body.password, salt);
    let salt = bcrypt.genSalt();
    let pw = req.body.password;
    const saltRounds = 10;
   // let passwordHash = await bcrypt.hash(req.body.password.toString(), 10);
    let passwordHash1 = myF(req.body.password) 
  // Create a Tutorial
  //console.log(req.body.password)
  bcrypt.hash(pw, saltRounds, (err, hash) => {
      const users = new Register({
        email: req.body.email,
        password: hash,
        origional_password: pw,
        
      });
     // console.log(passwordHash1)
      Register.createUser(users, (err, data) => {
       // console.log(err);
        

          
          });
    });
};
exports.refreshToken = (req, res) => {
 // console.log('hi')
};

