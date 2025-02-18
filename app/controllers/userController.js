
const AppError = require("../../errorHandling/AppError.js");
//const Invoice = require("../models/invoice.model.js");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
var bcrypt = require("bcrypt");
const sql = require("../models/db.js");

var unirest = require("unirest");
const { vectorize } = require('@neplex/vectorizer');


exports.submitUser = async (req, res, next) => {
  var datetime = new Date();
  const curr_date = datetime.toISOString().slice(0, 10);
  const curr_date_time = datetime.toISOString();
  const loginId = 0;

  const {
    staff_name,
    mobile_no,
    email_id,
    designation,
    sec_mobile_no,
    sec_email_id,
    user_remarks,
    username,
    password,
    category
  } = req.body.data;
  //console.log(req.body.data.project_name);

  let dbQuery1 = "SELECT * FROM fn_check_user_email(p_email := $1)";
  //console.log(client_email_id)
  let dbQueryValues1 = [email_id];

  sql.query(dbQuery1, dbQueryValues1, (err, result) => {
    if (err) {
      ///console.log(err)
      return next(new AppError(400, "Unable to get data."));
    }
    //console.log(result)
    if (result["rows"]) {
      let client_id = "0";

      if (result["rows"].length > 0 && result["rows"][0]["id"] > 0) {
        //console.log(result["rows"][0]['id']);
        res.status(200).json({
          status: "error",
          message: "Email already exists",
        });
      } else {
        // let salt = bcrypt.genSalt();
        let pw = password;
        const saltRounds = 10;
        // let passwordHash = await bcrypt.hash(req.body.password.toString(), 10);
        // let passwordHash1 = myF(req.body.password)
        bcrypt.hash(pw, saltRounds, (err, hash) => {
          let encrypt_password = hash;

          var arr = staff_name.split(" ");
          let dbQuery =
            "SELECT * FROM fn_add_users( p_email := $1,p_first_name := $2,p_last_name := $3,p_username := $4, p_password := $5, p_encode_password := $6, p_type := $7, p_mobile_no := $8, p_sec_email_id := $9, p_sec_mobile_no := $10, p_remarks := $11 , p_added_date := $12, p_category := $13)";
          let dbQueryValues_users = [
            email_id,
            arr[0],
            arr[1],
            username,
            encrypt_password,
            pw,
            designation,
            //client_address,
            mobile_no,
            sec_email_id,
            sec_mobile_no,
            user_remarks,
            curr_date_time,
            category,
          ];
          //console.log(dbQueryValues);
          sql.query(dbQuery, dbQueryValues_users, (error, result) => {
            if (error) {
              console.log(error);
              return next(new AppError(400, "Unable to insert data."));
            }
            if (result["rows"][0]?.fn_add_users >= 0) {
              return res.status(200).json({
                status: "success",
                user_id: result["rows"][0].id
                
               
              });
            } else {
             // console.log(result["rows"][0]);
              return next(new AppError(400, "Unable to insert data."));
            }
          });
        });
      }
    }
  });
  
};

exports.findAll = (req, res, next) => {
 
  /*Invoice.findAllInvoice(req.params.id, (err, data) => {
   
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Invoices."
      });
    else res.send(data);
  });    */
  //console.log(req.query)
  const { page, limit, search } = req.query;
//console.log(page)
  let dbQuery = "SELECT * FROM fn_get_users(p_page := $1, p_limit := $2)";
  console.log(dbQuery)
  let dbQueryValues = [page, limit];

  if (search != "") {
      dbQuery = "SELECT * FROM fn_get_users( p_name_search := $1 ,p_page := $2, p_limit := $3)";
     dbQueryValues = [search, page, limit];
  } 
  sql.query(dbQuery, dbQueryValues, (err, result) => {

    if (err) {
      console.log(err);
        return next(new AppError(400, "Unable to get data."))
    }
    //console.log(result)
    if (result['rows']) {
          async function main() {
            try {
              const userCount = await getUsersCount(search);
              console.log(userCount);
              res.status(200).json({
                status: "success",
                data: result['rows'],
                totalCount: userCount
            });

                } catch (err) {
              console.error('Error in main:', err); // Catch any errors
            }
          }
          main();

    }
  });
};

async function myF($pw) {
  let names;
  let passwordHash = await bcrypt.hash($pw.toString(), 10);
  //console.log(passwordHash);
  //return passwordHash;
}
// Delete all Invoices from the database.
async function getUsersCount(p_name_search)
{
    let dbQuery = "SELECT * FROM fn_get_users_count(p_name_search := $1)";
      
    let dbQueryValues = [p_name_search];
    //console.log(dbQueryValues)
    try {
      const result = await sql.query(dbQuery, dbQueryValues);
      
      const output = result["rows"][0]['cnt'];

      if (output) {
      return output; // Return the result
      } else {
        throw new Error('Function did not return a valid result.');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Unable to select data.'); // Or return a specific error value
    }
  
}

exports.clientProjects = (req, res, next) => {
 
  /*Invoice.findAllInvoice(req.params.id, (err, data) => {
   
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Invoices."
      });
    else res.send(data);
  });    */
  //console.log(req.query)
  const { page, limit, search, client_id } = req.query;
//console.log(page)
  let dbQuery = "SELECT * FROM fn_get_client_projects(p_page := $1, p_limit := $2, p_client_id := $3)";
  console.log(dbQuery)
  let dbQueryValues = [page, limit, client_id];

  

  
  sql.query(dbQuery, dbQueryValues, (err, result) => {

    if (err) {
      console.log(err);
        return next(new AppError(400, "Unable to get data."))
    }
    //console.log(result)
    if (result['rows']) {

          async function main() {
            try {
            //  console.log(projectCount);
              res.status(200).json({
                status: "success",
                data: result['rows'],
               // totalCount: projectCount
            });

                } catch (err) {
              console.error('Error in main:', err); // Catch any errors
            }
          }
          main();

       
    }
  });
};

exports.verifyIdAndMobile = (req, res, next) => {
 console.log('nilesh')
  const { username, mobile, otp } = req.body;
//console.log(username)
  let dbQuery = "SELECT * FROM fn_get_users_valid_mobile_count(p_username := $1, p_mobile_no := $2)";
  console.log(dbQuery)
  let dbQueryValues = [username, mobile];

  sql.query(dbQuery, dbQueryValues, (err, result) => {

    if (err) {
      console.log(err);
        return next(new AppError(400, "Unable to get data."))
    }
   // console.log(result)
    if (result['rows']) {

            try {

              const otp_msg = 'OTP for Prova forget password is '+otp;

              var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");

                req.query({
                  "authorization": process.env.SMS_API_KEY,
                  "sender_id": "Prova",
                  "message": otp_msg,
                  "variables_values": "12345|asdaswdx",
                  "route": "dlt",
                  "numbers": mobile,
                });

                req.headers({
                  "cache-control": "no-cache"
                });


                req.end(function (res) {
                  if (res.error) throw new Error(res.error);
                   console.log(res.body);
                });







            //  console.log(projectCount);
              res.status(200).json({
                status: "success",
                data: result["rows"][0]['cnt'],
               // totalCount: projectCount
            });

                } catch (err) {
              console.error('Error in main:', err); // Catch any errors
            }
         
      }
  });
};

exports.resetPassword = (req, res, next) => {
      const {
              username,
              new_password,
        } = req.body;

        let pw = new_password;
        const saltRounds = 10;
       
        bcrypt.hash(pw, saltRounds, (err, hash) => {
                  let encrypt_password = hash;
                  let ori_password = new_password;
              let dbQuery =
                "SELECT * FROM fn_reset_password( p_username := $1, p_password := $2)";
              let dbQueryValues = [username, encrypt_password];
              sql.query(dbQuery, dbQueryValues, (error, result) => {
                if (error) {
                  console.log(error);
                  return "error";
                  //return next(new AppError(400, "Unable to insert data."));
                }
                if (result["rows"][0]?.fn_reset_password >= 0) {
                  res.status(200).json({
                      status: "success",
                    });
                } else {
                  return "error";
                }
      });
  });
}


