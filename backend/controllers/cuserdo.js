// const bookmark_model = require('../models/mbookmark');
// const like_model = require('../models/mlike');
// const usermodel = require('../models/muser');
// const newsProvidermodel = require('../models/mnewsProvider');
// const comment_model = require('../models/mcomments');
// const { v4: uuidv4 } = require('uuid');

import {bookmark_model} from '../models/mbookmark.js';
import {like_model} from '../models/mlike.js';
import {usermodel} from '../models/muser.js';
import {newsProvidermodel} from '../models/mnewsProvider.js';
import {comment_model} from '../models/mcomments.js';
import { v4 as uuidv4 } from 'uuid';


const getBookmarkArticle = async (req, res) => {
  const bookmarks = await bookmark_model.find({ user_id: req.user.id });

  return res.status(202).json({ success: true, bookmarks });
}

const isBookmarked = async (req, res) => {
  const { title, link } = req.body;

  if (!title || !link) {
    return res.status(210).json({ success: false, message: "Title and Link is required" });
  }

  const bookmark = await bookmark_model.findOne({ user_id: req.user.id, title, link });

  if (!bookmark) {
    return res.status(202).json({ success: true, bookmarked: false });
  }

  return res.status(202).json({ success: true, bookmarked: true });
}

const addBookmarkArticle = async (req, res) => {

  const { title, link, providerImg, providerName, imgURL, someText } = req.body;

  if (!title && !link) {
    return res.status(210).json({ success: false, message: "Title and Link are required" });
  }


  const newBookmark = new bookmark_model({
    user_id: req.user.id, title, link, providerImg, providerName, imgURL, someText
  });

  await newBookmark.save();

  return res.status(202).json({ success: true, message: "Bookmark added successfully" });
}

const deleteBookmarkArticle = async (req, res) => {

  const { title, link } = req.body;

  if (!title && !link) {
    return res.status(210).json({ success: false, message: "Title and Link are required" });
  }

  await bookmark_model.findOneAndDelete({ user_id: req.user.id, title, link });

  return res.status(202).json({ success: true, message: "Bookmark deleted successfully" });
}

const addLikeArticle = async (req, res) => {


  // console.log(req.body);
  // return res.status(202).json({ success: true, message: "Like added successfully" });


  const { title } = req.body;

  if (!title) {
    return res.status(210).json({ success: false, message: "Title is required" });
  }

  const newLike = new like_model({
    user_id: req.user.id, title
  });

  await newLike.save();

  return res.status(202).json({ success: true, message: "Like added successfully" });

}

const deleteLikeArticle = async (req, res) => {

  const { title } = req.body;

  if (!title) {
    return res.status(210).json({ success: false, message: "Title is required" });
  }

  await like_model.findOneAndDelete({ user_id: req.user.id, title });

  return res.status(202).json({ success: true, message: "Like deleted successfully" });
}

const isLiked = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(210).json({ success: false, message: "Title is required" });
  }

  const like = await like_model.findOne({ user_id: req.user.id, title });

  if (!like) {
    return res.status(202).json({ success: true, liked: false });
  }

  return res.status(202).json({ success: true, liked: true });
}

const getNumLikes = async (req, res) => {


  const { title } = req.body;

  if (!title) {
    return res.status(210).json({ success: false, message: "title is required" });
  }

  const likes = await like_model.find({ title: title });

  return res.status(202).json({ success: true, numLikes: likes.length });

}


const addFollow = async (req, res) => {
  const { baseURL } = req.body;

  if (!baseURL) {
    return res.status(210).json({ success: false, message: "BaseURL is required" });
  }

  const provider = await newsProvidermodel.findOneAndUpdate({ baseURL }, { $addToSet: { followers: req.user.id } });

  const user = await usermodel.findByIdAndUpdate(req.user.id, { $addToSet: { following: baseURL } });




  if (!provider || !user) {
    return res.status(210).json({ success: false, message: "error while Follow" });
  }

  return res.status(202).json({ success: true, message: "Followed successfully" });
}

const deleteFollow = async (req, res) => {

  const { baseURL } = req.body;

  if (!baseURL) {
    return res.status(210).json({ success: false, message: "BaseURL is required" });
  }

  const provider = await newsProvidermodel.findOneAndUpdate({ baseURL }, { $pull: { followers: req.user.id } });

  const user = await usermodel.findByIdAndUpdate(req.user.id, { $pull: { following: baseURL } });

  if (!provider || !user) {
    return res.status(210).json({ success: false, message: "error while unfollow" });
  }

  return res.status(202).json({ success: true, message: "Unfollowed successfully" });
}

const isFollowed = async (req, res) => {

  try {
    const { baseURL } = req.body;

    if (!baseURL) {
      return res.status(210).json({ success: false, message: "BaseURL is required" });
    }

    const user_follow = await usermodel.findById(req.user.id).select('following');

    if (user_follow.following.includes(baseURL)) {
      return res.status(202).json({ success: true, isFollowing: true });
    }

    return res.status(202).json({ success: true, isFollowing: false });
  } catch (error) {
    console.error('Failed to check follow status:', error);
    return res.status(210).json({ success: false, message: "Error while checking follow status" });
  }
}

const addComment = async (req, res) => {

  try {
    const { articleURL, comment } = req.body;

    // Check for required fields
    if (!articleURL || !comment) {
      return res.status(210).json({
        success: false, message: "ArticleURL, Username, and Comment are required"
      });
    }

    const existingComment = await comment_model.findOne({ articleURL });

    if (existingComment) {
      existingComment.user.push({
        username: req.user.username,
        comment,
        commentId: uuidv4()
      });
      await existingComment.save();
      return res.status(210).json({ success: true, message: "Comment added successfully", username: req.user.username });
    }
    else {
      const newComment = new comment_model({
        articleURL,
        user: [
          {
            username: req.user.username, // Adding username from request body
            comment: comment,
            commentId: uuidv4()
          }
        ]
      });

      // Save the new comment to the database
      console.log(newComment);
      await newComment.save();

      // Respond with success
      return res.status(202).json({
        success: true, message: "Comment added successfully",
      });
    }

  } catch (error) {
    console.error("Failed to add comment:", error);
    return res.status(210).json({
      success: false,
      message: "Error while adding comment"
    });
  }

}

const deleteComment = async (req, res) => {

  try {
    const { articleURL, commentId } = req.body;

    // Check for required fields
    if (!articleURL || !commentId) {
      return res.status(210).json({ success: false, message: "ArticleURL and timestamp are required" });
    }


    const existingComment = await comment_model.findOne({ articleURL });

    if (!existingComment) {
      return res.status(210).json({ success: false, message: "Comment not found" });
    }

    existingComment.user = existingComment.user.filter((user) => user.commentId !== commentId);


    await existingComment.save();

    return res.status(202).json({ success: true, message: "Comment deleted successfully" });

  }
  catch (error) {
    console.error('Failed to delete comment:', error);
    return res.status(210).json({ success: false, message: "Error while deleting comment" });
  }

}

const getCommentsOfArticles = async (req, res) => {
  try {
    const { articleURL } = req.body;

    if (!articleURL) {
      return res.status(210).json({ success: false, message: "ArticleURL is required" });
    }

    const comments = await comment_model.findOne({ articleURL });

    if (!comments) {
      return res.status(210).json({ success: true, comments: [] });
    }

    return res.status(202).json({ success: true, comments: comments.user, loggedUserName: req.user.username });


  }
  catch (error) {
    console.error('Failed to get comments:', error);
    return res.status(210).json({ success: false, message: "Error while getting comments" });
  }
}

const getNumComments = async (req, res) => {
  try {
    const { articleURL } = req.body;

    if (!articleURL) {
      return res.status(210).json({ success: false, message: "ArticleURL is required" });
    }

    const comments = await comment_model.findOne({ articleURL });

    if (!comments) {
      return res.status(202).json({ success: true, numComments: 0 });
    }

    return res.status(202).json({ success: true, numComments: comments.user.length });

  }
  catch (error) {
    console.error('Failed to get comments:', error);
    return res.status(210).json({ success: false, message: "Error while getting comments" });
  }
}


// module.exports = { addBookmarkArticle, deleteBookmarkArticle, getBookmarkArticle, isBookmarked, addLikeArticle, deleteLikeArticle, isLiked, addFollow, deleteFollow, isFollowed, addComment, deleteComment, getCommentsOfArticles, getNumLikes, getNumComments };

export { addBookmarkArticle, deleteBookmarkArticle, getBookmarkArticle, isBookmarked, addLikeArticle, deleteLikeArticle, isLiked, addFollow, deleteFollow, isFollowed, addComment, deleteComment, getCommentsOfArticles, getNumLikes, getNumComments };



