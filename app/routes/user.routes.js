module.exports = app => {
  const userController = require("../controllers/userController.js");
  const checkAuth = require("../middleware/check-auth.js");
  


  var router = require("express").Router();

  
      // Retrieve a single Company with id
      router.post("/addUser", userController.submitUser);
      router.get("/getAllUsers", userController.findAll);
      router.get("/getClientProjects", userController.clientProjects);
      router.post("/verifyIdAndMobile", userController.verifyIdAndMobile);
      router.post("/resetPassword", userController.resetPassword);
     

  app.use('/api/user', router);
};