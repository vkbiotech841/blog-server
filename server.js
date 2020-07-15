// Importing modules: http from node.js, app from the app.js and debug.
require("dotenv").config()
const http = require("http")
const app = require("./backend/app")
const debug = require("debug")("node-angular")

const normalizePort = (val) => {
  var port = parseInt(val, 10)
  if (isNaN(port)) {
    // named pipe
    return val
  }
  if (port >= 0) {
    // port number
    return port
  }
  return false
}

// Handing error: it will almost same for other applications
const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges")
      process.exit(1)
      break
    case "EADDRINUSE":
      console.error(bind + " is already in use")
      process.exit(1)
      break
    default:
      throw error
  }
}

// setting Listerning:
const onListening = () => {
  const addr = server.address()
  const bind = typeof port === "string" ? "pipe " + port : "port " + port
  debug("Listening on " + bind)
}

// Setting port: either from the production environment or from localhost 3000.
const port = normalizePort(process.env.PORT || "3000")
app.set("port", port)

// Creating server: app server
const server = http.createServer(app)

// Handing method
server.on("error", onError)

server.on("listening", onListening)

// Listening at the port
server.listen(port)
