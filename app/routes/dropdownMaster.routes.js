module.exports = app => {
    const dropdownMasterController = require("../controllers/themeConfig/dropdownMasterController.js");
    const checkAuth = require("../middleware/check-auth.js");
    

  
    var router = require("express").Router();
  
    
        // Retrieve a single Company with id
       //router.get("/getAllProjects",checkAuth, dashboard.findAll);
      // router.get("/getAllProjects",checkAuth,  dashboard.findAll);
        router.get("/get_field_slug",checkAuth,  dropdownMasterController.get_field_slug);
        router.post("/add_dropdown_master",  dropdownMasterController.addDropdownMaster);
        router.get("/getDropdownMaster",checkAuth,  dropdownMasterController.fetchDropdownMaster);
        router.get("/getDropdownValues",  dropdownMasterController.getDropdownValues);
        router.get("/getUserList",  dropdownMasterController.getUserList);

        router.post("/addUploadFiles",  dropdownMasterController.uploadFiles);
       router.post("/getUploadFiles", dropdownMasterController.getUploadFiles);

       router.get("/getUserAccessType",  dropdownMasterController.getUserAccessType);
        
        
       
  
  
    app.use('/api/dropdownMaster', router);
  };