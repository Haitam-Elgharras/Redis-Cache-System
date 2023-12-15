const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/jsonPlaceHolderImpl", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const commentSchema = new mongoose.Schema({
  body: String,
  email: String,
  id: Number,
  name: String,
  postId: Number,
});

const postSchema = new mongoose.Schema({
  body: String,
  id: Number,
  title: String,
  userId: Number,
  comments: [commentSchema],
});

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

module.exports = { User, Post };
