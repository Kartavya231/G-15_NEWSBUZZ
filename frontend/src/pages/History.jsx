import { Grid, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import HistoryNewsCard from "../components/HistoryNewsCard";
import { GET } from "../api";
import { useNavigate } from "react-router-dom";

const parentstyle = {
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

      if (response.data.success) {
        setHistoryArray(response.data.data);
      } else if (response.data?.caught) {
        navigate("/login");
      } else {
        console.log(response.message);
      }
    };

    getHistory();
  }, [navigate]);

  return (
    <>
      <div
        style={{
          overflow: "visible",
          marginTop: "130px",
        }}
      >
        <InfiniteScroll
          dataLength={HistoryArray.length}
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
                }}
                style={parentstyle}
              >
                <div style={{ gridTemplateColumns: "1fr" }}>
                  {HistoryArray.map(
                    (article, index) =>
                      article && (
                        <HistoryNewsCard
                          key={index}
                          title={article.title}
                          link={article.link}
                          time={article.time}
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
