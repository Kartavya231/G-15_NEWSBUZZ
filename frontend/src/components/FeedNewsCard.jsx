import React, { useEffect, useRef, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Tooltip,
  Zoom,
  IconButton,
} from "@mui/material";
import { ThemeContext } from "../context/ThemeContext";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { POST } from "../api";
import HeartIcon from "@mui/icons-material/Favorite";
import HeartBorderIcon from "@mui/icons-material/FavoriteBorder";
import InsertCommentRoundedIcon from "@mui/icons-material/InsertCommentRounded";
import ShareDialog from "./ShareDialog";
import { toast } from "react-hot-toast";
import CommentsMenu from "./CommentsMenu";
import ShareIcon from "@mui/icons-material/Share";

const FeedNewsCard = (props) => {
  const { mode } = useContext(ThemeContext);
  const location = useLocation();
  const isSearchPage =
    location.pathname === "/search" || location.pathname === "/myfeed";

  const handleClick = () => {
    window.open(props.link, "_blank");
  };

  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [numLikes, setNumLikes] = useState(0);
  const [numComments, setNumComments] = useState(0);
  const shareDialogRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleArticleDetails = async () => {
      const ArticleDetails = { title: props.title, link: props.link };

      const result = await POST("/api/userdo/isBookmarked", ArticleDetails);
      if (result.data.success) {
        setBookmarked(result.data.bookmarked);
      }
      if (result.data?.caught) {
        navigate('/login'); return;
        // toast.error(result.data.message);
      }
    };

    handleArticleDetails();
  }, [props.title, props.link, navigate]);

  useEffect(() => {
    (async () => {
      const ArticleDetails = { title: props.title };

      const result = await POST("/api/userdo/isLiked", ArticleDetails);
      if (result.data.success) {
        setLiked(result.data.liked);
      }
      if (result.data?.caught) {
        navigate('/login'); return;
        // toast.error(result.data.message);
      }

      const NumLikesResult = await POST("/api/userdo/numLikes", ArticleDetails);
      if (NumLikesResult.data.success) {
        setNumLikes(NumLikesResult.data.numLikes);
      }

      if(NumLikesResult.data?.caught) {
        navigate('/login'); return;
        // toast.error(NumLikesResult.data.message);
      }
    })();
  }, [props.title, numLikes, navigate]);

  useEffect(() => {
    (async () => {
      const numCommentsResult = await POST("/api/userdo/numComments", {
        articleURL: props.link,
      });
      if (numCommentsResult.data.success) {
        setNumComments(numCommentsResult.data.numComments);
      }
      if (numCommentsResult.data?.caught) {
        navigate('/login'); return;
        // toast.error(numCommentsResult.data.message);
      }
    })();
  }, [props.link, numComments, navigate]);

  const handleBookmarkClick = async () => {
    setBookmarked(!bookmarked);

    const ArticleDetails = {
      title: props.title,
      link: props.link,
      imgURL: props.imgURL,
      providerName: props.providerName,
      providerImg: props.providerImg,
      time: props.time,
      someText: props.someText,
    };

    const bookmarkPromise = bookmarked
      ? POST("/api/userdo/deleteBookmark", ArticleDetails)
      : POST("/api/userdo/addBookmark", ArticleDetails);

    toast.promise(bookmarkPromise, {
      loading: bookmarked ? "Removing bookmark..." : "Adding bookmark...",
      success: (result) => {
        if (result.data.success) {
          return bookmarked
            ? "Bookmark removed successfully!"
            : "Bookmark added successfully!";
        } else if (result.data?.caught) {
          navigate('/login'); return;
        } else {
          throw new Error(result.data.message);
        }
      },
      error: (err) => `Error: ${ err.message }`,
    });

  await bookmarkPromise;
};

// const [liked, setLiked] = useState(false);
// const [numLikes, setNumLikes] = useState(0);
const [animateDirection, setAnimateDirection] = useState(null);
const [animate, setAnimate] = useState(false);

const handleLikeClick = async () => {
  const previousNumLikes = numLikes; // Save the current number of likes
  setAnimate(true);
  setLiked(!liked);

  const ArticleDetails = {
    title: props.title,
  };

  const likePromise = liked
    ? POST("/api/userdo/deleteLike", ArticleDetails)
    : POST("/api/userdo/addLike", ArticleDetails);

  toast.promise(likePromise, {
    loading: liked ? "Removing like..." : "Adding like...",
    success: (result) => {
      if (result.data.success) {
        return liked
          ? "Like removed successfully!"
          : "Like added successfully!";
      } else if (result.data?.caught) {
        // toast.error(result.data.message);
        navigate('/login'); return;
      } else {
        throw new Error(result.data.message);
      }
    },
    error: (err) => `Error: ${ err.message }`,
    });
await likePromise;

const NumLikesResult = await POST("/api/userdo/numLikes", ArticleDetails);
if (NumLikesResult.data.success) {
  setNumLikes(NumLikesResult.data.numLikes);
}

// Determine if likes are increasing or decreasing
if (NumLikesResult.data.numLikes > previousNumLikes) {
  // Likes increased, transition goes from bottom to top
  setAnimateDirection("up");
} else {
  // Likes decreased, transition goes from top to bottom
  setAnimateDirection("down");
}

// Reset animation after it completes (e.g., 300ms)
setTimeout(() => setAnimate(false), 300);
  };

const handleClickOutside = (event) => {
  if (
    shareDialogRef.current &&
    !shareDialogRef.current.contains(event.target)
  ) {
    setShowShareDialog(false);
  }
};

const [anchorEl, setAnchorEl] = useState(null);

const handleCommentsClick = (event) => {
  setAnchorEl(event.currentTarget);
  setShowComments(true);
};

useEffect(() => {
  if (showShareDialog) {
    document.addEventListener("mousedown", handleClickOutside);
  } else {
    document.removeEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showShareDialog]);

const [showComments, setShowComments] = useState(false);

return (
  <>
    {/* Card Wrapper to Control Width */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        margin: "20px",
        width: "100%",
        height: "auto",
        maxWidth: 800,
        maxHeight: 800,
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          border: "none",
          boxShadow: "none",
          width: "100%",
          height: "100% ",
          // backgroundColor:"black",
          backgroundColor: showComments
            ? mode === "light"
              ? "rgb(230, 230, 230)"
              : "rgb(70, 70, 70)"
            : mode === "light"
              ? "rgb(246, 246, 246)"
              : "rgb(50, 50, 50)",
          "&:hover": {
            backgroundColor: showComments
              ? mode === "light"
                ? "rgb(220, 220, 220)"
                : "rgb(80, 80, 80)"
              : mode === "light"
                ? "rgb(240, 240, 240)"
                : "rgb(60, 60, 60)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            //   backgroundColor: "black",
          }}
        >
          <CardContent sx={{ flex: 1 }}>
            {/* Provider Image and Name */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
                height: "40px",
                overflow: "hidden",
              }}
            >
              {isSearchPage ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  {props.providerImg && (
                    <img
                      src={props.providerImg}
                      alt="Provider Logo"
                      style={{
                        maxWidth: "40px",
                        maxHeight: "40px",
                        objectFit: "contain",
                      }}
                    />
                  )}
                  {props.providerName && (
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      style={{ marginLeft: "10px" }}
                    >
                      {props.providerName}
                    </Typography>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  {props.providerImg && (
                    <img
                      src={props.providerImg}
                      alt="Provider Logo"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "80%",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </div>
              )}
            </div>

            <Box
              sx={{
                width: "100%",
                height: "300px",
                //   backgroundColor: "black",
              }}
            >
              {/* Article Image */}
              {/* <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                        padding: 2,
                      backgroundColor:"black"
                    }}
                  > */}
              {props.imgURL && (
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    height: "300px",
                    //   backgroundColor: "gray",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2,
                  }}
                >
                  <img
                    src={props.imgURL}
                    alt="Article"
                    style={{
                      width: "50%",
                      height: "300px",
                      alignSelf: "center",
                      maxWidth: "100%",
                      maxHeight: "300px",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
            </Box>
          </CardContent>
        </Box>
        {/* Title with Tooltip */}
        <Tooltip
          title="click"
          placement="top"
          TransitionComponent={Zoom}
          arrow
        >
          <Typography
            variant="h6"
            component="div"
            gutterBottom
            onClick={handleClick}
            sx={{
              cursor: "pointer",
              color: "rgb(30, 144, 255)",
              "&:hover": { color: mode === "light" ? "blue" : "white" },
              pl: 2,
            }}
          >
            {props.title}
          </Typography>
        </Tooltip>

        {/* Some Text */}
        {props.someText && (
          <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
            {props.someText}
          </Typography>
        )}

        {/* Time Display */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
            {props.time}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Save" placement="bottom" arrow>
              <IconButton
                sx={{
                  height: "48px",
                  width: "48px",
                  alignSelf: "center",
                  marginBottom: "8px",
                }}
                aria-label="save"
                onClick={handleBookmarkClick}
              >
                {bookmarked ? (
                  <BookmarkIcon
                    sx={{ fontSize: "28px", color: "primary.main" }}
                  />
                ) : (
                  <BookmarkBorderIcon sx={{ fontSize: "28px" }} />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Like" placement="bottom" arrow>
              <IconButton
                sx={{
                  height: "48px",
                  width: "48px",
                  alignSelf: "center",
                  marginBottom: "4px",
                }}
                aria-label="like"
                onClick={handleLikeClick}
              >
                {liked ? (
                  <HeartIcon sx={{ fontSize: "28px", color: "red" }} />
                ) : (
                  <HeartBorderIcon sx={{ fontSize: "28px" }} />
                )}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    paddingLeft: "2px",
                    // position: "absolute",
                    transition: "transform 0.3s ease",
                    transform: animate
                      ? animateDirection === "up" // If likes are increasing, move up
                        ? "translateY(-100%)"
                        : "translateY(100%)" // If likes are decreasing, move down
                      : "translateY(0)",
                    opacity: animate ? 0 : 1,
                  }}
                  key={numLikes} // Helps with animation triggering
                >
                  {numLikes} {/* Assuming likeCount is passed as a prop */}
                </Typography>
              </IconButton>
            </Tooltip>

            <Tooltip title="Comments" placement="bottom" arrow>
              <IconButton
                sx={{
                  height: "48px",
                  width: "48px",
                  alignSelf: "center",
                  marginBottom: "8px",
                }}
                aria-label="comments"
                onClick={handleCommentsClick}
              >
                <InsertCommentRoundedIcon sx={{ fontSize: "28px" }} />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  style={{ paddingLeft: "2px" }}
                >
                  {numComments}
                </Typography>
              </IconButton>
            </Tooltip>
            <CommentsMenu
              isOpen={showComments}
              anchorEl={anchorEl}
              onClose={() => setShowComments(false)}
              articleURL={props.link}
              setNumComments={setNumComments}
            />

            <Tooltip title="Share" placement="bottom" arrow>
              <IconButton
                sx={{
                  height: "48px",
                  width: "48px",
                  alignSelf: "center",
                }}
                aria-label="share"
                onClick={() => setShowShareDialog(true)}
              >
                <ShareIcon sx={{ fontSize: "28px" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Share Dialog */}
        {showShareDialog && (
          <div ref={shareDialogRef}>
            <ShareDialog
              link={props.link}
              onClose={() => setShowShareDialog(false)}
              id="share-dialog"
            />
          </div>
        )}
      </Card>
    </Box>
  </>
);
};

export default FeedNewsCard;