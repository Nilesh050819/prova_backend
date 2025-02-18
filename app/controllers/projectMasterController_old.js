
const AppError = require("../../errorHandling/AppError.js");
//const Invoice = require("../models/invoice.model.js");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
var bcrypt = require("bcrypt");
const sql = require("../models/db.js");


const { vectorize } = require('@neplex/vectorizer');


exports.submitProjectMaster = async (req, res, next) => {
  var datetime = new Date();
  const curr_date = datetime.toISOString().slice(0, 10);
  const curr_date_time = datetime.toISOString();
  const loginId = 0;
  let token = req.query.tokenId;



  const { project_name, project_type, project_insights, professional_fees, type_of_work,site_categories, drawing_categories, camera_id, live_feed_password, supervisor, access_management, contractor_type, contractor_name, contractor_remarks, client_name, client_mobile_no, client_email_id, client_address, client_sec_mobile_no, client_sec_email_id, client_remarks, username, client_password } = req.body.data;
  //console.log(req.body.data.project_name);


  let dbQuery1 = "SELECT * FROM fn_check_client_email(p_email := $1)";
  //console.log(client_email_id)
  let dbQueryValues1 = [client_email_id];

  
  sql.query(dbQuery1, dbQueryValues1, (err, result) => {

    if (err) {
      ///console.log(err);
        return next(new AppError(400, "Unable to get data."))
    }
    //console.log(result)
    if (result['rows']) {
       
      let client_id = '0';
      let dbQueryValues = [
        project_name,
        project_type,
        project_insights,
        professional_fees,
        type_of_work,
        site_categories,
        drawing_categories,
        camera_id,
        live_feed_password,
        supervisor,
        access_management,
        loginId,
        curr_date,
        curr_date_time,
        token

      ];
      if(result['rows'].length > 0 && result["rows"][0]['id'] > 0)
      {
        //console.log(result["rows"][0]['id']);
        client_id = result["rows"][0]['id'];
        dbQueryValues.push(client_id);
        submitProject(sql,dbQueryValues,res,next,req.body.data);
      }else{
            // let salt = bcrypt.genSalt();
                    let pw = client_password;
                    const saltRounds = 10;
                  // let passwordHash = await bcrypt.hash(req.body.password.toString(), 10);
                   // let passwordHash1 = myF(req.body.password) 
                  bcrypt.hash(pw, saltRounds, (err, hash) => {
                    let encrypt_password = hash;

                    var arr = client_name.split(" ");
                    let dbQuery =
                    "SELECT * FROM fn_add_users( p_email := $1,p_first_name := $2,p_last_name := $3,p_username := $4, p_password := $5, p_encode_password := $6, p_type := $7, p_address := $8, p_mobile_no := $9, p_sec_email_id := $10, p_sec_mobile_no := $11, p_remarks := $12 ,  p_added_date := $13)";
                  let dbQueryValues_users = [
                    client_email_id,
                    arr[0],
                    arr[1],
                    username,
                    encrypt_password,
                    pw,
                    'Client',
                    client_address,
                    client_mobile_no,
                    client_sec_email_id,
                    client_sec_mobile_no,
                    client_remarks,
                    curr_date_time
                  ];
                  //console.log(dbQueryValues);
                  sql.query(dbQuery, dbQueryValues_users, (error, result) => {
                    if (error) {
                      console.log(error);
                      return next(new AppError(400, "Unable to insert data."));
                    }
                   
                    if (result["rows"]['0']['fn_add_users'] > 0) {
                     /// setTimeout(() => { 
                       client_id = result["rows"]['0']['fn_add_users'];

                       dbQueryValues.push(client_id);
                      submitProject(sql,dbQueryValues,res,next,req.body.data);
                       //console.log(client_id);
                     // }, 2000);
                    } else {
                      //console.log(result["rows"][0]);
                      return next(new AppError(400, "Unable to insert data."));
                    }
                  });


              
            });
       
           

      }
      
   //   setTimeout(() => { 
       // console.log(client_id)
     

   //  }, 2000);

      }
  });



  
};

exports.uploadFiles = (req, res, next) => {
  let fileType = req.query.fileType;
  let token = req.query.token;
  const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function  (req, file, cb) {
        //cb(null, `${Date.now()}_${file.originalname}`)
        cb(null, `${Date.now()}_${file.originalname}`)
        //const fileName = `${Date.now()}_${file.originalname}`;
      //  console.log("File original name: ", file.originalname);
    }

  })

  //const  upload = multer({storage})
  //console.log(Storage)
  var storage;
  var upload = multer({ storage: Storage }).array('file', 12)
  
  //const fl = upload.single('file')
  upload(req, res , err => {
    //console.log(req.files)
    //console.log(req.files[0].filename)
    if (err) {
        res.send('somthing went wrong');
    }
    //console.log(req.cover_image+'h')
    const fileData = {
      "files" : req.files[0].file
     // "project_id" : req.params.id
    };


  let dbQuery =
    "SELECT * FROM fn_add_project_files( p_ref_project_id := $1,p_s3_file_path := $2,p_file_name := $3,p_file_size := $4, p_file_type := $5, p_token := $6)";
  let dbQueryValues = [
    0,
    req.files[0].filename,
    req.files[0].originalname,
    req.files[0].size,
    fileType,
    token
  ];
  sql.query(dbQuery, dbQueryValues, (error, result) => {
    if (error) {
      //console.log(error);
      return next(new AppError(400, "Unable to insert data."));
    }
    if (result["rows"][0]?.fn_add_project_files >= 0) {
      return res.status(200).json({
        status: "success",
        filename: req.files[0].filename,
        originalname: req.files[0].originalname
       
      });
    } else {
     // console.log(result["rows"][0]);
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
   // console.log(storage)

}

async function myF($pw) {
  let names;
  let passwordHash = await bcrypt.hash($pw.toString(), 10);
  //console.log(passwordHash);
  //return passwordHash;
}
// Delete all Invoices from the database.

