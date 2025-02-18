
const fs = require('fs');
const path = require('path');
const multer = require('multer');
var bcrypt = require("bcrypt");
const pdf = require('html-pdf');

const pdfTemplate = require('./../../documents');


// Find a single billing info with a id
exports.create_pdf = async (req, res, next) => {
  console.log(req.body)
    pdf.create(pdfTemplate(req.body), {}).toFile('result.pdf', (err) => {
      if(err) {
          res.send(Promise.reject());
      }

      res.send(Promise.resolve());
  });
}

exports.fetch_pdf = async (req, res, next) => {
  let root = path.resolve("./");
  console.log(root)
  res.sendFile(`${root}/result.pdf`)
}
function getRootDir(filePath) {
  let index = filePath.lastIndexOf("/src");
  if (index === -1) {
    return filePath;
  }
  return filePath.substring(0, index);
}