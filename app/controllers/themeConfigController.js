
const AppError = require("../../errorHandling/AppError.js");
//const Invoice = require("../models/invoice.model.js");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
var bcrypt = require("bcrypt");
const sql = require("../models/db.js");

const { vectorize } = require('@neplex/vectorizer');


exports.submitProject = async (req, res, next) => {
  var datetime = new Date();
  const curr_date = datetime.toISOString().slice(0, 10);
  const curr_date_time = datetime.toISOString();
  const { p_project_name, p_submitted_by, p_goods_required } = req.body.data;
  console.log(req.body.data);
  let dbQuery =
    "SELECT * FROM fn_add_project( p_name := $1,p_submitted_by := $2,p_goods_required := $3,p_added_date := $4,p_added_date_time := $5)";
  let dbQueryValues = [
    p_project_name,
    p_submitted_by,
    p_goods_required,
    curr_date,
    curr_date_time,
  ];
  sql.query(dbQuery, dbQueryValues, (error, result) => {
    if (error) {
      console.log(error);
      return next(new AppError(400, "Unable to insert data."));
    }
    if (result["rows"][0]?.fn_add_project >= 0) {
      res.status(200).json({
        status: "success",
      });
    } else {
      console.log(result["rows"][0]);
      return next(new AppError(400, "Unable to insert data."));
    }
  });
};

exports.uploadFiles = (req, res, next) => {
 
  const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function  (req, file, cb) {
        //cb(null, `${Date.now()}_${file.originalname}`)
        cb(null, `${Date.now()}_${file.originalname}`)
        //const fileName = `${Date.now()}_${file.originalname}`;
        console.log("File original name: ", file.originalname);
    }

  })

  //const  upload = multer({storage})
  console.log(Storage)
  var storage;
  var upload = multer({ storage: Storage }).array('file', 12)
  
  //const fl = upload.single('file')
  upload(req, res , err => {
    //console.log(req.files)
    //console.log(req.files[0].filename)
    if (err) {
        res.send('somthing went wrong');
    }
    console.log(req.files[0])
    const fileData = {
      "files" : req.files[0].filename,
      "project_id" : req.params.id
    };



         


 
  let dbQuery =
    "SELECT * FROM fn_add_project_files( p_ref_project_id := $1,p_s3_file_path := $2,p_file_name := $3,p_file_size := $4)";
  let dbQueryValues = [
    req.params.id,
    req.files[0].filename,
    req.files[0].originalname,
    req.files[0].size
  ];
  sql.query(dbQuery, dbQueryValues, (error, result) => {
    if (error) {
      console.log(error);
      return next(new AppError(400, "Unable to insert data."));
    }
    if (result["rows"][0]?.fn_add_project_files >= 0) {
      res.status(200).json({
        status: "success",
      });
    } else {
      console.log(result["rows"][0]);
      return next(new AppError(400, "Unable to insert data."));
    }
  });
    /*Tutorial.createFile(fileData, (err, data) => {
      if (err) {
        
      } else{
        res.send('file uploaded successfully');
      };
    });*/
    
});
    console.log(storage)

}
// Delete all Invoices from the database.
