module.exports = app => {
    const projectController = require("../controllers/projectController.js");
    const checkAuth = require("../middleware/check-auth.js");
    

  
    var router = require("express").Router();
  
    
        // Retrieve a single Company with id
       //router.get("/getAllProjects",checkAuth, dashboard.findAll);
      // router.get("/getAllProjects",checkAuth,  dashboard.findAll);
        router.post("/addProject", projectController.submitProject);
       // router.post("/uploadFiles/:id", projectController.uploadFiles);
        router.post("/uploadFiles", projectController.uploadFiles);
        router.post("/getUploadFiles", projectController.getProjectFiles);
  
  
    app.use('/api/project', router);
  };