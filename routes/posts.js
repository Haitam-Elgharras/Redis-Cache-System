// posts.js
const express = require("express");
const router = express.Router();
const { Post } = require("../db");
const client = require("../redisClient");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find(
      req.routeOptions.filter,
      null,
      req.routeOptions.options
    ).populate("comments");

    // Cache the data if not retrieved from the cache
    const cacheKey = req.routeOptions.cacheKey;
    client.setex(cacheKey, 3600, JSON.stringify(posts)); // Set cache expiry to 1 hour

    res.header("X-Response-Source", "database");
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.find({ id: postId }).populate("comments");
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    // Cache the data if not retrieved from the cache
    const cacheKey = req.routeOptions.cacheKey;
    client.setex(cacheKey, 3600, JSON.stringify(post)); // Set cache expiry to 1 hour

    res.header("X-Response-Source", "database");
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
