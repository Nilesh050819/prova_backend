module.exports = app => {
    const pdf_generate = require("../controllers/pdfGenerate.js");
    
  
    var router = require("express").Router();
  
    
        // Retrieve a single Company with id
       //router.get("/getAllProjects",checkAuth, dashboard.findAll);
       router.post("/create_pdf",  pdf_generate.create_pdf);
       router.get("/fetch_pdf",  pdf_generate.fetch_pdf);
       // router.get("/billing_details:id", billing_info.findOne);
  
  
    app.use('/api/pdf_generate', router);
  };