import React, { useEffect, useRef, useState, useContext } from "react";
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
import ShareButton from "@mui/icons-material/Share";
import ShareDialog from "./ShareDialog";
import CommentsMenu from "./CommentsMenu";

const NewsCard = (props) => {
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

  // Simulating local states for bookmarks and likes
  const handleBookmarkClick = () => {
    setBookmarked(!bookmarked);
    // Simulate adding/removing bookmark functionality without backend
    alert(
      bookmarked
        ? "Bookmark removed (simulated)"
        : "Bookmark added (simulated)"
    );
  };

  const handleLikeClick = () => {
    const updatedLikes = liked ? numLikes - 1 : numLikes + 1;
    setLiked(!liked);
    setNumLikes(updatedLikes);
    alert(
      liked
        ? "Like removed (simulated)"
        : "Like added (simulated)"
    );
  };

  const handleCommentsClick = (event) => {
    alert("Comments feature not functional without backend.");
  };

  const handleClickOutside = (event) => {
    if (
      shareDialogRef.current &&
      !shareDialogRef.current.contains(event.target)
    ) {
      setShowShareDialog(false);
    }
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
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: 800,
        margin: "20px auto",
        position: "relative",
        "&:hover .action-buttons": {
          opacity: 1,
          visibility: "visible",
        },
        width: "100%",
        height: "100%",
      }}
    >
      <Box sx={{ flex: 1, maxWidth: 850 }}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            border: "none",
            boxShadow: "none",
            width: "100%",
            backgroundColor:
              mode === "light" ? "rgb(246, 246, 246)" : "rgb(50, 50, 50)",
            "&:hover": {
              backgroundColor:
                mode === "light" ? "rgb(240, 240, 240)" : "rgb(60, 60, 60)",
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
                  }}
                >
                  {props.title}
                </Typography>
              </Tooltip>

              {props.someText && (
                <Typography variant="body2" color="text.secondary">
                  {props.someText}
                </Typography>
              )}
            </CardContent>

            {props.imgURL && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 2,
                  width: "100%",
                  maxWidth: "150px",
                }}
              >
                <img
                  src={props.imgURL}
                  alt="Article"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "150px",
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                pl: 2,
                mt: -1,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontSize="medium"
              >
                {props.time}
              </Typography>
            </Box>
            <Box
              className="action-buttons"
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                opacity: 0,
                transition: "opacity 0.2s ease",
                visibility: "hidden",
              }}
            >
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
                    sx={{ paddingLeft: "2px" }}
                  >
                    {numLikes}
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

              <Tooltip title="Share" placement="bottom" arrow>
                <IconButton
                  sx={{
                    height: "48px",
                    width: "48px",
                    alignSelf: "center",
                    marginBottom: "8px",
                  }}
                  aria-label="share"
                  onClick={() => setShowShareDialog(true)}
                >
                  <ShareButton sx={{ fontSize: "28px" }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Card>
      </Box>
      <ShareDialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        articleURL={props.link}
      />
    </Box>
  );
};

export default NewsCard;
