const AppError = require("../../errorHandling/AppError");

const fs = require('fs');
const path = require('path');
const multer = require('multer');
var bcrypt = require("bcrypt");
const sql = require("./../models/db");




exports.getUserTypeAccess = (req, res, next) => {
 
  
  //console.log(req.query)
  const { p_field_slug } = req.query;

  let dbQuery = "SELECT * FROM fn_get_user_access_master(p_field_slug := $1)";
  //console.log(dbQuery)
  let dbQueryValues = [p_field_slug];

 
  sql.query(dbQuery, dbQueryValues, (err, result) => {

    if (err) {
      console.log('hi',err);
        return next(new AppError(400, "Unable to get data."))
    }
    //console.log(result)
    if (result['rows']) {

     // let dataArr = [];

     const dataObj = {}; // Initialize an empty object

    /* result['rows'].forEach(function(row) {
      const key = row['role_name'];
      const value = row['access_name'];
      
      dataObj[key] = value; // Add key-value pair to the object
    });*/
    
    //const cleanedData = cleanData(dataObj);
      
     
        res.status(200).json({
            status: "success",
            data: cleanData(result['rows'])
        });
    }
  });
};

exports.submitConfigSettings = async (req, res, next) => {
      var datetime = new Date();
      const curr_date = datetime.toISOString().slice(0, 10);
      const curr_date_time = datetime.toISOString();
      const loginId = 0;

      let dbQuery =
      "SELECT * FROM fn_add_config_settings( config_key := $1,config_value := $2,remarks := $3,p_added_date := $4)";
      let dbQueryValues_users = [
        p_config_key,
        p_config_value,
        p_remarks,
        curr_date_time,
      ];
    //console.log(dbQueryValues);
    sql.query(dbQuery, dbQueryValues_users, (error, result) => {
      if (error) {
        console.log(error);
        return next(new AppError(400, "Unable to insert data."));
      }
      if (result["rows"][0]?.fn_add_config_settings >= 0) {
        return res.status(200).json({
          status: "success",
          config_key: result["rows"][0].id
          
        
        });
      } else {
      // console.log(result["rows"][0]);
        return next(new AppError(400, "Unable to insert data."));
      }
    });
  
};

function cleanData(data) {
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string') {
      // Attempt to parse JSON if it's a JSON-encoded array in string format
      try {
        data[key] = JSON.parse(data[key]);
      } catch (e) {
        console.warn(`Could not parse ${key} as JSON.`);
      }
    } else if (Array.isArray(data[key])) {
      // Filter and join characters to form a clean array of IDs for Admin
      data[key] = data[key]
        .filter(char => !['[', ']', '"', ','].includes(char))
        .join('')
        .match(/\d{3}/g) || []; // Split the joined string into chunks of IDs if possible
    }
  });
  return data;
}

async function addUserAccess(user_type, user_access) {
  //console.log(user_access[user_type]);
  if (user_access[user_type] != undefined) {
    // const access_name_json = JSON.stringify(user_access[user_type]);
  }


  let dbQuery =
    "SELECT * FROM fn_add_config_settings( config_key := $1,config_value := $2,remarks := $3,p_added_date := $4)";
    let dbQueryValues_users = [
      p_config_key,
      p_config_value,
      p_remarks,
      curr_date_time,
    ];
  try {
    const result = await sql.query(dbQuery, dbQueryValues);

    const output = result["rows"][0]?.fn_add_config_settings;

    if (output >= 0) {
      return output; // Return the result
    } else {
      throw new Error("Function did not return a valid result.");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Unable to insert data."); // Or return a specific error value
  }
}

