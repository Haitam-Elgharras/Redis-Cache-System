const client = require("../redisClient");

const checkCache = (req, res, next) => {
  const { limit, skip, userId } = req.query;
  const options = {};
  if (limit) options.limit = parseInt(limit);
  if (skip) options.skip = parseInt(skip);
  const filter = userId ? { userId: parseInt(userId) } : {};

  // Generate a unique cache key based on the request path and parameters
  // if JSON.stringify(req.query) is {} then it will return empty string
  if (JSON.stringify(req.query) === "{}") {
    var cacheKey = req.path;
  } else {
    var cacheKey = req.path + JSON.stringify(req.query);
  }

  // Check if the data is cached
  client.get(cacheKey, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      // If cached data exists, send it as the response
      console.log(`Data retrieved from cache for ${cacheKey}`);
      res.header("X-Response-Source", "cache");
      res.json(JSON.parse(data));
    } else {
      // If no cached data, proceed with the actual route handler
      req.routeOptions = { options, filter, cacheKey };
      next();
    }
  });
};

module.exports = checkCache;
