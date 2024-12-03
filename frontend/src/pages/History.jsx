// import { Grid, Skeleton } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import InfiniteScroll from "react-infinite-scroll-component";
// import HistoryNewsCard from "../components/HistoryNewsCard";
// import { GET } from "../api";
// import { useNavigate } from "react-router-dom";

// const parentstyle = {
//   // backgroundColor:"black",
//   marginTop: "100px",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   padding: "5px",
//   margin: "5px",
// };

// // const HistoryArray = [
// //   {
// //     title: "Title",
// //     link: "Link",
// //     time: "Time",
// //     providerImg: "ProviderImg",
// //   },
// //   {
// //     title: "Title",
// //     link: "Link",
// //     time: "Time",
// //     providerImg: "ProviderImg",
// //   },
// //   {
// //     title: "Title",
// //     link: "Link",
// //     time: "Time",
// //     providerImg: "ProviderImg",
// //   },
// //   {
// //     title: "Title",
// //     link: "Link",
// //     time: "Time",
// //     providerImg: "ProviderImg",
// //   },
// //   {
// //     title: "Title",
// //     link: "Link",
// //     time: "Time",
// //     providerImg: "ProviderImg",
// //   },
// //   {
// //     title: "Title",
// //     link: "Link",
// //     time: "Time",
// //     providerImg: "ProviderImg",
// //   },
// //   {
// //     title: "Title",
// //     link: "Link",
// //     time: "Time",
// //     providerImg: "ProviderImg",
// //   },
// // ];





// const History = () => {

//   const navigate = useNavigate();
//   const [HistoryArray, setHistoryArray] = useState([]);


//   useEffect(() => {
//     const getHistory = async () => {
//       const response = await GET("/api/history/get");

//       if (response.data.success) {
//         setHistoryArray(response.data.data);
//       } else if (response.data?.caught) {
//         navigate("/login");
//       } else {
//         console.log(response.message);
//       }
//     };

//     getHistory();
//   }, [navigate]);




//   return (
//     <>
//       <div
//         style={{
//           overflow: "visible",
//           marginTop: "130px",
//           //   backgroundColor: "black"
//         }}
//       >
//         <InfiniteScroll
//           dataLength={HistoryArray.length}
//           //   next={loadMoreArticles}
//           //   hasMore={hasMore}
//           loader={
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 padding: "20px",
//               }}
//             >
//               <Skeleton
//                 animation="wave"
//                 variant="rounded"
//                 width={800}
//                 height={140}
//               />
//             </div>
//           }
//           style={{ overflow: "visible" }}
//         >
//           <div style={{ marginTop: "50px" }}>
//             <Grid container>
//               <Grid
//                 item
//                 md={12}
//                 xs={9}
//                 sm={10}
//                 sx={{
//                   position: "relative",
//                   //   backgroundColor: "black"
//                 }}
//                 style={parentstyle}
//               >
//                 <div style={{ gridTemplateColumns: "1fr", height: "150px" }}>
//                   {HistoryArray.map(
//                     (article, index) =>
//                       article && (
//                         <HistoryNewsCard
//                           key={index}
//                           title={article.title}
//                           link={article.link}
//                           time={article.time}
//                         // providerImg={article.providerImg}
//                         // providerName={article.providerName}
//                         />
//                       )
//                   )}
//                 </div>
//               </Grid>
//             </Grid>
//           </div>
//         </InfiniteScroll>
//       </div>
//     </>
//   );
// };

// export default History;


import { Box, Grid, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import HistoryNewsCard from "../components/HistoryNewsCard";
import { GET } from "../api";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import toast from "react-hot-toast";


const parentstyle = {
  // backgroundColor:"black",
  marginTop: "100px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "5px",
  margin: "5px",
};

const History = () => {

  const navigate = useNavigate();
  const [HistoryArray, setHistoryArray] = useState([]);


  useEffect(() => {
    const getHistory = async () => {
      const response = await GET("/api/history/get");

      if (response.data?.success) {
        setHistoryArray(response.data?.data);
      } else if (response.data?.caught) {
        navigate("/login");
      } else {
        console.log(response.data?.message);
      }
    };

    getHistory();
  }, [navigate, setHistoryArray, HistoryArray]);


  const handleRemoveHistory = async () => {

    const response = await GET("/api/history/removeallhistory");

    if (response.data?.success) {
      toast.success(response.data?.message);
      setHistoryArray([]);
    } else if (response.data?.caught) {
      toast.error(response.data?.message);
      navigate("/login");
    }
    else {
      console.log(response.message);
    }

  }



  return (
    <>

      <Box sx={{ justifyContent: "center", display: "flex", mt: "130px" }}>
        <Button onClick={handleRemoveHistory}>
          <h1>Delete History</h1>
        </Button>
      </Box >
      <div
        style={{
          overflow: "visible",
          // marginTop: "130px",
          //   backgroundColor: "black"
        }}
      >
        <InfiniteScroll
          dataLength={HistoryArray.length}
          //   next={loadMoreArticles}
          //   hasMore={hasMore}
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
          style={{ overflow: "visible" }}
        >
          <div style={{ marginTop: "50px" }}>
            <Grid container>
              <Grid
                item
                md={12}
                xs={9}
                sm={10}
                sx={{
                  position: "relative",
                  //   backgroundColor: "black"
                }}
                style={parentstyle}
              >
                <div style={{ gridTemplateColumns: "1fr", height: "150px" }}>
                  {HistoryArray.map(
                    (article, index) =>
                      article && (
                        <HistoryNewsCard
                          key={index}
                          title={article.title}
                          link={article.link}
                          time={article.time}
                          setHistoryArray={setHistoryArray}
                        // providerImg={article.providerImg}
                        // providerName={article.providerName}
                        />
                      )
                  )}
                </div>
              </Grid>
            </Grid>
          </div>
        </InfiniteScroll>
      </div>
    </>
  );
};

export default History;
