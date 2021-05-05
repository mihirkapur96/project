//// Add packages

const express = require("express");
const app = express();

const multer = require("multer");
const upload = multer();

// Add packages
const dblib = require("./dblib.js");

// Add middleware to parse default urlencoded form
app.use(express.urlencoded({ extended: false }));

// Start listener
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});

//notify ejs template engine must be used
app.set("view engine", "ejs");

// Enable CORS (see https://enable-cors.org/server_expressjs.html)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

//specify that views are saved in  view folder
//app.set("views", path.join(__dirname, "views"));

//Indicate that static files are saved in the “public” folder
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));



//return index.ejs
app.get("/", (req, res) => { {
    // res.send("Hello world...");
    res.render("index");
  }});

//add /customer to path
//   app.get("/customer", (req, res) => {
//     res.render("customer");
//   });

//display total number of records in db
app.get("/customer", async (req, res) => {
      // Omitted validation check
      const totRecs = await dblib.getTotalRecords();
      //create an empty customer oject to populate forms with values
      const cust={
          cusId:"",
          cusFname:"",
          cusLname:"",
          cusState:"",
          cusSalesYTD:"",
          cusSalesPrev:""
      };
      res.render("customer", {
          type: "get",
          cust: cust,
          totRecs: totRecs.totRecords
          
      });
});
  //post search result
  app.post("/customer", async (req, res) => {
    // Omitted validation check
    //  Can get this from the page rather than using another DB call.
    //  Add it as a hidden form value.
    const totRecs = await dblib.getTotalRecords();

    dblib.findCustomers(req.body)
        .then(result => {
           // console.log(`result is:`,result);
            res.render("customer", {
                type: "post",
                totRecs: totRecs.totRecords,
                result: result,
                cust: req.body
            })
        })
        .catch(err => {
            res.render("customer", {
                type: "post",
                totRecs: totRecs.totRecords,
                result: `Unexpected Error: ${err.message}`,
                cust: req.body
            });
        });
});


// // edit routine to be edited
// //GET /edit
// app.get("/edit/:id", (req, res) => {
//     const id = req.params.id;
//     const sql = "SELECT * FROM CUSTOMER WHERE cusId = $1";
//     pool.query(sql, [id], (err, result) => {
//       // if (err) ...
//       res.render("edit", { model: result.rows[0] });
//     });
//   });
  
//   // POST /edit/5
//   app.post("/edit/:id", (req, res) => {
//     const id = req.params.id;
//     const book = [req.customer.cusFname, req.customer.cusLname, req.customer.cusState, req.customer.cusSalesYTD, req.customer.cusSalesPrev, id];
//     const sql = "UPDATE customer SET cusFname = $2, cusLname = $3, cusState = $4, cusSalesYTD= $5, cusSalesPrev= $6 WHERE (cusId = $1)";
//     pool.query(sql, book, (err, result) => {
//       // if (err) ...
//       res.redirect("/customer");
//     });
//   });


// // delete routine to be edited
// //GET /delete
// app.get("/delete/:id", (req, res) => {
//     const id = req.params.id;
//     const sql = "SELECT * FROM customer WHERE cusId = $1";
//     pool.query(sql, [id], (err, result) => {
//       // if (err) ...
//       res.render("delete", { model: result.rows[0] });
//     });
//   });
  
//   // POST /delete/5
//   app.post("/delete/:id", (req, res) => {
//     const id = req.params.id;
//     const sql = "DELETE FROM customer WHERE cusId = $1";
//     pool.query(sql, [id], (err, result) => {
//       // if (err) ...
//       res.redirect("/customer");
//     });
//   });