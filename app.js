const express = require("express");
const app = express();
const usersRoute = require("./routes/users");
const postsRoute = require("./routes/posts");
const commentsRoute = require("./routes/comments");
const checkCache = require("./middleware/checkCache");

app.use(express.static("static"));

// Use the caching middleware for all routes
app.use(checkCache);

app.use("/users", usersRoute);
app.use("/posts", postsRoute);
app.use("/comments", commentsRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
