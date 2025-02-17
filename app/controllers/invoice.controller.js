const AppError = require("../../errorHandling/AppError");
const Invoice = require("../models/invoice.model.js");
const fs = require('fs');
const path = require('path');
const multer = require('multer');
var bcrypt = require("bcrypt");
const sql = require("./../models/db");


// Retrieve all Invoices from the database (with condition).
exports.findAll = (req, res) => {
    const title = req.query.title;

    Invoice.getAll(title, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Invoices."
        });
      else res.send(data);
    });    
};
exports.getAllInvoice = (req, res) => {
 
  /*Invoice.findAllInvoice(req.params.id, (err, data) => {
   
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Invoices."
      });
    else res.send(data);
  });    */
  const { page, limit, search, p_infytrix_brand_id } = req.query;

  let dbQuery = "SELECT * FROM fn_get_invoice( p_infytrix_brand_id := $1, p_page := $2, p_limit := $3)";
  let dbQueryValues = [p_infytrix_brand_id, page, 5];

  if (search != "") {
      dbQuery = "SELECT * FROM fn_get_invoice( p_infytrix_brand_id := $1,p_invoice_search := $2 ,p_page := $3, p_limit := $4)";
     dbQueryValues = [p_infytrix_brand_id, search, page, 5];
  } 
  sql.query(dbQuery, dbQueryValues, (err, result) => {

    if (err) {
      console.log('hi',err);
        return next(new AppError(400, "Unable to get data."))
    }
    if (result['rows']) {
        res.status(200).json({
            status: "success",
            data: result['rows']
        });
    }
  });
};
/** invoice details */
/*exports.invoiceDetails = (req, res, next) => {

  
 
  Invoice.findAllInvoiceDetails(req, (err, data) => {
   
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Invoices."
      });
    else res.send(data);
  });    
};*/

exports.invoiceDetails = async (req, res, next) => {

  const { page, limit, search, p_infytrix_brand_id, favoriteOnly } = req.query;

  let dbQuery = "SELECT * FROM fn_get_invoice( p_infytrix_brand_id := $1, p_page := $2, p_limit := $3)";
  let dbQueryValues = [p_infytrix_brand_id, page, limit];

  if (search != "") {
      dbQuery = "SELECT * FROM fn_get_invoice( p_infytrix_brand_id := $1,p_invoice_search  := $2 ,p_page := $3, p_limit := $4)";
     dbQueryValues = [p_infytrix_brand_id, search, page, limit];
  } 
  sql.query(dbQuery, dbQueryValues, (err, result) => {

    if (err) {
      console.log('hi',err);
        return next(new AppError(400, "Unable to get data."))
    }
    if (result['rows']) {
        res.status(200).json({
            status: "success",
            data: result['rows']
        });
    }
  });
 /* Invoice.findAllInvoiceDetails(req, (err, data) => {
   
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Invoices."
      });
    else res.send(data);
  });   */ 
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



// Delete a Invoice with the specified id in the request
exports.delete = (req, res) => {
  Invoice.remove(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Invoice with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Invoice with id " + req.params.id
            });
          }
        } else res.send({ message: `Invoice was deleted successfully!` });
      });
};

// Delete all Invoices from the database.

