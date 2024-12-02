import React, { useContext, useEffect } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded"; // Import history icon
import { ThemeContext } from "../context/ThemeContext";
import feedImgDark from "../images/feed_dark.png";
import feedImgLight from "../images/feed_light.png";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import following_light from "../images/following_light.png";
import following_dark from "../images/following_dark.png";

const NAVIGATION = [
  { title: "Home", icon: <HomeRoundedIcon />, path: "/" },
  { title: "Feed", icon: "feedImg", path: "/myfeed" },
  { title: "Following", icon: "followingImg", path: "/providers/following" },
  { title: "Bookmark", icon: <BookmarkRoundedIcon />, path: "/bookmark" },
  { title: "History", icon: <HistoryRoundedIcon />, path: "/history" }, // Add history icon and path
  { kind: "divider" },
  { title: "Account", icon: <AccountCircleRoundedIcon />, path: "/account" },
];

const SidebarNavigation = ({ open, setOpen }) => {
  const { mode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = React.useState(false);

  const toggleDrawer = (state) => () => setOpen(state);
  const feedImg = mode === "light" ? feedImgDark : feedImgLight;
  const followingImg = mode === "light" ? following_light : following_dark;
  useEffect(() => {
    if (window.localStorage.getItem("token") === null) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, [loggedIn]);
  const loginPage = () => {
    navigate("/login");
  }

  return (
    <>
      <Toolbar>
        <IconButton
          onClick={toggleDrawer(!open)}
          sx={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 1300,
            backgroundColor: mode === "dark" ? "#333" : "#fff",
            color: mode === "dark" ? "#fff" : "#333",
            "&:hover": {
              backgroundColor: mode === "dark" ? "#555" : "#eee",
            },
            transition: "background-color 0.3s ease",
          }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer
        variant="permanent"
        open={true}
        sx={{
          position: "center",
          width: open ? 240 : 60,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? 240 : 80,
            boxSizing: "border-box",
            background: mode === "dark" ? "#121212" : "#f9f9f9",
            color: mode === "dark" ? "#fff" : "#000",
            borderRight: `1px solid ${mode === "dark" ? "#444" : "#ddd"}`,
            transition: "width 0.3s ease",
          },
        }}
      >
        <Toolbar />
        <List>
          {NAVIGATION.map((item, index) =>
            item.kind === "divider" ? (
              <Divider
                key={index}
                sx={{ borderColor: mode === "dark" ? "#444" : "#ddd" }}
              />
            ) : (
              <ListItem
                button
                key={item.title}
                onClick={loggedIn ? (() => navigate(item.path)) : loginPage}
                sx={{
                  "&:hover": {
                    backgroundColor: mode === "dark" ? "#333" : "#eee",
                  },
                  padding: "10px 16px",
                  marginBottom: "4px",
                  borderRadius: "8px",
                  transition: "background-color 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Tooltip title={!open ? item.title : ""} placement="right">
                  <ListItemIcon
                    sx={{
                      color: mode === "dark" ? "#fff" : "#000",
                      minWidth: 0,
                      marginRight: open ? "16px" : "0",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon === "feedImg" ? (
                      <img
                        src={feedImg}
                        alt="feed icon"
                        style={{ width: 30, height: 30, position: "center" }}
                      />
                    ) : item.icon === "followingImg" ? (
                      <img
                        src={followingImg}
                        alt="following icon"
                        style={{ width: 30, height: 30 }}
                      />
                    ) : (
                      React.cloneElement(item.icon, { fontSize: "large" })
                    )}
                  </ListItemIcon>
                </Tooltip>
                {open && (
                  <ListItemText
                    primary={item.title}
                    sx={{
                      color: mode === "dark" ? "#fff" : "#000",
                      marginLeft: "8px",
                      fontWeight: 500,
                    }}
                  />
                )}
              </ListItem>
            )
          )}
        </List>
      </Drawer >
    </>
  );
};

export default SidebarNavigation;