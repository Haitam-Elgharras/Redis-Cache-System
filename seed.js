// seed.js
const mongoose = require("mongoose");
const axios = require("axios");

// Connect to MongoDB with the database name 'jsonPlaceHolderImpl'
mongoose.connect("mongodb://localhost:27017/jsonPlaceHolderImpl", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ab -c 100 -n 1000 http://localhost:3000/posts

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

async function seedDatabase() {
  try {
    // Fetch users, posts, and comments from the JSONPlaceholder API
    const usersResponse = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    const postsResponse = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    const commentsResponse = await axios.get(
      "https://jsonplaceholder.typicode.com/comments"
    );

    const users = usersResponse.data;
    const posts = postsResponse.data;
    const comments = commentsResponse.data;

    // Store users in MongoDB
    await User.insertMany(users);

    // Map comments to posts based on postId
    const postsWithComments = posts.map((post) => {
      const postComments = comments.filter(
        (comment) => comment.postId === post.id
      );
      return { ...post, comments: postComments };
    });

    // Store posts with comments in MongoDB
    await Post.insertMany(postsWithComments);

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    // Close the MongoDB connection
    mongoose.disconnect();
  }
}

// Run the seed function
seedDatabase();
