import React, { useState, useRef, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
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
import HeartIcon from "@mui/icons-material/Favorite";
import HeartBorderIcon from "@mui/icons-material/FavoriteBorder";
import InsertCommentRoundedIcon from "@mui/icons-material/InsertCommentRounded";
import ShareDialog from "./ShareDialog";
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
  const [animateDirection, setAnimateDirection] = useState(null);
  const [animate, setAnimate] = useState(false);
  const shareDialogRef = useRef(null);

  const handleBookmarkClick = () => {
    setBookmarked(!bookmarked);
  };

  const handleLikeClick = () => {
    setAnimate(true);
    setLiked(!liked);

    const newNumLikes = liked ? numLikes - 1 : numLikes + 1;
    setNumLikes(newNumLikes);

    setAnimateDirection(liked ? "down" : "up");
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
  const [showComments, setShowComments] = useState(false);

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

  return (
    <>
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
            backgroundColor: mode === "light" ? "rgb(246, 246, 246)" : "rgb(50, 50, 50)",
            "&:hover": {
              backgroundColor: mode === "light" ? "rgb(240, 240, 240)" : "rgb(60, 60, 60)",
            },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <CardContent sx={{ flex: 1 }}>
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

              <Box sx={{ width: "100%", height: "300px" }}>
                {props.imgURL && (
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      height: "300px",
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

          {props.someText && (
            <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
              {props.someText}
            </Typography>
          )}

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
                  sx={{ height: "48px", width: "48px" }}
                  onClick={handleBookmarkClick}
                >
                  {bookmarked ? (
                    <BookmarkIcon sx={{ fontSize: "28px", color: "primary.main" }} />
                  ) : (
                    <BookmarkBorderIcon sx={{ fontSize: "28px" }} />
                  )}
                </IconButton>
              </Tooltip>

              <Tooltip title="Like" placement="bottom" arrow>
                <IconButton
                  sx={{ height: "48px", width: "48px" }}
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
                      transition: "transform 0.3s ease",
                      transform: animate
                        ? animateDirection === "up"
                          ? "translateY(-100%)"
                          : "translateY(100%)"
                        : "translateY(0)",
                      opacity: animate ? 0 : 1,
                    }}
                    key={numLikes}
                  >
                    {numLikes}
                  </Typography>
                </IconButton>
              </Tooltip>

              <Tooltip title="Comments" placement="bottom" arrow>
                <IconButton
                  sx={{ height: "48px", width: "48px" }}
                  onClick={handleCommentsClick}
                >
                  <InsertCommentRoundedIcon sx={{ fontSize: "28px" }} />
                  <Typography variant="caption" color="text.secondary">
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
                  sx={{ height: "48px", width: "48px" }}
                  onClick={() => setShowShareDialog(true)}
                >
                  <ShareIcon sx={{ fontSize: "28px" }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Card>
      </Box>

      <ShareDialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        link={props.link}
        article={props.title}
        ref={shareDialogRef}
      />
    </>
  );
};

export default FeedNewsCard;
