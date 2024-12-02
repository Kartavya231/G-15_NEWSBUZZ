import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Link,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Fade,
  Slide,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import DeleteIcon from "@mui/icons-material/Delete";

function NewsChannelCard({ id, name, baseUrl, logo, followers, onDelete }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setOpenDialog(false);
    setIsDeleting(true);
    // Add a slight delay to allow the animation to complete
    // setTimeout(() => {
      onDelete(id);
    // }, 300);
  };

  return (
    <>
      <Slide in={!isDeleting} direction="up" timeout={300}>
        <Fade in={!isDeleting} timeout={300}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "all 0.3s ease-in-out",
              transform: isDeleting
                ? "scale(0.9) translateY(20px)"
                : "scale(1) translateY(0)",
              opacity: isDeleting ? 0 : 1,
              "&:hover": {
                transform: isDeleting
                  ? "scale(0.9) translateY(20px)"
                  : "translateY(-4px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              },
              position: "relative",
            }}
            className="shadow-sm"
          >
            <IconButton
              onClick={() => setOpenDialog(true)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  color: "#dc3545",
                  transform: "rotate(90deg)",
                },
                transition: "all 0.2s ease-in-out",
                zIndex: 1,
              }}
              className="btn-light"
              size="small"
            >
              <DeleteIcon />
            </IconButton>

            <CardMedia
              component="img"
              height="200"
              image={logo}
              alt={`${name} logo`}
              sx={{
                objectFit: "cover",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                gutterBottom
                variant="h6"
                component="h2"
                sx={{
                  fontWeight: "bold",
                  color: "#1a73e8",
                }}
              >
                {name}
              </Typography>
              <Link
                href={baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#1a73e8",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {baseUrl}
              </Link>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 2,
                  backgroundColor: "#f8f9fa",
                  padding: "8px",
                  borderRadius: "8px",
                }}
              >
                <PeopleIcon sx={{ fontSize: 20, mr: 1, color: "#1a73e8" }} />
                <Typography variant="body2" sx={{ color: "#1a73e8" }}>
                  {followers.toLocaleString()} followers
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Slide>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        TransitionComponent={Fade}
        transitionDuration={300}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#f8f9fa",
            pb: 2,
            color: "#dc3545",
          }}
        >
          Delete Channel
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            Are you sure you want to delete "<strong>{name}</strong>"? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#f8f9fa", p: 2 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{
              "&:hover": {
                backgroundColor: "#f8f9fa",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            className="btn btn-danger"
            sx={{
              "&:hover": {
                backgroundColor: "#dc3545",
                transform: "translateY(-2px)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default NewsChannelCard;
