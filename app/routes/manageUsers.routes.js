module.exports = app => {
    const manageUsersController = require("../controllers/manageUsersController.js");
    const checkAuth = require("../middleware/check-auth.js");
    var router = require("express").Router();
  
        router.get("/getUserTypeAccess", manageUsersController.getUserTypeAccess);
      
  
    app.use('/api/manageUsers', router);
  };