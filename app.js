const express = require("express");
const axios = require("axios");
const redis = require("redis");

const app = express();

const redisHost = "127.0.0.1";
const redisPort = 6379;

const client = redis.createClient({
  host: redisHost,
  port: redisPort,
});

// Check if Redis is reachable
client.ping((err, reply) => {
  if (err) {
    console.error("Error connecting to Redis:", err);
  } else {
    console.log("Connected to Redis. Server reply:", reply);
  }
});

const baseURL = "https://jsonplaceholder.typicode.com";
const CACHE_EXPIRATION = 60; // Cache expiration time in seconds

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("static"));

// Middleware to check cache
app.use(async (req, res, next) => {
  const key = req.originalUrl;

  // Check if the data is in the cache
  client.get(key, async (err, data) => {
    if (err) throw err;

    if (data !== null) {
      // Data found in cache, send it with a custom header
      res.set("X-Response-Source", "Cache");
      res.send(JSON.parse(data));
    } else {
      // Data not found in cache, proceed with the request
      next();
    }
  });
});

// Route to handle the request
app.use(async (req, res) => {
  const url = `${baseURL}${req.url}`;

  try {
    // Fetch data from the external API
    const response = await axios.get(url);

    // Store the response in the cache
    client.setex(
      req.originalUrl,
      CACHE_EXPIRATION,
      JSON.stringify(response.data)
    );

    // Send the response to the client with a custom header
    res.set("X-Response-Source", "Server");
    res.send(response.data);
  } catch (error) {
    // Handle errors, you may want to send an error response to the client
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
