module.exports = app => {
    const billing_info = require("../controllers/billing_info.controller.js");
    const checkAuth = require("../middleware/check-auth.js");
    

  
    var router = require("express").Router();
  
    
        // Retrieve a single Company with id
        router.get("/:id",checkAuth, billing_info.findOne);

        router.get("/bankInfo/:id",checkAuth, billing_info.bankInfo);
       // router.get("/billing_details:id", billing_info.findOne);
  
  
    app.use('/api/billing_info', router);
  };