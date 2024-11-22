import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box
} from '@mui/material';
import NewsProviderCard from '../components/NewsProviderCard';

const NewsProviderPage = ({ providers: initialProviders, provider }) => {
  const [providers, setProviders] = useState(initialProviders || []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  }, [provider]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={64} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 6,
        marginTop: "100px"
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2
            }}
          >
            News Providers
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Follow your favorite news sources to stay updated
          </Typography>
        </Box>

        {/* Grid Layout */}
        <Grid container spacing={3}>
          {providers.map((provider) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={provider.baseURL}>
              <NewsProviderCard
                name={provider.name}
                logoUrl={provider.logo}
                baseURL={provider.baseURL}
                provider={provider}
                onUnfollow={() => {
                  if (provider === "following") {
                    setProviders((prevProviders) =>
                      prevProviders.filter((p) => p.baseURL !== provider.baseURL)
                    );
                  }
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default NewsProviderPage;
