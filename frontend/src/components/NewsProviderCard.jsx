import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { POST } from '../api';
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const NewsProviderCard = ({ name, logoUrl, baseURL, provider, onUnfollow }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const HandleSeeArticles = () => {
    let myURL = baseURL.replace(/^https?:\/\//, '');
    myURL = `http://localhost:3000/search?site=${myURL}`;
    window.open(myURL, '_blank');
  };

  const HandleGoToSite = () => {
    window.open(baseURL, '_blank');
  };

  const [isFollowing, setIsFollowing] = useState();
  const [isShrinking, setIsShrinking] = useState(false);

  useEffect(() => {
    const checkFollow = async () => {
      try {
        const response = await POST('/api/userdo/isfollowed', { baseURL: baseURL });
        if (response.data.success) {
          setIsFollowing(response.data.isFollowing);
        }
        else if (response.data?.caught) {
          navigate("/login");
          // toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Failed to check follow status:', error);
      }
    };
    checkFollow();
  }, [baseURL, navigate]);

  const toggleFollow = async () => {
    try {
      const endpoint = isFollowing ? '/api/userdo/unfollow' : '/api/userdo/follow';
      const payload = { baseURL: baseURL };

      const response = await POST(endpoint, payload);

      if (response.data.success === true) {
        setIsFollowing((prev) => !prev);
        toast.success(isFollowing ? 'You have UnFollowed successfully!' : 'You have Followed successfully!');
        if (isFollowing && provider === "following") {
          setIsShrinking(true);
          setTimeout(() => {
            onUnfollow();
          }, 500); // Duration of the shrinking effect
        }
      } else if (response.data?.caught) {
        navigate("/login");
        // toast.error(response.data.message);
      }
      else {
        console.error(response.data.message);
        toast.error('Something went wrong, please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 300,
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        m: 1,
        position: 'relative',
        transition: 'all 0.5s ease-in-out',
        transform: isShrinking ? 'scale(0) translateY(20px)' : 'scale(1) translateY(0)',
        opacity: isShrinking ? 0 : 1,
        height: isShrinking ? 0 : 'auto',
        margin: isShrinking ? 0 : 1,
        '&:hover': {
          transform: isShrinking ? 'scale(0) translateY(20px)' : 'scale(1.02) translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      {/* Menu Button */}
      <IconButton
        onClick={handleClick}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8
        }}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={HandleSeeArticles}>See Articles</MenuItem>
        <MenuItem onClick={HandleGoToSite}>Go to Site</MenuItem>
      </Menu>

      <CardContent sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 1,
        padding: 3
      }}>
        {/* Logo Container */}
        <div
          style={{
            width: 128,
            height: 128,
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #f6f7f9, #ffffff)',
            padding: 16,
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${name} logo`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              Logo
            </Typography>
          )}
        </div>

        {/* Provider Name */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontWeight: 600
          }}
        >
          {name}
        </Typography>

        {/* Follow Button */}
        <Button
          variant="contained"
          endIcon={<OpenInNewIcon />}
          sx={{
            minWidth: 120,
            textTransform: 'none',
            mt: 'auto',
            '&:hover': {
              transform: 'translateY(-2px)',
            }
          }}
          onClick={toggleFollow} // Use toggleFollow on click
        >
          {isFollowing ? 'Unfollow' : 'Follow'} {/* Dynamic button text */}
        </Button>

      </CardContent>
    </Card>
  );
};

export default NewsProviderCard;