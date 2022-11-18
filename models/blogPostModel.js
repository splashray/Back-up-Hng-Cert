const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");

const POSTS_PER_PAGE = 10;

const blogPostSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4().replace(/\-/g, ""),
  },
  title: {
    type: String,
    required: true,
  },
  article: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    require: true,
  },
  writtenBy: {
    type: String,
    required: true,
  },
  datePosted: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

blogPostSchema.statics.addBlogPost = async function (
  title,
  article,
  writtenBy,
  imageUrl,
  datePosted
) {
  try {
    const blogPost = await this.create({
      title,
      article,
      writtenBy,
      imageUrl,
      datePosted,
    });

    return blogPost;
  } catch (error) {
    throw error;
  }
};

blogPostSchema.statics.getAllBlogPosts = async function (title, page = 1) {
  const query = {};

  // Add a title filter that matches all substrings of the title
  // e.g geo would match geography, geology, NaGeo etc
  if (title) query.title = RegExp(`.*${title}.*`, "i");

  // Get all matching blog posts
  const blogPosts = await this.find(query)
    .skip(POSTS_PER_PAGE * (page - 1))
    .limit(POSTS_PER_PAGE);

  // Get total number of blog posts in db
  const totalBlogPosts = await this.find().count();

  return { blogPosts, totalBlogPosts };
};

blogPostSchema.statics.getOneBlogPost = async function (id) {
  try {
    const blogPost = await this.findOne({ _id: id }, { _id: 0, __v: 0 });
    if (!blogPost) {
      throw new Error("No blogPost with this id found");
    }
    return blogPost;
  } catch (error) {
    throw error;
  }
};

blogPostSchema.statics.deleteBlogPostById = async function (id) {
  try {
    const blogPostExists = await this.findOne({ _id: id });
    if (!blogPostExists) {
      throw new Error("No blogPost with this id found");
    }
    const result = await this.deleteOne({ _id: id });
    return result;
  } catch (error) {
    throw error;
  }
};

blogPostSchema.statics.updateBlogPost = async function (
  id,
  title,
  imageUrl,
  article
) {
  try {
    const blogPostExists = await this.findOne({ _id: id });
    if (!blogPostExists) {
      throw new Error("No blogPost with this id found");
    }
    const blogPost = await this.updateOne(
      { _id: id },
      { title, article, imageUrl }
    );
    return blogPost;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("blogPost", blogPostSchema);
