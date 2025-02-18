const sql = require("./db.js");

// constructor
const Invoice = function(invoice) {
  this.brand_id = invoice.brand_id;
  
};


Invoice.findByBrandId = (id, result) => {
  let brand_id = id.toString();
  let qry = "SELECT * FROM neo_invoice WHERE infytrix_brand_id=$1";
  sql.query(qry,[id], (err, res) => {
    if (err) {
     
      result(err, null);
      return;
    }
    
    if (res['rows'].length) {
     
      result(null, res['rows']);
      return;
    }

    // not found Invoice with the id
    result({ kind: "not_found" }, null);
  });
};
Invoice.findAllInvoice = (id, result) => {
 // let brand_id = id.toString();
  let qry = "SELECT * FROM neo_invoice WHERE infytrix_brand_id=$1 ORDER BY issue_date DESC LIMIT 5";
  sql.query(qry,[id], (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
 
     result(null, res['rows']);
      return;
    

    // not found Invoice with the id
    result({ kind: "not_found" }, null);
  });
};
Invoice.findAllInvoiceDetails = (req, result) => {
  // let brand_id = id.toString();
 
   let qry = "SELECT * FROM neo_invoice WHERE infytrix_brand_id=$1 ORDER BY issue_date DESC";
   sql.query(qry,[id], (err, res) => {
     if (err) {
       result(err, null);
       return;
     }
  
      result(null, res['rows']);
       return;
     // not found Invoice with the id
     result({ kind: "not_found" }, null);
   });
 };

module.exports = Invoice;