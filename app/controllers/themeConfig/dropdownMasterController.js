const AppError = require("../../../errorHandling/AppError");
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
var bcrypt = require("bcrypt");
const sql = require("./../../models/db");

AWS.config.update({ region: "ap-south-1" }); // e.g., 'us-west-2'
// Retrieve all Invoices from the database (with condition).
exports.fetchDropdownMaster = (req, res, next) => {
  //console.log(req.query)
  const { page, limit, search } = req.query;

  let dbQuery =
    "SELECT * FROM fn_get_dropdown_master(p_page := $1, p_limit := $2)";
  //console.log(dbQuery)
  let dbQueryValues = [page, limit];

  if (search != "") {
    dbQuery =
      "SELECT * FROM fn_get_dropdown_master( p_name_search := $1 ,p_page := $2, p_limit := $3)";
    dbQueryValues = [search, page, limit];
  }
  sql.query(dbQuery, dbQueryValues, (err, result) => {
    //console.log('hi',err);
    if (err) {
      // console.log('hi',err);
      return next(new AppError(400, "Unable to get data."));
    }
    //console.log(result)
    if (result["rows"]) {
      res.status(200).json({
        status: "success",
        data: result["rows"],
      });
    }
  });
};
exports.get_field_slug = (req, res, next) => {
  //console.log(req.query)
  const { page, limit, search } = req.query;

  let dbQuery = "SELECT * FROM fn_get_field_slug()";
  //console.log(dbQuery)
  let dbQueryValues = [page, limit];

  if (search != "") {
    dbQuery = "SELECT * FROM fn_get_field_slug()";
    dbQueryValues = [];
  }
  sql.query(dbQuery, dbQueryValues, (err, result) => {
    if (err) {
      //console.log('hi',err);
      return next(new AppError(400, "Unable to get data."));
    }
    //console.log(result)
    if (result["rows"]) {
      res.status(200).json({
        status: "success",
        data: result["rows"],
      });
    }
  });
};

exports.addDropdownMaster = async (req, res, next) => {
  var datetime = new Date();
  const curr_date_time = datetime.toISOString();
  const {
    project_type,
    type_of_work,
    site_categories,
    drawing_categories,
    user_type,
    contractor_category,
    user_access,
    user_access_drawing_type,
    user_access_drawing_custom_type,
    user_access_site_media_type,
    user_access_live_feed_type,
    user_access_payments_type,
    user_access_notifications_type,
    user_access_contact_details_type,
    user_access_material_updates_type,
  } = req.body.data;
  //console.log(user_access.length);
  let result = "";
  const projectTypeIdsArr = [];
  if (project_type != undefined && project_type.length > 0) {
    let arr = [];

    project_type.forEach(function (row) {
      projectTypeIdsArr.push(row.id);
    });
    project_type.forEach(function (row) {
      //console.log(row.id)
      const field_type = row.field_type !== undefined ? row.field_type : "";

      async function main() {
        try {
          const result = await addUpdateDropdownValues(
            row.id,
            row.field_slug,
            row.field_value,
            "0",
            field_type,
            curr_date_time,
            arr,
            project_type,
            projectTypeIdsArr
          );
          //console.log('Result from addUpdateDropdownValues:', result); // Log the resolved value
          //projectTypeIdsArr.push(result);
        } catch (err) {
          console.error("Error in main:", err); // Catch any errors
        }
      }
      main();
    });
    //let projectTypeIdsStr = projectTypeIdsArr.join();
    //  console.log("hi")
    // console.log(projectTypeIdsStr)
  }
  /*main1();
  async function main1() {
    try {
      if(projectTypeIdsArr.length > 0){
          console.log(projectTypeIdsArr);
          await deleteDropdownValues(projectTypeIdsArr,'Project_type');
      }
    } catch (err) {
          console.error('Error in main:', err); // Catch any errors
    }
  }*/

  let typeOfWorkIdsArr = [];
  if (type_of_work != undefined && type_of_work.length > 0) {
    let arr = [];
    type_of_work.forEach(function (row) {
      typeOfWorkIdsArr.push(row.id);
    });
    type_of_work.forEach(function (row) {
      //console.log(row.id)
      const field_type = row.field_type !== undefined ? row.field_type : "";
      async function main() {
        try {
          const result = await addUpdateDropdownValues(
            row.id,
            row.field_slug,
            row.field_value,
            "0",
            field_type,
            curr_date_time,
            arr,
            type_of_work,
            typeOfWorkIdsArr
          );
        } catch (err) {
          console.error("Error in main:", err); // Catch any errors
        }
      }
      main();
    });
  }
  //deleteDropdownValues(typeOfWorkIdsArr,'Type_of_work');

  let siteCategoriesArr = [];
  if (site_categories != undefined && site_categories.length > 0) {
    let arr = [];
    site_categories.forEach(function (row) {
      siteCategoriesArr.push(row.id);
    });
    site_categories.forEach(function (row) {
      //console.log(row.id)
      const field_type = row.field_type !== undefined ? row.field_type : "";
      async function main() {
        try {
          const dvFiles = await getDropdownValuesFiles(row.field_slug, row.id);
          const file_name = dvFiles.length > 0 ? dvFiles[0].file_name : "";
          const file_path = dvFiles.length > 0 ? dvFiles[0].file_path : "";
          //console.log(dvFiles[0].file_name)
          const result = await addUpdateDropdownValues(
            row.id,
            row.field_slug,
            row.field_value,
            "0",
            field_type,
            curr_date_time,
            arr,
            site_categories,
            siteCategoriesArr,
            file_name,
            file_path
          );
        } catch (err) {
          console.error("Error in main:", err); // Catch any errors
        }
      }
      main();
    });
  }
  //deleteDropdownValues(siteCategoriesArr,'Site_categories');

  let drawingCategoriesArr = [];
  if (drawing_categories != undefined && drawing_categories.length > 0) {
    let arr = [];
    drawing_categories.forEach(function (row) {
      drawingCategoriesArr.push(row.id);
    });
    drawing_categories.forEach(function (row) {
      //console.log(row.id)
      const field_type = row.field_type !== undefined ? row.field_type : "";
      async function main() {
        try {
          const dvFiles = await getDropdownValuesFiles(row.field_slug, row.id);
          const file_name = dvFiles.length > 0 ? dvFiles[0].file_name : "";
          const file_path = dvFiles.length > 0 ? dvFiles[0].file_path : "";
          const result = await addUpdateDropdownValues(
            row.id,
            row.field_slug,
            row.field_value,
            "0",
            field_type,
            curr_date_time,
            arr,
            drawing_categories,
            drawingCategoriesArr,
            file_name,
            file_path
          );
        } catch (err) {
          console.error("Error in main:", err); // Catch any errors
        }
      }
      main();
    });
  }

  /** user type */
  let userTypeIdsArr = [];
  if (user_type != undefined && user_type.length > 0) {
    let arr = [];
    user_type.forEach(function (row) {
      userTypeIdsArr.push(row.id);
    });
    user_type.forEach(function (row) {
      //console.log(row.id)
      const field_type = row.field_type !== undefined ? row.field_type : "";
      async function main() {
        try {
          const result = await addUpdateDropdownValues(
            row.id,
            row.field_slug,
            row.field_value,
            "0",
            field_type,
            curr_date_time,
            arr,
            user_type,
            userTypeIdsArr
          );
          if(user_access != undefined){
              const result1 = await addUserAccess(row.field_value, user_access);
          }
        } catch (err) {
          console.error("Error in main:", err); // Catch any errors
        }
      }
      main();
    });
  }

  /** Contractor Category */
  let contractorCategoryIdsArr = [];
  if (contractor_category != undefined && contractor_category.length > 0) {
    let arr = [];
    contractor_category.forEach(function (row) {
      contractorCategoryIdsArr.push(row.id);
    });
    contractor_category.forEach(function (row) {
      //console.log(row.id)
      const field_type = row.field_type !== undefined ? row.field_type : "";
      async function main() {
        try {
          const result = await addUpdateDropdownValues(
            row.id,
            row.field_slug,
            row.field_value,
            "0",
            field_type,
            curr_date_time,
            arr,
            contractor_category,
            contractorCategoryIdsArr
          );
        } catch (err) {
          console.error("Error in main:", err); // Catch any errors
        }
      }
      main();
    });
  }


  /** access manage drawing type */
  if (user_access_drawing_type != undefined ) {
      //console.log(row.id)
    async function main() {
        try {
          let remarks ='';
          if(user_access_drawing_custom_type != undefined && user_access_drawing_custom_type.length > 0 && user_access_drawing_type == 'custom')
          {
            remarks = user_access_drawing_custom_type;
          }
          const result1 = await saveUserAccessManageData('user_access_drawing_type', user_access_drawing_type,remarks,curr_date_time);
        } catch (err) {
          console.error("Error in main:", err); // Catch any errors
        }
      }
      main();
    }
    /** access manage site media */
  if (user_access_site_media_type != undefined ) {
    //console.log(row.id)
    async function main() {
        try {
          let remarks ='';
         const result1 = await saveUserAccessManageData('user_access_site_media_type', user_access_site_media_type,remarks,curr_date_time);
        } catch (err) {
          console.error("Error in main:", err); // Catch any errors
        }
      }
      main();
  }

   /** access manage live feed */
   if (user_access_live_feed_type != undefined ) {
      //console.log(row.id)
      async function main() {
          try {
            let remarks ='';
           const result1 = await saveUserAccessManageData('user_access_live_feed_type', user_access_live_feed_type,remarks,curr_date_time);
          } catch (err) {
            console.error("Error in main:", err); // Catch any errors
          }
        }
        main();
    }

    /** access payment type feed */
   if (user_access_payments_type != undefined ) {
    //console.log(row.id)
      async function main() {
          try {
            let remarks ='';
          const result1 = await saveUserAccessManageData('user_access_payments_type', user_access_payments_type,remarks,curr_date_time);
          } catch (err) {
            console.error("Error in main:", err); // Catch any errors
          }
        }
        main();
    }

     /** access notification type */
   if (user_access_notifications_type != undefined ) {
    //console.log(row.id)
      async function main() {
          try {
            let remarks ='';
          const result1 = await saveUserAccessManageData('user_access_notifications_type', user_access_notifications_type,remarks,curr_date_time);
          } catch (err) {
            console.error("Error in main:", err); // Catch any errors
          }
        }
        main();
    }

    /** access contact details type */
   if (user_access_contact_details_type != undefined ) {
    //console.log(row.id)
      async function main() {
          try {
            let remarks ='';
          const result1 = await saveUserAccessManageData('user_access_contact_details_type', user_access_contact_details_type,remarks,curr_date_time);
          } catch (err) {
            console.error("Error in main:", err); // Catch any errors
          }
        }
        main();
    }

     /** access material updates type */
   if (user_access_material_updates_type != undefined ) {
    //console.log(row.id)
      async function main() {
          try {
            let remarks ='';
          const result1 = await saveUserAccessManageData('user_access_material_updates_type', user_access_material_updates_type,remarks,curr_date_time);
          } catch (err) {
            console.error("Error in main:", err); // Catch any errors
          }
        }
        main();
    }





  //deleteDropdownValues(drawingCategoriesArr,'Drawing_categories');

  if (result === "error") {
    return next(new AppError(400, "Unable to insert data."));
  } else {
    res.status(200).json({
      status: "success",
    });
  }
};

// Find a single Invoice with a id
exports.findOne = (req, res) => {
  Invoice.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Company with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Company with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};
exports.getDropdownValues = (req, res, next) => {
  //console.log(req.query)
  const { p_field_slug } = req.query;

  let dbQuery = "SELECT * FROM fn_get_dropdown_values(p_field_slug := $1)";
  //console.log(dbQuery)
  let dbQueryValues = [p_field_slug];

  sql.query(dbQuery, dbQueryValues, (err, result) => {
    if (err) {
      console.log(err);

      return next(new AppError(400, "Unable to get data."));
    }
    //console.log(result)
    if (result["rows"]) {
      res.status(200).json({
        status: "success",
        data: result["rows"],
      });
    }
  });
};

exports.getUserList = (req, res, next) => {
  //console.log(req.query)
  const { p_user_type } = req.query;

  let dbQuery = "SELECT * FROM fn_get_supplier_list(p_user_type := $1)";
  //console.log(dbQuery)
  let dbQueryValues = [p_user_type];

  sql.query(dbQuery, dbQueryValues, (err, result) => {
    if (err) {
      //console.log('hi',err);
      return next(new AppError(400, "Unable to get data."));
    }
    //console.log(result)
    if (result["rows"]) {
      res.status(200).json({
        status: "success",
        data: result["rows"],
      });
    }
  });
};

async function addUpdateDropdownValues(
  field_id,
  field_slug,
  field_value,
  order_by,
  field_type,
  curr_date_time,
  arr,
  projectMasterArr,
  projectTypeIdsArr,
  file_name,
  file_path
) {
  let dbQuery =
    "SELECT * FROM fn_add_dropdown_master( p_id := $1, p_field_slug := $2,p_field_value := $3,p_order_by := $4,p_field_type := $5, p_created_date := $6, p_ids := $7, p_file_name := $8, p_file_path := $9 )";
  let dbQueryValues = [
    field_id,
    field_slug,
    field_value,
    order_by,
    field_type,
    curr_date_time,
    projectTypeIdsArr,
    file_name,
    file_path,
  ];
  try {
    const result = await sql.query(dbQuery, dbQueryValues);

    const output = result["rows"][0]?.fn_add_dropdown_master;

    if (output >= 0) {
      arr.push(1); // Track execution
      //console.log(output)
      return output; // Return the result
    } else {
      throw new Error("Function did not return a valid result.");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Unable to insert data."); // Or return a specific error value
  }
}

async function deleteDropdownValues(idsArr, field_slug) {
  let dbQuery =
    "SELECT * FROM fn_delete_dropdown_values( p_ids := $1, p_field_slug := $2)";
  let dbQueryValues = [idsArr, field_slug];
  //console.log(dbQueryValues)
  sql.query(dbQuery, dbQueryValues, (error, result) => {
    if (error) {
      console.log(error);
      return "error";
      //return next(new AppError(400, "Unable to insert data."));
    }
    if (result["rows"][0]?.fn_delete_dropdown_values >= 0) {
      /* res.status(200).json({
          status: "success",
        });*/
      return "success";
    } else {
      return "error";
    }
  });
}


/** Upload dropdown values files */
exports.uploadFiles = (req, res, next) => {

  let fileType = req.query.fileType;
  let idx = req.query.idx;
  /*const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/images");
    },
    filename: function (req, file, cb) {
      //cb(null, `${Date.now()}_${file.originalname}`)
      cb(null, `${Date.now()}_${file.originalname}`);
      //const fileName = `${Date.now()}_${file.originalname}`;
    },
  });*/

  const { S3Client } = require('@aws-sdk/client-s3');
  const multerS3 = require('multer-s3');

    // Create S3 instance

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
  //var storage;
  //var upload = multer({ storage: Storage }).array("file", 12);

  //const fl = upload.single('file')
  upload(req, res, (err) => {
    if (err) {
      res.send("somthing went wrong");
    }
   /* const fileData = {
      files: req.files[0].file,
      // "project_id" : req.params.id
    };*/

    

    // Configure Multer S3

console.log("hi2",req.files[0])

    let dbQuery =
      "SELECT * FROM fn_add_temp_files( p_idx := $1,p_file_path := $2,p_file_name := $3,p_field_slug := $4)";
    let dbQueryValues = [
      idx,
      req.files[0].location,
      req.files[0].originalname,
      fileType,
    ];
    sql.query(dbQuery, dbQueryValues, (error, result) => {
      if (error) {
        console.log(error);
        return next(new AppError(400, "Unable to insert data."));
      }
      if (result["rows"][0]?.fn_add_temp_files >= 0) {
        return res.status(200).json({
          status: "success",
          filename: req.files[0].location,
          originalname: req.files[0].originalname,
        });
      } else {
        // console.log(result["rows"][0]);
        return next(new AppError(400, "Unable to insert data."));
      }
    });
  });
  // console.log(storage)
};

exports.getUploadFiles = (req, res, next) => {
  const { field_slug, idx } = req.body;
  //console.log(req)
  let dbQuery =
    "SELECT * FROM fn_get_temp_files(p_field_slug := $1, p_idx := $2)";

  let dbQueryValues = [field_slug, idx];
  //console.log(dbQueryValues)

  sql.query(dbQuery, dbQueryValues, (err, result) => {
    if (err) {
      console.log(err);
      return next(new AppError(400, "Unable to get data."));
    }
    //console.log(result)
    if (result["rows"]) {
      res.status(200).json({
        status: "success",
        data: result["rows"],
      });
    }
  });
};

async function getDropdownValuesFiles(field_slug, idx) {
  let dbQuery =
    "SELECT * FROM fn_get_temp_files(p_field_slug := $1, p_idx := $2)";

  let dbQueryValues = [field_slug, idx];
  //console.log(dbQueryValues)
  try {
    const result = await sql.query(dbQuery, dbQueryValues);

    const output = result["rows"];

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

async function addUserAccess(user_type, user_access) {
  //console.log(user_access[user_type]);
  if (user_access[user_type] != undefined) {
    // const access_name_json = JSON.stringify(user_access[user_type]);
  }
  if (user_access[user_type] == undefined) {
    const access_name_json = "";
  }
 // const access_name_json = JSON.stringify(user_access[user_type]);
  const access_name_json = user_access[user_type];
//console.log(access_name_json);

    let userAccessArr = [];
    Object.entries(access_name_json).forEach(([key, value]) => {
      //console.log(`Key: ${key}, Value: ${value}`);
      if(value == 'true'){
        userAccessArr.push(`${key}`);
      }
  });

console.log(userAccessArr)

  let dbQuery =
    "SELECT * FROM fn_add_user_access( p_role_name := $1, p_access_name := $2)";
  let dbQueryValues = [user_type, userAccessArr];
  try {
    const result = await sql.query(dbQuery, dbQueryValues);

    const output = result["rows"][0]?.fn_add_user_access;

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

/*const uploadFile = async (bucketName, filePath, key) => {
  try {
    // Read content from the file
    const fileContent = fs.readFileSync(filePath);

    // Set up S3 upload parameters
    const params = {
      Bucket: bucketName, // S3 bucket name
      Key: key, // File name in S3
      Body: fileContent, // File content
    };

    // Upload file to S3
    const data = await s3.upload(params).promise();
    console.log(`File uploaded successfully. Location: ${data.Location}`);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}; */
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

async function saveUserAccessManageData(p_config_key,p_config_value,p_remarks,curr_date_time) {
 
  let dbQueryValues_users = [
    p_config_key,
    p_config_value,
    p_remarks,
    curr_date_time,
  ];


    let dbQuery =
      "SELECT * FROM fn_add_config_settings(p_config_key := $1,p_config_value := $2,p_remarks := $3,p_created_date := $4)";
    
    try {
      const result = await sql.query(dbQuery, dbQueryValues_users);

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

exports.getUserAccessType = (req, res, next) => {
    //console.log(req.query)
    const { p_config_key } = req.query;
    let dbQuery = "SELECT * FROM fn_get_config_settings(p_config_key := $1)";
    //console.log(dbQuery)
    let dbQueryValues = [p_config_key];
    sql.query(dbQuery, dbQueryValues, (err, result) => {
      if (err) {
        console.log(err);
        return next(new AppError(400, "Unable to get data."));
      }
    if (result["rows"]) {
        res.status(200).json({
          status: "success",
          data: cleanData(result["rows"]),
        });
      }
    });
};