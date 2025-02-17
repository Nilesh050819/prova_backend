module.exports = app => {
    const supervisorDataController = require("../controllers/supervisorDataController.js");
    const checkAuth = require("../middleware/check-auth.js");
    

  
    var router = require("express").Router();
    router.get("/getProjectType", supervisorDataController.getProjectType);
    router.get("/getSupervisorProjects", supervisorDataController.getSupervisorProjects);
    router.get("/getProjectDetails", supervisorDataController.getProjectDetails);
    router.post("/getAssignedDataByProjects", supervisorDataController.getAssignedDataByProjects);
    router.post("/uploadDocumentFiles", supervisorDataController.uploadDocumentFiles);
    router.post("/getProjectDocumentFiles", supervisorDataController.getProjectDocumentFiles);
    router.post("/deleteDocumentFiles", supervisorDataController.deleteDocumentFiles);
    router.post("/projectWorkAssignment", supervisorDataController.projectWorkAssignment);
    router.post("/updateWorkPercentage", supervisorDataController.updateWorkPercentage);
        
        
       
    app.use('/api/supervisor', router);
  };