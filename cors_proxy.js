const axios = require("axios");
const express = require("express");

const app = express();

// Parse plain text and json request bodies
app.use(express.text());
app.use(express.json());

// Enable CORS by setting appropriate headers
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin (for testing; restrict in production)
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Handle all HTTP methods for /proxy
app.all("/proxy", (req, res) => {
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  const targetUrl = req.query.url;
  proxyRequest(
    targetUrl,
    req,
    res,
    req.method === "GET" ? undefined : req.body,
    req.method
  );
});

function proxyRequest(targetUrl, req, res, data, method = "GET") {
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = "//" + targetUrl;
  }
  const requestOptions = {
    method: method,
    url: targetUrl,
    // headers: req.headers, // TODO: not working with SSL
    headers: {
      Authorization: req.header("Authorization"),
      "Content-Type": req.header("Content-Type"),
    },
    data,
  };

  axios(requestOptions)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      if (error.response) {
        res.status(error.response.status).send(error.response.data);
      } else if (error.request) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send(error.message);
      }
    });
}

const PORT = 4000;
const server = app.listen(PORT, () => {
  console.log(`CORS proxy server is running on port ${PORT}`);
});

module.exports = { app, server };
