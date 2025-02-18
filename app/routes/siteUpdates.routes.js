module.exports = app => {
    const siteUpdatesController = require("../controllers/siteUpdatesController.js");
    const checkAuth = require("../middleware/check-auth.js");
    

  
    var router = require("express").Router();
    router.post("/getProjectSiteCategories", siteUpdatesController.getProjectSiteCategories);
      
        
       
    app.use('/api/siteUpdates', router);
  };