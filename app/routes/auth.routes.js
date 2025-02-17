module.exports = app => {
    const logins = require("../controllers/auth.controller.js");

  
    var router = require("express").Router();
  
    
    router.post("/login", logins.autheticate);
    router.post("/register", logins.setRegister);
    router.get("/", logins.findAll);
    router.get("/refresh", logins.refreshToken);
  
    app.use('/api/logins', router);
  };