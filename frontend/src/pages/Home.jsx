// import React, { useEffect, useState, useContext } from "react";
// import { GET } from "../api.js";
// import Skeleton from "@mui/material/Skeleton";
// import Stack from "@mui/material/Stack";
// import InputAdornment from "@mui/material/InputAdornment";
// import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
// import TextField from "@mui/material/TextField";
// import Box from "@mui/material/Box";
// import { ThemeContext } from "../context/ThemeContext";
// import { useQuery } from "@tanstack/react-query";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import InfiniteScroll from "react-infinite-scroll-component";
// import UnLoggedNewsCard from "../components/UnLoggedNewsCard.jsx";
// import { useNavigate } from "react-router-dom";
// gsap.registerPlugin(ScrollTrigger);

// function getWindowDimensions() {
//   const { innerWidth: width, innerHeight: height } = window;
//   // console.log(width, height);
//   return {
//     width,
//     height,
//   };
// }

// function useWindowDimensions() {
//   const [windowDimensions, setWindowDimensions] = useState(
//     getWindowDimensions()
//   );

//   useEffect(() => {
//     function handleResize() {
//       setWindowDimensions(getWindowDimensions());
//     }

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return windowDimensions;
// }

// const Home = () => {
//   const { mode } = useContext(ThemeContext);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredArticles, setFilteredArticles] = useState([]);
//   const [displayedArticles, setDisplayedArticles] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status
//   const navigator = useNavigate();
//   const PAGE_SIZE = 15;
//   useWindowDimensions();
//   // const { Height, Width } = getWindowDimensions();
//   const [innerheight, setInnerHeight] = useState(0);
//   const [innerwidth, setInnerWidth] = useState(0);
//   useEffect(() => {
//     setInnerHeight(window.innerHeight);
//     setInnerWidth(window.innerWidth);
//   }, [innerheight, innerwidth]);
//   // console.log( innerwidth, innerheight );


//   const [initialDevicePixelRatio] = useState(window.devicePixelRatio);

//   // Add a resize listener to detect zoom
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.devicePixelRatio !== initialDevicePixelRatio) {
//         window.location.reload(); // Reloads the page if zoom is detected
//       }
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [initialDevicePixelRatio]);


//   const LoginPage = () => {
//     navigator("/login");
//   };
//   const {
//     data: articles = [],
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["top_stories"],
//     queryFn: async () => {
//       const resultFromBackend = await GET("/api/algorithms/top_stories");
//       console.log(resultFromBackend);

//       if (resultFromBackend.data?.success) {
//         return resultFromBackend.data.articles;
//       } else {
//         throw new Error("Error fetching data from backend");
//       }
//     },
//     onError: (error) => {
//       console.error("GET request error:", error);
//     },
//     staleTime: 6000000,
//     cacheTime: 6000000,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//     retry: false,
//   });

//   useEffect(() => {
//     const filtered = articles.filter((article) =>
//       article.title.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setFilteredArticles(filtered);
//     setDisplayedArticles(filtered.slice(0, PAGE_SIZE));
//     setHasMore(filtered.length > PAGE_SIZE);
//   }, [searchQuery, articles]);

//   useEffect(() => {
//     gsap.defaults({ ease: "power3" });

//     ScrollTrigger.batch(".box", {
//       onEnter: (batch) =>
//         gsap.to(batch, {
//           opacity: 1,
//           y: 0,
//           stagger: { each: 0.15, grid: [1, 3] },
//           overwrite: true,
//         }),
//       onLeave: (batch) =>
//         gsap.set(batch, { opacity: 0, y: -100, overwrite: true }),
//       onEnterBack: (batch) =>
//         gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
//       onLeaveBack: (batch) =>
//         gsap.set(batch, { opacity: 0, y: 100, overwrite: true }),
//     });

//     return () => {
//       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//     };
//   }, [displayedArticles]);

//   const loadMoreArticles = () => {
//     setTimeout(() => {
//       const currentLength = displayedArticles.length;
//       const moreArticles = filteredArticles.slice(
//         currentLength,
//         currentLength + PAGE_SIZE
//       );
//       setDisplayedArticles((prevArticles) => [
//         ...prevArticles,
//         ...moreArticles,
//       ]);
//       setHasMore(currentLength + PAGE_SIZE < filteredArticles.length);
//     }, 500);
//   };

//   return (
//     <div style={{ overflow: "visible", marginTop: "130px" }}>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           padding: "10px",
//           borderRadius: "25px",
//           transition: "width 0.25s ease-in-out",
//         }}
//       >
//         <TextField
//           hiddenLabel
//           variant="outlined"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Search from given articles..."
//           sx={{
//             m: 1,
//             width: "400px",
//             height: "100%",
//             borderRadius: "25px",
//             bgcolor: mode === "dark" ? "#444" : "rgb(251, 248, 248)",
//             transition: "width 0.25s ease-in-out",
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "25px",
//               "& fieldset": {
//                 borderColor: "transparent",
//               },
//               "&:hover fieldset": {
//                 borderColor: "transparent",
//               },
//               "&.Mui-focused fieldset": {
//                 borderColor: "transparent",
//               },
//             },
//             "&:hover": {
//               bgcolor: mode === "dark" ? "#555" : "rgb(240, 240, 240)",
//             },
//             "&:focus-within": {
//               width: "600px",
//               bgcolor: mode === "dark" ? "#555" : "rgb(240, 240, 240)",
//               "& .MuiInputAdornment-root .MuiSvgIcon-root": {
//                 color: "blue",
//                 transform: "scale(1.4) rotateY(360deg)",
//                 transition:
//                   "transform 1.1s ease-in-out, color 0.3s ease-in-out",
//               },
//             },
//           }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchRoundedIcon />
//               </InputAdornment>
//             ),
//             sx: {
//               "&::placeholder": {
//                 color: mode === "dark" ? "#bbb" : "#888",
//               },
//             },
//           }}
//         />
//       </Box>
//       {isLoading ? (
//         <div style={{ display: "flex", justifyContent: "center" }}>
//           <Stack spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
//             {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
//               <Skeleton
//                 animation="wave"
//                 key={index}
//                 variant="rounded"
//                 width={800}
//                 height={140}
//               />
//             ))}
//           </Stack>
//         </div>
//       ) : isError ? (
//         <div style={{ display: "flex", justifyContent: "center" }}>
//           <span>Error fetching articles.</span>
//         </div>
//       ) : (
//         <>
//           <div
//             className="news-grid"
//             style={{
//               display: "grid",
//               gridTemplateColumns:
//                 innerwidth >= 2752 && innerheight >= 2244
//                   ? "repeat(4,1fr)"
//                   : innerwidth >= 1376 && innerheight >= 1122
//                     ? "repeat(3, 1fr)"
//                     : (innerwidth >= 1223 && innerheight >= 997) ||
//                       (innerwidth >= 1147 && innerheight >= 935)
//                       ? "repeat(2,1fr)"
//                       : "1fr",
//               gap: "1rem",
//               alignItems: "start",
//             }}
//           >
//             {displayedArticles.map(
//               (article, index) =>
//                 article && (
//                   <div
//                     className="box"
//                     key={index}
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                     }}
//                   >
//                     <UnLoggedNewsCard
//                       title={article.title}
//                       link={article.link}
//                       time={article.time}
//                       providerImg={article.providerImg}
//                     />
//                   </div>
//                 )
//             )}
//           </div>

//           {/* <style jsx>{`
//             @media screen and (max-width: 900px) {
//               .news-grid {
//                 grid-template-columns: repeat(2, 1fr);
//               }
//             }

//             @media (max-width: 600px) {
//               .news-grid {
//                 grid-template-columns: 1fr;
//               }
//             }
//           `}</style> */}

//           {!isLoggedIn && (
//             <button
//               type="submit"
//               style={{
//                 fontFamily: "'Quicksand', 'Arial', sans-serif",
//                 fontWeight: "bold",
//                 borderRadius: "12px",
//                 backgroundColor: "#134611",
//                 color: "white",
//                 cursor: "pointer",
//                 width: "100%",
//                 padding: "10px",
//               }}
//               onClick={LoginPage}
//             >
//               Login to view more articles
//             </button>
//           )}

//           {isLoggedIn && (
//             <InfiniteScroll
//               dataLength={displayedArticles.length}
//               next={loadMoreArticles}
//               hasMore={hasMore}
//               loader={
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     padding: "20px",
//                   }}
//                 >
//                   <Skeleton
//                     animation="wave"
//                     variant="rounded"
//                     width={800}
//                     height={140}
//                   />
//                 </div>
//               }
//               endMessage={
//                 <p style={{ textAlign: "center" }}>
//                   <b>Yay! You have seen it all</b>
//                 </p>
//               }
//               style={{ overflow: "visible" }}
//             />
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Home;

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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InfiniteScroll from "react-infinite-scroll-component";
import UnLoggedNewsCard from "../components/UnLoggedNewsCard.jsx";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
gsap.registerPlugin(ScrollTrigger);

const parentstyle = {
  // backgroundColor: "black",
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

  useEffect(() => {
    gsap.defaults({ ease: "power3" });

    ScrollTrigger.batch(".box", {
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          stagger: { each: 0.15, grid: [1, 3] },
          overwrite: true,
        }),
      onLeave: (batch) =>
        gsap.set(batch, { opacity: 0, y: -100, overwrite: true }),
      onEnterBack: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
      onLeaveBack: (batch) =>
        gsap.set(batch, { opacity: 0, y: 100, overwrite: true }),
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [displayedArticles]);

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
        <div style={{ marginTop: "50px" ,backgroundColor:"black"} }>
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
                  // backgroundColor: "black",
                  padding: "5px",
                  margin: "5px",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                  <Skeleton
                    animation="wave"
                    key={index}
                    variant="rounded"
                    width={800}
                    height={140}
                  />
                ))}
              </Grid>
            </Grid>
          </Grid>
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

          {isLoggedIn && (
            <InfiniteScroll
              dataLength={displayedArticles.length}
              next={loadMoreArticles}
              hasMore={hasMore}
              loader={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "20px",
                  }}
                >
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width={800}
                    height={140}
                  />
                </div>
              }
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
              style={{ overflow: "visible" }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Home;