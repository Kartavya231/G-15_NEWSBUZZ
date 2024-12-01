import React, { useEffect, useState, useContext, useRef, useCallback, useMemo } from 'react';
import FeedNewsCard from '../components/FeedNewsCard.jsx';
import Skeleton from '@mui/material/Skeleton';
import { Box, Grid } from '@mui/material';
import { ThemeContext } from '../context/ThemeContext';
import { GET } from "../api.js";
import { Stack } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const parentstyle = {
  marginTop: "100px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "5px",
  margin: "5px",
};

const MyFeed = () => {
  const { mode } = useContext(ThemeContext);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const observerRef = useRef(null);
  const navigate = useNavigate();

  // URLs to fetch articles from (based on pageIndex)
  const urls = useMemo(() => {
    return [
      "/api/myfeed/getmyfeed/text/1",
      "/api/myfeed/getmyfeed/text/2",
      "/api/myfeed/getmyfeed/text/3",
      "/api/myfeed/getmyfeed/text/4",
      "/api/myfeed/getmyfeed/topic/1",
      "/api/myfeed/getmyfeed/topic/2"
    ];
  }, []);

  // Function to load more articles
  const loadMoreArticles = useCallback(async () => {
    const checkauth = await GET("/api/checkauth");

    if (checkauth.data?.caught) {
      toast.error(checkauth.data.message);
      navigate("/login");
      return;
    }

    if (pageIndex >= urls.length || isLoading) return; // Prevent further loading if no more URLs or if loading

    setIsLoading(true);
    try {
      const response = await GET(urls[pageIndex]);
      if (response.data.success === false) {
        throw new Error("No more articles found");
      }
      if (response.data?.caught) {
        navigate("/login");
      }

      const newArticles = response.data?.partialArticles || [];
      setArticles((prevArticles) => [...prevArticles, ...newArticles]);
      setPageIndex((prevIndex) => prevIndex + 1); // Move to next URL
    } catch (error) {
      setIsError(true);
      console.error("GET request error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pageIndex, isLoading, urls, navigate]);

  // Scroll event listener to trigger API call at 75% scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const threshold = document.documentElement.scrollHeight * 0.75;

      if (scrollPosition >= threshold && !isLoading) {
        loadMoreArticles();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMoreArticles, isLoading]);

  // Initial load of articles
  useEffect(() => {
    loadMoreArticles();
    // eslint-disable-next-line
  }, []); // Empty dependency array to run only once on mount

  return (
    <>
      <div style={{ marginTop: "130px" }}>
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
                spacing={300}
                style={{
                  padding: "5px",
                  margin: "5px",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {articles.map((article, index) => (
                  <FeedNewsCard
                    key={index}
                    title={article.title}
                    someText={article.someText}
                    imgURL={article.imgURL}
                    link={article.link}
                    time={article.time}
                    providerImg={article.providerImg}
                    providerName={article.providerName}
                  />
                ))}
              </Grid>
            </Grid>
          </Grid>
        </div>

        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
              width: "100%",
            }}
          >
            <Stack spacing={2} sx={{ width: "100%", alignItems: "center" }}>
              {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    marginY: 1.4,
                  }}
                >
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width="80%"
                    height={160}
                    sx={{ maxWidth: 800 }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {isError && (
          <div
            className="alert alert-warning"
            role="alert"
            style={{ width: "50%", margin: "0 auto", zIndex: -1 }}
          >
            Error fetching articles.
          </div>
        )}

        {/* Observer target for infinite scrolling */}
        <div
          ref={observerRef}
          style={{ height: "50px", marginTop: "20px" }}
        ></div>
      </div>
    </>
  );
};

export default MyFeed;
