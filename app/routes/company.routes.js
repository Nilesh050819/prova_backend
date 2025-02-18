module.exports = app => {
    const company = require("../controllers/company.controller.js");
    const checkAuth = require("../middleware/check-auth.js");
    

  
    var router = require("express").Router();
  
    router.post("/", company.create);
    router.put("/:id",checkAuth, company.update);
        // Retrieve a single Company with id
        router.get("/:id", company.findOne);
  
  
    app.use('/api/company', router);
  };