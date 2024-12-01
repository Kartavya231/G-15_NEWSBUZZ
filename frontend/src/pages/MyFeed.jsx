// import React, { useEffect, useState, useContext, useRef, useCallback, useMemo } from 'react';
// import NewsCard from '../components/NewsCard';
// import Skeleton from '@mui/material/Skeleton';
// import InputAdornment from '@mui/material/InputAdornment';
// import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
// import TextField from '@mui/material/TextField';
// import { Box, Grid } from '@mui/material';
// import { ThemeContext } from '../context/ThemeContext';
// import { GET } from "../api.js";
// import { Stack } from 'react-bootstrap';

// const MyFeed = () => {
//   const { mode } = useContext(ThemeContext);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [articles, setArticles] = useState([]);
//   const [filteredArticles, setFilteredArticles] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [pageIndex, setPageIndex] = useState(0);
//   const observerRef = useRef(null);

//   // URLs to fetch articles from (based on pageIndex)
//   const urls = useMemo(() => {
//     return [
//       "/api/myfeed/getmyfeed/text/1",
//       "/api/myfeed/getmyfeed/text/2",
//       "/api/myfeed/getmyfeed/text/3",
//       "/api/myfeed/getmyfeed/text/4",
//       "/api/myfeed/getmyfeed/topic/1",
//       "/api/myfeed/getmyfeed/topic/2"
//     ];
//   }, []);

//   // Function to load more articles
//   const loadMoreArticles = useCallback(async () => {
//     if (pageIndex >= urls.length || isLoading) return; // Prevent further loading if no more URLs or if loading

//     setIsLoading(true);
//     try {
//       const response = await GET(urls[pageIndex]);
//       if (response.data.success === false) {
//         throw new Error("No more articles found");
//       }

//       const newArticles = response.data?.partialArticles || [];
//       setArticles((prevArticles) => [...prevArticles, ...newArticles]);
//       setPageIndex((prevIndex) => prevIndex + 1); // Move to next URL
//     } catch (error) {
//       setIsError(true);
//       console.error("GET request error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [pageIndex, isLoading, urls]);

//   // Filtering articles based on search query
//   useEffect(() => {
//     setFilteredArticles(
//       articles.filter(article =>
//         article.title.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     );
//   }, [searchQuery, articles]);

//   // Scroll event listener to trigger API call at 75% scroll
//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollPosition = window.scrollY + window.innerHeight;
//       const threshold = document.documentElement.scrollHeight * 0.75;

//       if (scrollPosition >= threshold && !isLoading) {
//         loadMoreArticles();
//       }
//     };

//     window.addEventListener('scroll', handleScroll);

//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, [loadMoreArticles, isLoading]);

//   // Initial load of articles
//   useEffect(() => {
//     loadMoreArticles();
//     // eslint-disable-next-line
//   }, []); // Empty dependency array to run only once on mount

//   return (
//     <>
//       <div style={{ marginTop: "130px" }}>
//         <Box
//           sx={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             padding: '10px',
//             borderRadius: '25px',
//             transition: 'width 0.25s ease-in-out',
//           }}
//         >
//           <TextField
//             hiddenLabel
//             variant="outlined"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search from given articles..."
//             sx={{
//               m: 1,
//               width: '400px',
//               height: '100%',
//               borderRadius: '25px',
//               bgcolor: mode === 'dark' ? '#444' : 'rgb(251, 248, 248)',
//               transition: 'width 0.25s ease-in-out',
//               "& .MuiOutlinedInput-root": {
//                 borderRadius: '25px',
//                 "& fieldset": {
//                   borderColor: "transparent",
//                 },
//                 "&:hover fieldset": {
//                   borderColor: "transparent",
//                 },
//                 "&.Mui-focused fieldset": {
//                   borderColor: "transparent",
//                 },
//               },
//               "&:hover": {
//                 bgcolor: mode === 'dark' ? '#555' : 'rgb(240, 240, 240)',
//               },
//               '&:focus-within': {
//                 width: '600px',
//                 bgcolor: mode === 'dark' ? '#555' : 'rgb(240, 240, 240)',
//                 '& .MuiInputAdornment-root .MuiSvgIcon-root': {
//                   color: 'blue',
//                   transform: 'scale(1.4) rotateY(360deg)',
//                   transition: 'transform 1.1s ease-in-out, color 0.3s ease-in-out',
//                 },
//               },
//             }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchRoundedIcon />
//                 </InputAdornment>
//               ),
//               sx: {
//                 "&::placeholder": {
//                   color: mode === 'dark' ? '#bbb' : '#888',
//                 },
//               },
//             }}
//           />
//         </Box>

//         {filteredArticles.map((article, index) => (
//           <Grid item xs={12} sm={12} md={12} lg={12} xl={6} key={index} className="card_1" sx={{ width: "100%", height: "210px" }}>
//             <NewsCard
//               title={article.title}
//               someText={article.someText}
//               imgURL={article.imgURL}
//               link={article.link}
//               time={article.time}
//               providerImg={article.providerImg}
//               providerName={article.providerName}
//             />
//           </Grid>
//         ))}

//         {isLoading && (
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'center', // Centers horizontally
//               alignItems: 'center',     // Centers vertically
//               minHeight: '50vh',        // Minimum height to ensure vertical centering
//               width: '100%',            // Takes full width
//             }}
//           >
//             <Stack spacing={2} sx={{ width: '100%', alignItems: 'center' }}> {/* Center stack items horizontally */}
//               {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
//                 <Box
//                   key={index}
//                   sx={{
//                     display: 'flex',
//                     justifyContent: 'center',  // Centers the Skeleton inside the Box
//                     width: '100%',
//                     marginY: 1.4,
//                   }}
//                 >
//                   <Skeleton
//                     animation="wave"
//                     variant="rounded"
//                     width="80%"       // Use percentage width for Skeleton
//                     height={160}
//                     sx={{ maxWidth: 800 }} // Limit the max width
//                   />
//                 </Box>
//               ))}
//             </Stack>
//           </Box>
//         )}

//         {
//           isError && (
//             <div className="alert alert-warning" role="alert" style={{ width: "50%", margin: "0 auto", zIndex: -1 }}>
//               Error fetching articles.
//             </div>
//           )
//         }

//         {/* Observer target for infinite scrolling */}
//         <div ref={observerRef} style={{ height: '50px', marginTop: '20px' }}></div>
//       </div>
//     </>
//   );
// };

// export default MyFeed;

import React, { useEffect, useState, useContext, useRef, useCallback, useMemo } from 'react';
import FeedNewsCard from '../components/FeedNewsCard.jsx';
import Skeleton from '@mui/material/Skeleton';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import TextField from '@mui/material/TextField';
import { Box, Grid } from '@mui/material';
import { ThemeContext } from '../context/ThemeContext';
import { GET } from "../api.js";
import { Stack } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const parentstyle = {
  // backgroundColor:"black",
  marginTop: "100px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "5px",
  margin: "5px",
};
const MyFeed = () => {
  const { mode } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
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
        // toast.error(response.data.message);
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

  // Filtering articles based on search query
  useEffect(() => {
    setFilteredArticles(
      articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, articles]);

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
                {filteredArticles.map((article, index) => (
                  <FeedNewsCard
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
              justifyContent: "center", // Centers horizontally
              alignItems: "center", // Centers vertically
              minHeight: "50vh", // Minimum height to ensure vertical centering
              width: "100%", // Takes full width
            }}
          >
            <Stack spacing={2} sx={{ width: "100%", alignItems: "center" }}>
              {" "}
              {/* Center stack items horizontally */}
              {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "center", // Centers the Skeleton inside the Box
                    width: "100%",
                    marginY: 1.4,
                  }}
                >
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width="80%" // Use percentage width for Skeleton
                    height={160}
                    sx={{ maxWidth: 800 }} // Limit the max width
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