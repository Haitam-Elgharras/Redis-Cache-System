// app.js
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Connect to MongoDB with the database name 'jsonPlaceHolderImpl'
mongoose.connect("mongodb://localhost:27017/jsonPlaceHolderImpl", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Mongoose schema for comments
const commentSchema = new mongoose.Schema({
  body: String,
  email: String,
  id: Number,
  name: String,
  postId: Number,
});

// Define Mongoose schema for posts
const postSchema = new mongoose.Schema({
  body: String,
  id: Number,
  title: String,
  userId: Number,
  comments: [commentSchema], // Array of comments
});

// Define Mongoose schema for users
const userSchema = new mongoose.Schema({
  address: {
    city: String,
    geo: {
      lat: String,
      lng: String,
    },
    street: String,
    suite: String,
    zipcode: String,
  },
  company: {
    bs: String,
    catchPhrase: String,
    name: String,
  },
  email: String,
  id: Number,
  name: String,
  phone: String,
  username: String,
  website: String,
});

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

// static page
app.use(express.static("static"));

// Middleware to handle common logic for posts and users routes
app.use((req, res, next) => {
  // Extract parameters from the query string
  const { limit, skip, userId } = req.query;

  // Prepare options for limiting and skipping
  const options = {};
  if (limit) options.limit = parseInt(limit);
  if (skip) options.skip = parseInt(skip);

  // Apply userId filter if provided
  const filter = userId ? { userId: parseInt(userId) } : {};

  req.routeOptions = { options, filter };
  next();
});

// Route to get posts with comments
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find(
      req.routeOptions.filter,
      null,
      req.routeOptions.options
    ).populate("comments");
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to get a specific post by ID
app.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate("comments");
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to get users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find(
      req.routeOptions.filter,
      null,
      req.routeOptions.options
    );
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to get a specific user by ID
app.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
