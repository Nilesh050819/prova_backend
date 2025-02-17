const Company = require("../models/company.model.js");
const fs = require('fs');
const path = require('path');
const multer = require('multer');
var bcrypt = require("bcrypt");

async function myF($pw) {
  let names;
  let passwordHash = await bcrypt.hash($pw.toString(), 10);
  console.log(passwordHash);
  //return passwordHash;
}
// Create and Save a new Tutorial
exports.create = (req, res) => {
  //console.log(req.body)
     // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
 let pw = '12345';
 const saltRounds = 10;
  //let passwordHash1 = myF(randomPwd);
  // Create a Tutorial
  bcrypt.hash(pw, saltRounds, (err, hash) => {
  const company = new Company({
    company_name: req.body.company_name,
    brand_name: req.body.brand_name,
    user_name: req.body.user_name,
    user_email: req.body.user_email,
    user_encrypt_password: hash,
   company_pan_num: req.body.company_pan_num,
   company_gst_num: req.body.company_gst_num,
   company_bank_name: req.body.company_bank_name,
   company_bank_account_num: req.body.company_bank_account_num,
   company_bank_ifsc_code: req.body.company_bank_ifsc_code,
   company_website: req.body.company_website,
  });

//console.log(company)
  // Save Tutorial in the database

  Company.checkEmail(req.body.user_email, (err, data) => {
    console.log('nilesh',data)
    if(data == 0){
      Company.create(company, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the company."
          });
        else{
          console.log(data)
          //const insertId = data.id;
          
          res.send(data);
        } 
      });
    }else{
      res.status(400).send({
        message: "Email already registered."
      });
    }
})


});
  
};

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {
    const title = req.query.title;

    Tutorial.getAll(title, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      else res.send(data);
    });    
};

// Find a single Tutorial with a id
exports.findOne = (req, res) => {
    Company.findById(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Company with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Company with id " + req.params.id
            });
          }
        } else res.send(data);
      });
};


// Update a Tutorial identified by the id in the request
exports.update = (req, res) => {
     // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  //console.log(req.body);
  const companyData = new Company({
    company_name: req.body.company_name,
    brand_name: req.body.brand_name,
    company_address: req.body.company_address,
   company_pan_num: req.body.company_pan_num,
   company_gst_num: req.body.company_gst_num,
   company_bank_name: req.body.company_bank_name,
   company_bank_account_num: req.body.company_bank_account_num,
   company_bank_ifsc_code: req.body.company_bank_ifsc_code,
   
  });
//console.log(companyData)

  Company.updateBillingInfo(
    req.params.id,
    companyData,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Company with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Company with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};



// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    Tutorial.remove(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Tutorial with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Tutorial with id " + req.params.id
            });
          }
        } else res.send({ message: `Tutorial was deleted successfully!` });
      });
};

// Delete all Tutorials from the database.


exports.uploadLogo = (req, res) => {
 
  const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function  (req, file, cb) {
        //cb(null, `${Date.now()}_${file.originalname}`)
        cb(null, `${Date.now()}_${file.originalname}`)
        //const fileName = `${Date.now()}_${file.originalname}`;
       // console.log("File original name: ", file.originalname);
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
    const fileData = {
      "files" : req.files[0].filename,
      "tutorial_id" : req.params.id
    };
    Tutorial.createFile(fileData, (err, data) => {
      if (err) {
        
      } else{
        res.send('file uploaded successfully');
      };
    });
    
});
    //console.log(storage)

}