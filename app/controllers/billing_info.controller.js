const Billing_info = require("../models/billing_info.model.js");
const fs = require('fs');
const path = require('path');
const multer = require('multer');
var bcrypt = require("bcrypt");


// Find a single billing info with a id
exports.findOne = (req, res) => {
  Billing_info.findById(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found billing with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving billing with id " + req.params.id
            });
          }
        } else res.send(data);
      });
};

exports.bankInfo = (req, res) => {
  Billing_info.getBankInfo(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found billing with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving billing with id " + req.params.id
            });
          }
        } else res.send(data);
      });
};
