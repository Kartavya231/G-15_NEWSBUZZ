import {
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
const HistoryNewsCard = (props) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const { mode } = useContext(ThemeContext);

  return (
    <>
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
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            border: "none",
            boxShadow: "none",
            width: "100%",
            height: "150px",
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
              {/* Provider Image and Name */}
              {/* <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "100%",
                  height: "40px",
                  overflow: "hidden",
                }}
              >
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
              </div> */}

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
                  // onClick={handleClick}
                  sx={{
                    cursor: "pointer",
                    color: "rgb(30, 144, 255)",
                    "&:hover": { color: mode === "light" ? "blue" : "white" },
                  }}
                >
                  {props.title}
                </Typography>
              </Tooltip>

              {/* Some Text */}
              {props.someText && (
                <Typography variant="body2" color="text.secondary">
                  {props.someText}
                </Typography>
              )}
            </CardContent>

            {/* Article Image
            {props.imgURL && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 2,
                }}
              >
                <img
                  src={props.imgURL}
                  alt="Article"
                  style={{
                    maxWidth: "150px",
                    maxHeight: "150px",
                    objectFit: "cover",
                  }}
                />
              </Box>
            )} */}
          </Box>

          {/* Time Display */}
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
                {formatDate(props.time)}
              </Typography>
            </Box>

          </Box>
        </Card>
      </Box>
    </>
  );
};

export default HistoryNewsCard;
