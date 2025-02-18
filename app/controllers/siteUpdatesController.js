const AppError = require("../../errorHandling/AppError");

const fs = require('fs');
const path = require('path');
const multer = require('multer');
var bcrypt = require("bcrypt");
const sql = require("../models/db");


const utcDate = new Date();
const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
const istDate = new Date(utcDate.getTime() + istOffset);

// Format IST date as a string
const curr_date_time = istDate.toISOString().replace('T', ' ').slice(0, -1);

 exports.getProjectSiteCategories = (req, res, next) => {
  //const { p_id } = req.query;
  let p_data  = req.body.data;
  let projectId  = req.body.projectId;
  //console.log('nilesh',p_data)
 // const idArray = JSON.parse(p_data);
 inputString = p_data.replace(/{/g, "[").replace(/}/g, "]");

 const inputArray = JSON.parse(inputString);
 
///console.log(inputArray);
 const p_strId = inputArray.join(",");
 
// console.log(p_strId); // Output: "9, 113, 6, 137, 2, 7, 164, 8"

   let dbQuery = "SELECT * FROM fn_get_project_site_categories(p_id := $1,p_slug := $2, p_project_id := $3)";
   //console.log(dbQuery)
   let dbQueryValues = [inputArray,'Site_categories',projectId];
   
   sql.query(dbQuery, dbQueryValues, (err, result) => {
     if (err) {
      console.log(err)
         return next(new AppError(400, "Unable to get data."))
     }
     //console.log(result)
     if (result['rows']) {
      //console.log('Generated query:', logQueryWithValues(dbQuery, dbQueryValues));
         res.status(200).json({
             status: "success",
             data: result['rows']
         });
     }
   });
 };














