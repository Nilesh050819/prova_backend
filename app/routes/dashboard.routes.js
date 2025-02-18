module.exports = app => {
    const dashboard = require("../controllers/dashboard.js");
    const checkAuth = require("../middleware/check-auth.js");
    

  
    var router = require("express").Router();
  
    
        // Retrieve a single Company with id
       //router.get("/getAllProjects",checkAuth, dashboard.findAll);
       router.get("/getAllProjects",checkAuth,  dashboard.findAll);
       // router.get("/billing_details:id", billing_info.findOne);
  
  
    app.use('/api/dashboard', router);
  };