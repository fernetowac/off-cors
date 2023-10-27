const axios = require("axios");
const express = require("express");

const app = express();

// Parse plain text and json request bodies
app.use(express.text());
app.use(express.json());

// Enable CORS by setting appropriate headers
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin (for testing; restrict in production)
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Define a route that handles the CORS request and proxies it to the target URL.
app.get("/proxy", (req, res) => {
  const targetUrl = req.query.url;
  proxyRequest(targetUrl, req, res);
});

app.post("/proxy", (req, res) => {
  const targetUrl = req.query.url;
  proxyRequest(targetUrl, req, res, req.body, "POST");
});

function proxyRequest(targetUrl, req, res, data = null, method = "GET") {
  const requestOptions = {
    method: method,
    url: targetUrl,
    // headers: req.headers,
    headers: {
      Authorization: req.header("Authorization"), // Pass along the Authorization header if it's provided
      "Content-Type": req.header("Content-Type"), // You can adjust the content type as needed
    },
    data, // Include data in the request body for POST requests
  };

  axios(requestOptions).then((response) => {
    res.send(response.data);
  });
}

const PORT = 4000;
const server = app.listen(PORT, () => {
  console.log(`CORS proxy server is running on port ${PORT}`);
});

module.exports = { app, server };
