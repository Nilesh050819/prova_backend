const sql = require("./db.js");
const uuid = require("uuid");

// constructor
const Company = function(company) {
  this.company_name = company.company_name;
  this.brand_name = company.brand_name;
  this.user_name = company.user_name;
  this.user_email = company.user_email;
  this.user_encrypt_password = company.user_encrypt_password;
  this.company_address = company.company_address;
  this.company_pan_num = company.company_pan_num;
  this.company_gst_num = company.company_gst_num;
  this.company_bank_name = company.company_bank_name;
  this.company_bank_account_num = company.company_bank_account_num;
  this.company_bank_ifsc_code = company.company_bank_ifsc_code;
};

Company.create = (newCompany, result) => {
  //console.log(newCompany)
  //sql.query("INSERT INTO neo_brand_master SET company_name=$1", [newCompany], (err, res) => {
    //let query = "INSERT INTO neo_brand_master (company_name) values(newCompany.company_name)";
    let qry = 'INSERT into neo_brand_master (company_name,brand_name) VALUES($1,$2) RETURNING infytrix_brand_id ';
    //console.log(sql);
  sql.query(qry, [newCompany.company_name,newCompany.brand_name], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    //console.log('nilesh',res['rows'][0]['infytrix_brand_id']);
    let lastInsertId = res['rows'][0]['infytrix_brand_id'];
   
    let qry2 = 'INSERT into neo_users (infytrix_brand_id, user_name, encrypt_user_mail, hashed_user_password) VALUES($1,$2,$3,$4) ';
    sql.query(qry2, [lastInsertId,newCompany.user_name,newCompany.user_email,newCompany.user_encrypt_password], (err1, res1) => {

    })
   //console.log("created company: ", { res.rows[0].id });
   //console.log("created company: ", { id: res.rows[0].infytrix_brand_id, ...newCompany });
    result(null, { id: res.insertId, ...newCompany });
  });
};
Company.createLogo = (newTutorialFile, result) => {

  //console.log(newTutorialFile)
  
  sql.query("INSERT INTO tutorials_files (`tutorial_id`,`files`) VALUES (?,?)", [newTutorialFile.tutorial_id,newTutorialFile.files], (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    //console.log(" tutorial uploaded: ", { id: res.insertId, ...newTutorial });
    result(null, {  ...newTutorialFile });
  });
};

Company.findById = (id, result) => {
  let brand_id = id.toString();
  let qry = "SELECT * FROM neo_brand_master WHERE infytrix_brand_id=$1";
  sql.query(qry,[id], (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }
    //console.log(res);
    if (res['rows'].length) {
      //console.log("found company: ", res['rows'][0]);
      result(null, res['rows'][0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};
Company.checkEmail = (email, result) => {
  //console.log( "SELECT * FROM neo_users where encrypt_user_mail="+email);
  sql.query("SELECT * FROM neo_users where encrypt_user_mail=$1",[email], (err, res) => {
 // sql.query("SELECT * FROM neo_users ",[], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
console.log('result',res['rowCount']);
   
      result(null, res['rowCount']);
      return;
    
  });
};





Company.updateById = (id, company, result) => {
console.log(id)
let id1 = id.toString();

  let qry = "UPDATE neo_brand_master SET company_name = $1, company_address = $2, company_pan_num = $3, company_gst_num = $4, company_bank_name = $5, company_bank_account_num = $6, company_bank_ifsc_code = $7 WHERE infytrix_brand_id = $8 ";
  sql.query(
    qry,
    [company.company_name,company.company_address,company.company_pan_num,company.company_gst_num,company.company_bank_name,company.company_bank_account_num,company.company_bank_ifsc_code,id1],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found company with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated company: ", { id: id, ...company });
      result(null, { id: id, ...company });
    }
  );
};

Company.updateBillingInfo = (id, company, result) => {
  console.log(id)
  let id1 = id.toString();
  
    let qry = "UPDATE neo_brand_master SET company_name = $1, company_address = $2, company_pan_num = $3, company_gst_num = $4 WHERE infytrix_brand_id = $5";
    sql.query(
      qry,
      [company.company_name,company.company_address,company.company_pan_num,company.company_gst_num,id1],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found company with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated company: ", { id: id, ...company });
        result(null, { id: id, ...company });
      }
    );
  };

Company.remove = (id, result) => {
  sql.query("DELETE FROM tutorials WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Tutorial with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted tutorial with id: ", id);
    result(null, res);
  });
};

Company.removeAll = result => {
  sql.query("DELETE FROM tutorials", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} tutorials`);
    result(null, res);
  });
};

module.exports = Company;