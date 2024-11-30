import React, { useEffect, useState, useContext } from "react";
import NewsCard from "../components/NewsCard";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { ThemeContext } from "../context/ThemeContext";

const SearchResults = ({ articles = [], query = "" }) => {
  const { mode } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);

  // Filter articles based on the search query
  useEffect(() => {
    setFilteredArticles(
      articles.filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, articles]);

  return (
    <>
      <div style={{ marginTop: "130px" }}>
        <h1>Search Results for "{query}"</h1>

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

        {articles.length === 0 ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Stack
              spacing={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
                <Skeleton
                  animation="wave"
                  key={index}
                  variant="rounded"
                  width={800}
                  height={160}
                />
              ))}
            </Stack>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div
            className="alert alert-warning"
            role="alert"
            style={{
              width: "40%",
              margin: "0 auto",
              zIndex: -1,
              textAlign: "center",
            }}
          >
            Looks like the news has left you hanging. Try a better search!
          </div>
        ) : (
          <div>
            {filteredArticles.map((article, index) => (
              <div key={index}>
                <NewsCard
                  title={article.title}
                  someText={article.someText}
                  imgURL={article.imgURL}
                  link={article.link}
                  time={article.time}
                  providerImg={article.providerImg}
                  providerName={article.providerName}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResults;
