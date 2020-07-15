const express = require("express") // importing express
const bodyParser = require("body-parser") // importing body-parser. First install from npm
const mongoose = require("mongoose") // importing mongoose. First install from npm
const postsRoutes = require("../routes/posts") // importing postRoutes module.
const path = require("path") // importing path module.

const app = express() // Aliasing node.js express module.

// CORS(Cross Origin Resource Sharing): Setting headers.
// It should be written before writting any http verbs because it should and get connected with frontend.
// This is to just connect the two different servers running on frontend(localhost 4200) and backend(localhost 3000).
// In production environment both the serves runs on the same server. Hence,CORS is not required on production server.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*") // Headers
  res.setHeader("Access-Control-Allow-Headers", "Origin,x-Requested-with,Content-Type,Accept")
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,PUT,OPTIONS") // This header will allow which HTTP verbs will work.
  next()
})

// Connecting to the mongoose database with id and password. Also catching error.
// MongoDB cluster (sandbox): cloud solution:500MB free. signin
// You mush not upload this code to the server.
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to database!")
  })
  .catch(() => {
    console.log("Connection failed!")
  })

// Middlewares:
// API for parsing body of the request.
// Post coming from the frontend contains body (request body). So to understand that we need to install body-parser from npm.
app.use(bodyParser.json()) // json body parser
app.use(bodyParser.urlencoded({ extended: false })) // url encoded body parser
app.use("/images", express.static(path.join("backend/images"))) // this will add path to backend/images, if any request contains /images
app.use("/api/posts", postsRoutes) // This middleware route to /api/posts

module.exports = app // exporting express to outside of this module, so that it can be used by other module.
