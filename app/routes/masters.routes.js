module.exports = app => {
    const masterController = require("../controllers/masterController.js");
    const checkAuth = require("../middleware/check-auth.js");
    var router = require("express").Router();
  
        router.get("/getDropdownValues", masterController.findAll);
      
  
    app.use('/api/masters', router);
  };