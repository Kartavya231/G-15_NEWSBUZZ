import React, { useEffect, useState } from 'react';
import { GET } from '../api.js';
import { useNavigate } from 'react-router-dom';

const NewsProviderPage = (props) => {
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const result = await GET(
          props.provider === "all"
            ? '/api/provider/get_all_providers'
            : '/api/provider/get_following_providers'
        );

        if (result.data.success) {
          setProviders(result.data.providers);
        } else if (result.data?.caught) {
          navigate('/login');
          return;
        } else {
          console.log('Error occurred while fetching providers.');
        }
      } catch (error) {
        console.error('Failed to fetch providers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [props.provider, navigate]);

  return null; 
};

export default NewsProviderPage;
