const redis = require("redis");

const redisHost = "127.0.0.1";
const redisPort = 6379;

const client = redis.createClient({
  host: redisHost,
  port: redisPort,
});

module.exports = client;
