import { v4 as uuidv4 } from "uuid";

const express = require("express");
const cookieParser = require("cookie-parser");
const { synapse } = require("synapse");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;
const api = synapse(path.resolve(__dirname, "./resources"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use((req, res, next) => {
  console.log("asdasdasd");
  res.cookie("client_id", req.cookies.client_id || uuidv4());
  next();
});

app.use("/api", api.http, (req, res) => {
  res.status(res.locals.status()).json(res.locals.render());
});
app.get(function (request, response) {
  console.log("SULA");
  response.sendFile(path.resolve(__dirname, "..", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const defErr = {
    log: "Express error handler caught unknown middleware error",
    status: 400,
    message: "An error occurred",
  };
  const errorObj = { ...defErr, ...err };
  console.log(errorObj.log);
  res.status(errorObj.status).json(errorObj.message);
});
app.listen(port, () => console.log(`App listening on port ${port}!`));
