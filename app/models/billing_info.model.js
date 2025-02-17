const sql = require("./db.js");
const uuid = require("uuid");

// constructor
const Billing_info = function(billing_info) {
 
};



Billing_info.findById = (id, result) => {
  let brand_id = id.toString();
  let qry = "SELECT * FROM neo_brand_master WHERE infytrix_brand_id=$1";
  sql.query(qry,[id], (err, res) => {
    if (err) {
      
      result(err, null);
      return;
    }
      result(null, res['rows'][0]);
      return;
    //}

    // not found billing with the id
    result({ kind: "not_found" }, null);
  });
};

Billing_info.getBankInfo = (id, result) => {
  let brand_id = '00000000-0000-0000-0000-000000000000';
  let qry = "SELECT * FROM neo_brand_master WHERE infytrix_brand_id=$1";
  sql.query(qry,[brand_id], (err, res) => {
    if (err) {
      
      result(err, null);
      return;
    }
      result(null, res['rows'][0]);
      return;
    //}

    // not found billing with the id
    result({ kind: "not_found" }, null);
  });
};


module.exports = Billing_info;