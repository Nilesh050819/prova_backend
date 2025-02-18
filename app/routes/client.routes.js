module.exports = app => {
    const clientDataController = require("../controllers/clientDataController.js");
    const checkAuth = require("../middleware/check-auth.js");
    

  
    var router = require("express").Router();
    router.get("/getClientProjectDetails", clientDataController.getClientProjectDetails);
    router.post("/getProjectWorkStartData", clientDataController.getProjectWorkStartData);
   
        
       
    app.use('/api/client', router);
  };