const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const HttpException = require("./utils/HttpException");
const cookieParser = require("cookie-parser");
const socket = require("./socket/index");
const api = require("./routes/api");
const swagger = require("./utils/swagger");
const path = require("path");
const setup = require("./setup/index");

let port = process.env.PORT || 5000;

dotenv.config();
const app = express();
const server = http.createServer(app);

if (process.env.USE_REDIS == true) {
  setup.run();
}

// app.use(cors());
app.use(function (req, res, next) {
  const corsWhitelist = [
    "https://woparadise.tech",
    "http://localhost:3000",
    "https://jobsgo-3d607.web.app",
    "http://w42g1.int3306.freeddns.org",
  ];

  const origin = req.headers.origin;
  if (corsWhitelist.indexOf(origin) > -1) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(cookieParser());
app.use(express.json());

socket.listen(server);

app.use("/api", api);
swagger.swaggerDocs(app, port);

app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.resolve(__dirname, "../working-on-paradise/build")));

app.get("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "../working-on-paradise/build", "index.html"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Loi rui" } = err;
  res.status(status).end(message);
});

server.listen(port, () => {
  console.log(`Server is running in ${port}`);
});
