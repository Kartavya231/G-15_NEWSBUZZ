// const router = require("express").Router();

// const { addBookmarkArticle, deleteBookmarkArticle, getBookmarkArticle, isBookmarked, addLikeArticle, deleteLikeArticle, isLiked, addFollow, deleteFollow, isFollowed, addComment, deleteComment, getCommentsOfArticles, getNumLikes, getNumComments } = require("../controllers/cuserdo.js");

import express from "express";
const router = express.Router();
// import { addBookmarkArticle, deleteBookmarkArticle, getBookmarkArticle, isBookmarked, addLikeArticle, deleteLikeArticle, isLiked, addFollow, deleteFollow, isFollowed, addComment, deleteComment, getCommentsOfArticles, getNumLikes, getNumComments } from "../controllers/cuserdo.js";
import temp from "../controllers/cuserdo.js";
const { addBookmarkArticle, deleteBookmarkArticle, getBookmarkArticle, isBookmarked, addLikeArticle, deleteLikeArticle, isLiked, addFollow, deleteFollow, isFollowed, addComment, deleteComment, getCommentsOfArticles, getNumLikes, getNumComments } = temp;

router.post("/isbookmarked", isBookmarked);

router.get("/bookmark", getBookmarkArticle);

router.post("/addBookmark", addBookmarkArticle);

router.post("/deleteBookmark", deleteBookmarkArticle);


router.post("/isLiked", isLiked);
router.post("/addlike", addLikeArticle);
router.post("/deleteLike", deleteLikeArticle);
router.post("/numLikes", getNumLikes);


router.post("/follow", addFollow);
router.post("/unfollow", deleteFollow);
router.post("/isfollowed", isFollowed);


router.post("/getComments", getCommentsOfArticles);
router.post("/addComment", addComment);
router.post("/deleteComment", deleteComment);
router.post("/numComments", getNumComments);



export default router;;