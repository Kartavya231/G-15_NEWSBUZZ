import { Grid, Skeleton } from "@mui/material";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import HistoryNewsCard from "../components/HistoryNewsCard";

const parentstyle = {
  marginTop: "100px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "5px",
  margin: "5px",
};

const History = () => {
  
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
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
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
