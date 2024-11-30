import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import NewsCard from "../components/NewsCard";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { ThemeContext } from "../context/ThemeContext";
import config from "../config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Fetch function for react-query to retrieve articles

const SearchResults = (props) => {
  const { mode } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const navigate = useNavigate();

  const { q, site, tbs, gl, location } = props.queries;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["searchResults", q, site, tbs, gl, location],
    queryFn: fetchSearchResults,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.noMoreData ? undefined : allPages.length,
    staleTime: 6000000,
    cacheTime: 6000000,
    refetchOnWindowFocus: false,
  });

  const articles = useMemo(() => {
    return data ? data.pages.flatMap((page) => page.articles) : [];
  }, [data]);

  // Filter articles based on the search query
  useEffect(() => {
    setFilteredArticles(
      articles.filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, articles]);

  // Function to trigger fetch when scrolled past 75%
  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    if (
      (scrollTop + windowHeight) / fullHeight >= 0.75 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Attach scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const fetchSearchResults = async ({ pageParam = 0, queryKey }) => {
    // eslint-disable-next-line
    const [_unused, q, site, tbs, gl, location] = queryKey;
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${config.BACKEND_API}/api/search/${pageParam}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: token ? `Bearer ${token}` : "",
        },
        params: { q, site, tbs, gl, location },
      }
    );

    if (response.data.success) {
      const articles = response.data?.articles;

      // Return message if no articles are found
      if (!articles || articles.length === 0) {
        return {
          articles: [],
          noMoreData: true,
          endMessage: "No more articles to show",
        };
      }

      return { articles, noMoreData: false, endMessage: "" };
    } else if (response.data?.caught) {
      // toast.error(response.data.message);
      navigate("/login");
      return;
    }
  };

  return (
    <>
      <div style={{ marginTop: "130px" }}>
        <h1>Search Results for "{q}"</h1>

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
        ) : isError ? (
          <div className="alert alert-warning" role="alert">
            Error fetching results for "{q}"
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
          <>
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
            {isFetchingNextPage && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <Skeleton
                  animation="wave"
                  variant="rounded"
                  width={800}
                  height={160}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SearchResults;
