const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const multer = require('multer');
const AWS = require('aws-sdk');
const store = require('./placeholder')
const path = require('path');

//const upload = multer();
const app = express();
app.use(bodyParser.json());
app.use('/static', express.static('public'));
const publicPath = path.join(__dirname, 'public');

//const invoiceRoute = require("./app/routes/invoice.routes.js");
//const dashboardRoute = require("./app/routes/dashboard.routes.js");
//app.use(bodyParser.urlencoded({ extended: false }));

//const upload = multer();
//app.use(upload.none());
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded


//app.use(bodyParser.urlencoded({ extended: false }));



// });
// parse requests of content-type - application/json


// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my application." });
});

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)
      //cb(null, file.fieldname+ "_" + Date.now() + ",jpg")
    }

  })
}).single("file");

app.post("/upload", upload, (req, res) => {

  res.send("file upload")
})


require("./app/routes/company.routes.js")(app);
require("./app/routes/auth.routes.js")(app);
//app.use("/dashboard",dashboardRoute);
//app.use("/invoice",invoiceRoute);
//require("./app/routes/invoice.routes.js")(app);
require("./app/routes/billing_info.routes.js")(app);
require("./app/routes/dashboard.routes.js")(app);
require("./app/routes/project.routes.js")(app);
require("./app/routes/pdfGenerate.routes.js")(app);
require("./app/routes/dropdownMaster.routes.js")(app);
require("./app/routes/masters.routes.js")(app);
require("./app/routes/user.routes.js")(app);
require("./app/routes/manageUsers.routes.js")(app);
require("./app/routes/supervisor.routes.js")(app);
require("./app/routes/client.routes.js")(app);
require("./app/routes/siteUpdates.routes.js")(app);


//Error Handling
app.use((err, req, res, next) => {
  const { status, message } = err;
  res.status(status).json({
      status: "error",
      data: {
          message: message,
      }
  });
});

// set port, listen for requests
const PORT = 8000;
app.listen(PORT, 'localhost', () => {
  console.log(`Server running at http://localhost/:${PORT}/`);
});

app.get('/sample', (req, res) => {
  let { page, limit } = req.query
  if (!page) page = 1
  if (!limit) limit = 10
  page = parseInt(page)
  limit = parseInt(limit)
  return res.json({
      data: store.slice((page - 1) * limit, page * limit),
      total: store.length
  })
})


const generateData = () => {
  const data = [];
  for (let i = 0; i < 1000; i++) {
      data.push({
          id: i,
          name: `Name ${i}`,
          age: 20 + (i % 30),
          country: i % 2 === 0 ? 'USA' : 'Canada',
      });
  }
  return data;
};

const rowData = generateData();

app.post('/api/data', (req, res) => {
  const { startRow, endRow, sortModel, filterModel } = req.body;

  let filteredData = [...rowData];

  // Apply filtering
  if (filterModel) {
      Object.keys(filterModel).forEach((key) => {
          const filter = filterModel[key].filter;
          filteredData = filteredData.filter((row) =>
              row[key].toString().includes(filter)
          );
      });
  }

  // Apply sorting
  if (sortModel && sortModel.length > 0) {
      const { colId, sort } = sortModel[0];
      filteredData.sort((a, b) =>
          sort === 'asc' ? a[colId] - b[colId] : b[colId] - a[colId]
      );
  }

  // Paginate
  const rows = filteredData.slice(startRow, endRow);

  res.json({
      rows,
      lastRow: filteredData.length,
  });
});