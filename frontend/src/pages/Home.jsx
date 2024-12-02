import React, { useEffect, useState, useContext } from "react";
import { GET } from "../api.js";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { ThemeContext } from "../context/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import UnLoggedNewsCard from "../components/UnLoggedNewsCard.jsx";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
gsap.registerPlugin(ScrollTrigger);

const parentstyle = {
  // backgroundColor:"black",
  marginTop: "100px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "5px",
  margin: "5px",
};

const Home = () => {
  const { mode } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status
  const navigator = useNavigate();
  const PAGE_SIZE = 15;
  console.log("Home.jsx");

  const isLoggedIn = localStorage.getItem('token') != null;


  const LoginPage = () => {
    navigator("/login");
  };

  const {
    data: articles = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["top_stories"],
    queryFn: async () => {
      const resultFromBackend = await GET("/api/algorithms/top_stories");
      // console.log(resultFromBackend.data);
      // console.log(localStorage.getItem('token'));

      if (resultFromBackend.data?.success) {
        return resultFromBackend.data.articles;
      } else if (isLoggedIn != null && resultFromBackend.data?.caught) {
        // toast.error(resultFromBackend.data?.message);
        // console.log("caught");
        navigator("/login");
      }
      else {
        throw new Error("Error fetching data from backend");
      }
    },
    onError: (error) => {
      console.error("GET request error:", error);
    },
    staleTime: 6000000,
    cacheTime: 6000000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  useEffect(() => {
    const filtered = articles.filter((article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredArticles(filtered);
    setDisplayedArticles(filtered.slice(0, PAGE_SIZE));
    setHasMore(filtered.length > PAGE_SIZE);
  }, [searchQuery, articles]);


  const loadMoreArticles = () => {
    setTimeout(() => {
      const currentLength = displayedArticles.length;
      const moreArticles = filteredArticles.slice(
        currentLength,
        currentLength + PAGE_SIZE
      );
      setDisplayedArticles((prevArticles) => [
        ...prevArticles,
        ...moreArticles,
      ]);
      setHasMore(currentLength + PAGE_SIZE < filteredArticles.length);
    }, 500);
  };

  return (
    <div style={{ overflow: "visible", marginTop: "130px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          borderRadius: "25px",
          transition: "width 0.25s ease-in-out",
        }}
      >
        <TextField
          hiddenLabel
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search from given articles..."
          sx={{
            m: 1,
            width: "400px",
            height: "100%",
            borderRadius: "25px",
            bgcolor: mode === "dark" ? "#444" : "rgb(251, 248, 248)",
            transition: "width 0.25s ease-in-out",
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: "transparent",
              },
              "&.Mui-focused fieldset": {
                borderColor: "transparent",
              },
            },
            "&:hover": {
              bgcolor: mode === "dark" ? "#555" : "rgb(240, 240, 240)",
            },
            "&:focus-within": {
              width: "600px",
              bgcolor: mode === "dark" ? "#555" : "rgb(240, 240, 240)",
              "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                color: "blue",
                transform: "scale(1.4) rotateY(360deg)",
                transition:
                  "transform 1.1s ease-in-out, color 0.3s ease-in-out",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon />
              </InputAdornment>
            ),
            sx: {
              "&::placeholder": {
                color: mode === "dark" ? "#bbb" : "#888",
              },
            },
          }}
        />
      </Box>
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Stack spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
            {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
              <Skeleton
                animation="wave"
                key={index}
                variant="rounded"
                width={800}
                height={140}
              />
            ))}
          </Stack>
        </div>
      ) : isError ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span>Error fetching articles.</span>
        </div>
      ) : (
        <>

          <div style={{ marginTop: "50px" }}>
            <Grid container>
              <Grid
                item
                md={12}
                xs={9}
                sm={10}
                sx={{ position: "relative" }}
                style={parentstyle}
              >
                <Grid
                  container
                  spacing={300} // This adds space between each card (Grid items)
                  style={{
                    // backgroundColor:"black",
                    padding: "5px",
                    margin: "5px",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {displayedArticles.map(
                    (article, index) =>
                      article && (
                        <UnLoggedNewsCard
                          title={article.title.substring(0, 90) + "..."}
                          link={article.link}
                          time={article.time}
                          providerImg={article.providerImg}
                        />
                      )
                  )}
                </Grid>
              </Grid>
            </Grid>
          </div>


          {!isLoggedIn && (
            <button

              type="submit"
              style={{
                fontFamily: "'Quicksand', 'Arial', sans-serif",
                fontWeight: "bold",
                borderRadius: "12px",
                backgroundColor: "#134611",
                color: "white",
                cursor: "pointer",
                width: "100%",
                padding: "10px",
              }}
              onClick={LoginPage}
            >
              Login to view more articles
            </button>
          )}
    </div>
  );
};

export default Home;
