import React, { useState } from "react";
import {
  AppBar,
  Box,
  Container,
  Grid,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NewsChannelCard from "./CreateChannelNewsCard";
import CreateChannelModal from "./CreateChannel";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [open, setOpen] = useState(false);
  const [channels, setChannels] = useState([
    {
      id: 1,
      name: "Tech Insider",
      baseUrl: "https://techinsider.news",
      logo: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60",
      followers: 156000,
    },
    {
      id: 2,
      name: "Global News Network",
      baseUrl: "https://gnn.world",
      logo: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&auto=format&fit=crop&q=60",
      followers: 289000,
    },
    {
      id: 3,
      name: "Science Daily",
      baseUrl: "https://sciencedaily.org",
      logo: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop&q=60",
      followers: 134000,
    },
  ]);

  const handleCreateChannel = (channelData) => {
    const newChannel = {
      id: channels.length + 1,
      ...channelData,
      followers: Math.floor(Math.random() * 200000) + 50000,
    };
    setChannels([...channels, newChannel]);
    setOpen(false);
  };

  const handleDeleteChannel = (channelId) => {
    setChannels(channels.filter((channel) => channel.id !== channelId));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#1a73e8" }}>
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            News Provider Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{
              backgroundColor: "white",
              color: "#1a73e8",
              "&:hover": {
                backgroundColor: "#f1f3f4",
              },
            }}
          >
            Create News Channel
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {channels.map((channel) => (
            <Grid item xs={12} sm={6} md={4} key={channel.id}>
              <NewsChannelCard
                id={channel.id}
                name={channel.name}
                baseUrl={channel.baseUrl}
                logo={channel.logo}
                followers={channel.followers}
                onDelete={handleDeleteChannel}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      <CreateChannelModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateChannel}
      />
    </Box>
  );
}

export default App;
