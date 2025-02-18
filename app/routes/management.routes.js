module.exports = app => {
    const managementController = require("../controllers/managementController.js");
    const checkAuth = require("../middleware/check-auth.js");
    

  
    var router = require("express").Router();
  
    
        // Retrieve a single Company with id
       //router.get("/getAllProjects",checkAuth, dashboard.findAll);
      // router.get("/getAllProjects",checkAuth,  dashboard.findAll);
        router.post("/addProjectMaster", projectMasterController.submitProjectMaster);
       // router.post("/uploadFiles/:id", projectController.uploadFiles);
     
  
    app.use('/api/project', router);
  };