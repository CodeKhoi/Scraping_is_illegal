// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");

// Require all models
var db = require("./models");

// Scraping tools
var request = require("request");
var cheerio = require("cheerio");

//Define port
var port = process.env.PORT || 3000

// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: false}));

// Make public a static dir
app.use(express.static("public"));

// Import routes and give the server access to them.
require("./routes/api-routes.js")(app); 

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "/views/layouts/partials")
}));
app.set("view engine", "handlebars");

// Database configuration with mongoose
var MONGODB_URI = process.env.MONGODB_URI;

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

var mc = mongoose.connection;

// Show any mongoose errors
mc.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the mc through mongoose, log a success message
mc.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Listen on port
app.listen(port, function() {
  console.log("App running on port " + port);
});

