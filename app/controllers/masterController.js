const AppError = require("../../errorHandling/AppError.js");
const Invoice = require("../models/invoice.model.js");
const fs = require('fs');
const path = require('path');
const multer = require('multer');
var bcrypt = require("bcrypt");
const sql = require("../models/db.js");



exports.findAll = (req, res, next) => {
 
  
  const { field_slug } = req.query;

  let dbQuery = "SELECT * FROM fn_get_field_slug(field_slug)";
  //console.log(dbQuery)



  sql.query(dbQuery, dbQueryValues, (err, result) => {

    if (err) {
     // console.log('hi',err);
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


// Find a single Invoice with a id
exports.findOne = (req, res) => {
  Invoice.findById(req.params.id, (err, data) => {
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




// Delete all Invoices from the database.

