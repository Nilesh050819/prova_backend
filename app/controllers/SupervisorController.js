const AppError = require("../../errorHandling/AppError");

const fs = require('fs');
const path = require('path');
const multer = require('multer');
var bcrypt = require("bcrypt");
const sql = require("../models/db");




exports.getProjectType = (req, res, next) => {
 
  
  //console.log(req.query)
  const { p_status } = req.query;

  let dbQuery = "SELECT * FROM fn_get_project_type(p_status := $1)";
  //console.log(dbQuery)
  let dbQueryValues = [p_status];

 
  sql.query(dbQuery, dbQueryValues, (err, result) => {

    if (err) {
      console.log('hi',err);
        return next(new AppError(400, "Unable to get data."))
    }
    //console.log(result)
    if (result['rows']) {

        res.status(200).json({
            status: "success",
            data: result['rows']
        });
    }
  });
};



