    const invoiceController = require("../controllers/invoice.controller.js");
    const checkAuth = require("../middleware/check-auth.js");
    

  
    const router = require("express").Router();
  
   // router.post("/", company.create);
    //router.put("/:id",checkAuth, company.update);
        // Retrieve a single Company with id
       // router.get("/:id",checkAuth, invoice.getAllInvoice);
       // router.get("/invoice_details/:id",checkAuth, invoice.invoiceDetails);
       // router.get("/invoice_details/",checkAuth, invoice.invoiceDetails);
       router.route("/").get(invoiceController.getAllInvoice);

       router.route("/invoice_details")
       .get(invoiceController.invoiceDetails);
  
   // app.use('/api/invoice', router);
    module.exports = router;  