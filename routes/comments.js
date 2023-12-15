// comments.js
const express = require("express");
const router = express.Router();
const { Post } = require("../db");
const client = require("../redisClient");

router.get("/", async (req, res) => {
  try {
    const comments = await Post.find(
      req.routeOptions.filter,
      null,
      req.routeOptions.options
    )
      .populate("comments")
      .select("comments -_id");

    // Cache the data if not retrieved from the cache
    const cacheKey = req.routeOptions.cacheKey;
    client.setex(cacheKey, 3600, JSON.stringify(comments)); // Set cache expiry to 1 hour

    res.header("X-Response-Source", "database");
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
