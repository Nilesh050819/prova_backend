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

exports.getProjectType = (req, res, next) => {
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

exports.getSupervisorProjects = (req, res, next) => {
  const { p_user_id, p_status, p_type, p_search } = req.query;
 
   let dbQuery = "SELECT * FROM fn_get_supervisor_projects(p_user_id := $1, p_status := $2,p_type := $3)";
   //console.log(dbQuery)
   let dbQueryValues = [p_user_id, p_status, p_type];
   if (p_search != "") {
      let dbQuery = "SELECT * FROM fn_get_supervisor_projects(p_user_id := $1, p_status := $2,p_type := $3,p_name_search := $4)";
    
      let dbQueryValues = [p_user_id, p_status, p_type, p_search];
   }
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

 exports.getProjectDetails = (req, res, next) => {
  const { p_id } = req.query;
 
   let dbQuery = "SELECT * FROM fn_get_project_details(p_id := $1)";
   //console.log(dbQuery)
   let dbQueryValues = [p_id];
   
   sql.query(dbQuery, dbQueryValues, (err, result) => {
     if (err) {
      //console.log(err)
         return next(new AppError(400, "Unable to get data."))
     }
     //console.log(result)
     if (result['rows']) {
 
         res.status(200).json({
             status: "success",
             data: result['rows'][0]
         });
     }
   });
 };

 exports.getAssignedDataByProjects = (req, res, next) => {
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

   let dbQuery = "SELECT * FROM fn_get_field_values_by_id(p_id := $1,p_slug := $2, p_project_id := $3)";
   //console.log(dbQuery)
   let dbQueryValues = [inputArray,'Type_of_work',projectId];
   
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

 // Function to safely insert parameters into the query for debugging
function logQueryWithValues(query, values) {
  let queryWithValues = query;
  values.forEach((value, index) => {
    // Replace $1, $2, etc. with the actual values
    queryWithValues = queryWithValues.replace(`$${index + 1}`, JSON.stringify(value));
  });
  return queryWithValues;
}

exports.uploadDocumentFiles = (req, res, next) => {
  //var datetime = new Date();
 // const curr_date = datetime.toISOString().slice(0, 10);
  //const curr_date_time = datetime.toISOString();

  let documentType = req.query.documentType;
  //console.log(req);
  let documentId = req.query.documentId;
  let projectId = req.query.projectId;
 // const { documentType, documentId, projectId} = req.body.data;
  console.log(documentId);
  const { S3Client } = require('@aws-sdk/client-s3');
  const multerS3 = require('multer-s3');

   
    const CONST_VALUES = {
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      AWS_REGION: process.env.AWS_REGION,
      S3_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    };

      // Configure AWS S3 Client
    const s3 = new S3Client({
      credentials: {
        accessKeyId: CONST_VALUES.AWS_ACCESS_KEY_ID,
        secretAccessKey: CONST_VALUES.AWS_SECRET_ACCESS_KEY,
      },
      region: CONST_VALUES.AWS_REGION,
    });

      const upload = multer({
        storage: multerS3({
          s3: s3,
          bucket: CONST_VALUES.S3_BUCKET_NAME,
          acl: 'public-read',
          metadata: (req, file, cb) => {
            console.log('File Metadata:', file);
            cb(null, { fieldName: file.fieldname });
          },
          key: (req, file, cb) => {
            cb(null, `uploads/${Date.now()}_${file.originalname.replace(/ /g, "_")}`);
          },
        }),
      }).array("file", 12);
  //const fl = upload.single('file')
      upload(req, res , err => {
        if (err) {
          console.log(err)
            res.send('somthing went wrong');
        }
        //console.log(req.cover_image+'h')
        const fileData = {
          "files" : req.files[0].file
        // "project_id" : req.params.id
        };
//console.log('nilesh',req.files[0])

      let dbQuery =
        "SELECT * FROM fn_add_document_files( p_ref_project_id := $1,p_document_id := $2,p_s3_file_path := $3,p_file_name := $4,p_file_size := $5,p_file_type := $6,  p_document_type := $7, p_created_date := $8)";
      let dbQueryValues = [
        projectId,
        documentId,
        req.files[0].location,
        req.files[0].originalname,
        req.files[0].size,
        req.files[0].mimetype,
        documentType,
        curr_date_time
        
      ];
      sql.query(dbQuery, dbQueryValues, (error, result) => {
        if (error) {
          console.log(error);
          return next(new AppError(400, "Unable to insert data."));
        }
        if (result["rows"][0]?.fn_add_document_files >= 0) {
          return res.status(200).json({
            status: "success",
            filename: req.files[0].location,
            originalname: req.files[0].originalname
          
          });
        } else {
        // console.log(result["rows"][0]);
          return next(new AppError(400, "Unable to insert data."));
        }
      });
      
    });
   // console.log(storage)

}

exports.getProjectDocumentFiles = (req, res, next) => {
 
 
    const { projectId,documentId,documentType,p_from_date,p_to_date, p_search } = req.body;
  //console.log(req)
    let dbQuery = "SELECT * FROM fn_get_project_document_files(p_project_id := $1, p_document_id := $2, p_document_type := $3, p_from_date := $4, p_to_date := $5, p_search := $6)";
    
    let dbQueryValues = [projectId, documentId, documentType, p_from_date, p_to_date, p_search];
  //console.log(dbQueryValues)
    
    sql.query(dbQuery, dbQueryValues, (err, result) => {

      if (err) {
        console.log(err);
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

exports.deleteDocumentFiles = (req, res, next) => {

  let p_id  = req.body.id;

  let dbQuery =
    "SELECT * FROM fn_delete_document_files( p_id := $1)";
  let dbQueryValues = [p_id];
  //console.log(dbQueryValues)
  sql.query(dbQuery, dbQueryValues, (error, result) => {
    if (error) {
      console.log(error);
      return "error";
      //return next(new AppError(400, "Unable to insert data."));
    }
    if (result["rows"][0]?.fn_delete_document_files >= 0) {
      /* res.status(200).json({
          status: "success",
        });*/
        res.status(200).json({
          status: "success",
        });
    } else {
      return "error";
    }
  });
}

exports.projectWorkAssignment = (req, res, next) => {
  //var datetime = new Date();
  // curr_date = datetime.toISOString().slice(0, 10);
  //const curr_date_time = datetime.toISOString();
  //console.log(req.body);
  const {
    projectId,
    typeOfWorkId,
    addedBy,
    } = req.body;

  let dbQuery =
    "SELECT * FROM fn_add_work_assignment( p_project_id := $1, p_type_of_work_id := $2,p_added_by := $3,p_work_start_date := $4, p_is_deleted := $5)";
  let dbQueryValues = [projectId, typeOfWorkId, addedBy, curr_date_time, 0];
  //console.log(curr_date_time)
  sql.query(dbQuery, dbQueryValues, (error, result) => {
    if (error) {
      console.log(error);
      return "error";
      //return next(new AppError(400, "Unable to insert data."));
    }
    if (result["rows"][0]?.fn_add_work_assignment >= 0) {
      /* res.status(200).json({
          status: "success",
        });*/
        res.status(200).json({
          status: "success",
        });
    } else {
      return "error";
    }
  });
}


exports.updateWorkPercentage_old = (req, res, next) => {
  //var datetime = new Date();
  //const curr_date = datetime.toISOString().slice(0, 10);
  //const curr_date_time = datetime.toISOString();
  //console.log(req.body);
  const {
    projectId,
    typeOfWorkId,
    workPercentage,
    } = req.body;

    console.log(workPercentage)
  let dbQuery =
    "SELECT * FROM fn_update_work_percentage( p_project_id := $1, p_type_of_work_id := $2,p_work_percentage := $3)";
  let dbQueryValues = [projectId, typeOfWorkId, workPercentage];
  console.log(curr_date_time)
  sql.query(dbQuery, dbQueryValues, (error, result) => {
    if (error) {
      console.log(error);
      return "error";
      //return next(new AppError(400, "Unable to insert data."));
    }
    if (result["rows"][0]?.fn_update_work_percentage >= 0) {
      /* res.status(200).json({
          status: "success",
        });*/
        


        res.status(200).json({
          status: "success",
        });
    } else {
      return "error";
    }
  });
}
exports.updateWorkPercentage = (req, res, next) => {
  //var datetime = new Date();
  //const curr_date = datetime.toISOString().slice(0, 10);
  //const curr_date_time = datetime.toISOString();
  //console.log(req.body);
  const {
    projectId,
    typeOfWorkId,
    workPercentage,
    } = req.body;

   // console.log(workPercentage)
  let dbQuery =
    "SELECT * FROM fn_update_work_percentage( p_project_id := $1, p_type_of_work_id := $2,p_work_percentage := $3)";
  let dbQueryValues = [projectId, typeOfWorkId, workPercentage];
  console.log(curr_date_time)
  sql.query(dbQuery, dbQueryValues, (error, result) => {
    if (error) {
      console.log(error);
      return "error";
      //return next(new AppError(400, "Unable to insert data."));
    }
    if (result["rows"][0]?.fn_update_work_percentage >= 0) {
      /* res.status(200).json({
          status: "success",
        });*/


        async function main() {

          const projectAssignedCount = await getProjectAssignedCount(projectId);
          const projectAssignedProgressCount = await getProjectAssignedProgressCount(projectId);
    
          console.log('nilesh1',projectAssignedCount);
          if(projectAssignedCount == projectAssignedProgressCount){
              let dbQuery =
                "SELECT * FROM fn_update_project_status( p_project_id := $1,p_status := $2)";
              let dbQueryValues = [projectId,1];
             
              sql.query(dbQuery, dbQueryValues, (error, result) => {
                if (error) {
                 }
                  if (result["rows"][0]?.fn_update_project_status >= 0) {
                    /* res.status(200).json({
                        status: "success",
                      });*/
                  } else {
                  //  return "error";
                  }
              });
            }else{
              let dbQuery =
                  "SELECT * FROM fn_update_project_status( p_project_id := $1,p_status := $2)";
                let dbQueryValues = [projectId,0];
              
                sql.query(dbQuery, dbQueryValues, (error, result) => {
                  if (error) {
                  }
                    if (result["rows"][0]?.fn_update_project_status >= 0) {
                      /* res.status(200).json({
                          status: "success",
                        });*/
                    } else {
                    //  return "error";
                    }
                });
            }
        }
        main();




        res.status(200).json({
          status: "success",
        });
    } else {
      return "error";
    }
  });
}

async function getProjectAssignedCount(projectId) {
      let dbQuery =
      "SELECT * FROM fn_get_projects_assigned_work_count(p_project_id := $1)";

    let dbQueryValues = [projectId];
    //console.log(dbQueryValues)
    try {
      const result = await sql.query(dbQuery, dbQueryValues);
      const output = result["rows"][0]['cnt'];

      if (output) {
        return output; // Return the result
      } else {
        throw new Error("Function did not return a valid result.");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Unable to insert data."); // Or return a specific error value
    }
}

async function getProjectAssignedProgressCount(projectId) {
    let dbQuery =
    "SELECT * FROM fn_get_projects_assigned_work_progress_count(p_project_id := $1)";

  let dbQueryValues = [projectId];
  //console.log(dbQueryValues)
  try {
    const result = await sql.query(dbQuery, dbQueryValues);
    const output = result["rows"][0]['cnt'];

    if (output) {
      return output; // Return the result
    } else {
      throw new Error("Function did not return a valid result.");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Unable to insert data."); // Or return a specific error value
  }
}



