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
import HeartBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareButton from "@mui/icons-material/Share";
import CommentIcon from "@mui/icons-material/Comment";
import ShareDialog from "./ShareDialog";

const NewsCard = (props) => {
  const { mode } = useContext(ThemeContext);
  const location = useLocation();
  const isSearchPage =
    location.pathname === "/search" || location.pathname === "/myfeed";

  const [showShareDialog, setShowShareDialog] = useState(false);
  const shareDialogRef = useRef(null);
  const navigate = useNavigate();



  const loginPage = () => {
    navigate("/login");
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

              <Tooltip title="click" placement="top" TransitionComponent={Zoom} arrow>
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  onClick={loginPage}
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
            <Box sx={{ display: "flex", justifyContent: "flex-start", pl: 2, mt: -1 }}>
              <Typography variant="caption" color="text.secondary" fontSize="medium">
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
              <Tooltip title="Bookmark" arrow>
                <IconButton onClick={loginPage}>
                  <BookmarkBorderIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Like" arrow>
                <IconButton onClick={loginPage}>
                  <HeartBorderIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Comments" arrow>
                <IconButton onClick={loginPage}>
                  <CommentIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Share" arrow>
                <IconButton onClick={() => setShowShareDialog(true)}>
                  <ShareButton />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {showShareDialog && (
            <Box ref={shareDialogRef}>
              <ShareDialog
                open={showShareDialog}
                onClose={() => setShowShareDialog(false)}
                link={props.link}
              />
            </Box>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default NewsCard;