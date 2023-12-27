// users.js
const express = require("express");
const router = express.Router();
const { User } = require("../db");
const client = require("../redisClient");

router.get("/", async (req, res) => {
  try {
    const users = await User.find(
      req.routeOptions.filter,
      null,
      req.routeOptions.options
    );

    // Cache the data if not retrieved from the cache
    const cacheKey = req.routeOptions.cacheKey;
    client.setex(cacheKey, 3600, JSON.stringify(users)); // Set cache expiry to 1 hour

    res.header("X-Response-Source", "database");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.find({ id: userId });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Cache the data if not retrieved from the cache
    const cacheKey = req.routeOptions.cacheKey;
    client.setex(cacheKey, 3600, JSON.stringify(user)); // Set cache expiry to 1 hour

    res.header("X-Response-Source", "database");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
