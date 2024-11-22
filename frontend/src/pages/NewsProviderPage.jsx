import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box
} from '@mui/material';
import NewsProviderCard from '../components/NewsProviderCard';
import { GET } from '../api.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const NewsProviderPage = (props) => {
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProviders = async () => {

      console.log('asfafd');
      try {
        const result = await GET(props.provider === "all" ? '/api/provider/get_all_providers' : '/api/provider/get_following_providers');
        console.log(result.data);
        if (result.data.success) {
          setProviders(result.data.providers);
        }
        else if (result.data?.caught) {
          // toast.error(result.data.message);
          navigate('/login'); return;
        }
        else {

          console.log('error');
        }
      } catch (error) {
        console.error('Failed to fetch providers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProviders();
  }, [props.provider, navigate]);

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
    <Box sx={{
      minHeight: '100vh',
      py: 6,
      marginTop: "100px"

    }}>
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
                provider={props.provider}
                onUnfollow={() => {
                  if (props.provider === "following") {
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