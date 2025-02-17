const AppError = require("../../errorHandling/AppError");
const Invoice = require("../models/invoice.model.js");
const fs = require('fs');
const path = require('path');
const multer = require('multer');
var bcrypt = require("bcrypt");
const sql = require("./../models/db");


// Retrieve all Invoices from the database (with condition).
exports.findAll1 = (req, res) => {
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
exports.findAll = (req, res, next) => {
 
  /*Invoice.findAllInvoice(req.params.id, (err, data) => {
   
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Invoices."
      });
    else res.send(data);
  });    */
  //console.log(req.query)
  const { page, limit, search } = req.query;
//console.log(page)
  let dbQuery = "SELECT * FROM fn_get_projects(p_page := $1, p_limit := $2)";
  console.log(dbQuery)
  let dbQueryValues = [page, limit];

  

  if (search != "") {
      dbQuery = "SELECT * FROM fn_get_projects( p_name_search := $1 ,p_page := $2, p_limit := $3)";
     dbQueryValues = [search, page, limit];
  } 
  sql.query(dbQuery, dbQueryValues, (err, result) => {

    if (err) {
      console.log(err);
        return next(new AppError(400, "Unable to get data."))
    }
    //console.log(result)
    if (result['rows']) {

          async function main() {
            try {
              const projectCount = await getProjectCount(search);
              console.log(projectCount);
              res.status(200).json({
                status: "success",
                data: result['rows'],
                totalCount: projectCount
            });

                } catch (err) {
              console.error('Error in main:', err); // Catch any errors
            }
          }
          main();

       
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


async function getProjectCount(p_name_search)
{
    let dbQuery = "SELECT * FROM fn_get_projects_count(p_name_search := $1)";
      
    let dbQueryValues = [p_name_search];
    //console.log(dbQueryValues)
    try {
      const result = await sql.query(dbQuery, dbQueryValues);
      
      const output = result["rows"][0]['cnt'];

      if (output) {
      return output; // Return the result
      } else {
        throw new Error('Function did not return a valid result.');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Unable to select data.'); // Or return a specific error value
    }
  
}

// Delete all Invoices from the database.

