import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Tooltip, Zoom, IconButton } from '@mui/material';
import { ThemeContext } from '../context/ThemeContext';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HeartIcon from '@mui/icons-material/Favorite';
import HeartBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareButton from '@mui/icons-material/Share';
import ShareDialog from './ShareDialog';

const BookmarkCard = (props) => {
  const { mode } = useContext(ThemeContext);
  const location = useLocation();
  const isSearchPage = location.pathname === '/search' || location.pathname === '/myfeed' || location.pathname === "/bookmark";
  const [isRemoving, setIsRemoving] = useState(false);
  const boxRef = useRef(null);
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const shareDialogRef = useRef(null);

  const handleClick = () => {
    window.open(props.link, '_blank');
  };

  const handleBookmarkClick = () => {
    setIsRemoving(true);
    setTimeout(() => {
      setBookmarked(false);
      if (props.onRemove) {
        props.onRemove();
      }
    }, 500); // 500ms matches the CSS transition duration
  };

  const handleLikeClick = () => {
    setLiked(!liked);
  };

  const handleClickOutside = (event) => {
    if (shareDialogRef.current && !shareDialogRef.current.contains(event.target)) {
      setShowShareDialog(false);
    }
  };

  useEffect(() => {
    if (showShareDialog) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareDialog]);

  if (!bookmarked) {
    return null;
  }

  return (
    <Box
      ref={boxRef}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 950,
        height: isRemoving ? '0' : '100%',
        margin: isRemoving ? '0' : '20px auto',
        position: 'relative',
        opacity: isRemoving ? 0 : 1,
        transform: isRemoving ? 'translateX(-100%)' : 'translateX(0)',
        transition: 'all 0.5s ease-out',
        overflow: 'hidden',
        '&:hover .action-buttons': {
          opacity: 1,
          visibility: 'visible',
        },
      }}
    >
      <Box sx={{ flex: 1, maxWidth: 850 }}>
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            border: 'none',
            boxShadow: 'none',
            width: '900px',
            height: '100%',
            backgroundColor: mode === 'light' ? 'rgb(246, 246, 246)' : 'rgb(50, 50, 50)',
            '&:hover': {
              backgroundColor: mode === 'light' ? 'rgb(240, 240, 240)' : 'rgb(60, 60, 60)',
            },
            transition: 'background-color 0.3s ease',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <CardContent sx={{ flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                  height: '40px',
                  overflow: 'hidden',
                }}
              >
                {isSearchPage ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {props.providerImg && (
                      <img
                        src={props.providerImg}
                        alt="Provider Logo"
                        style={{ maxWidth: '40px', maxHeight: '40px', objectFit: 'contain' }}
                      />
                    )}
                    {props.providerName && (
                      <Typography variant="subtitle2" color="text.secondary" style={{ marginLeft: '10px' }}>
                        {props.providerName}
                      </Typography>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}
                  >
                    {props.providerImg && (
                      <img
                        src={props.providerImg}
                        alt="Provider Logo"
                        style={{ maxWidth: '100%', maxHeight: '80%', objectFit: 'contain' }}
                      />
                    )}
                  </div>
                )}
              </div>

              <Tooltip title="click" placement="top" TransitionComponent={Zoom} arrow>
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  onClick={handleClick}
                  sx={{
                    cursor: 'pointer',
                    color: 'rgb(30, 144, 255)',
                    '&:hover': { color: mode === 'light' ? 'blue' : 'white' },
                    transition: 'color 0.3s ease',
                  }}
                >
                  {props.title}
                </Typography>
              </Tooltip>

              {props.someText && (
                <Typography variant="body2" color="text.secondary">
                  {props.someText}
                </Typography>
              )}
            </CardContent>

            {props.imgURL && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 2 }}>
                <img
                  src={props.imgURL}
                  alt="Article"
                  style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', pl: 2, mt: -1 }}>
              <Typography variant="caption" color="text.secondary" fontSize="medium">
                {props.time}
              </Typography>
            </Box>
            <Box
              className="action-buttons"
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                opacity: 0,
                visibility: 'hidden',
                transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
              }}
            >
              <Tooltip title="Remove Bookmark" placement="bottom" arrow>
                <IconButton
                  sx={{
                    height: '48px',
                    width: '48px',
                    alignSelf: 'center',
                    marginBottom: '8px',
                  }}
                  aria-label="remove-bookmark"
                  onClick={handleBookmarkClick}
                >
                  <BookmarkIcon sx={{ fontSize: '28px', color: 'primary.main' }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Like" placement="bottom" arrow>
                <IconButton
                  sx={{
                    height: '48px',
                    width: '48px',
                    alignSelf: 'center',
                    marginBottom: '8px',
                  }}
                  aria-label="like"
                  onClick={handleLikeClick}
                >
                  {liked ? (
                    <HeartIcon sx={{ fontSize: '28px', color: 'red' }} />
                  ) : (
                    <HeartBorderIcon sx={{ fontSize: '28px' }} />
                  )}
                </IconButton>
              </Tooltip>

              <Tooltip title="Share" placement="bottom" arrow>
                <IconButton
                  sx={{
                    height: '48px',
                    width: '48px',
                    alignSelf: 'center',
                  }}
                  aria-label="share"
                  onClick={() => setShowShareDialog(true)}
                >
                  <ShareButton sx={{ fontSize: '28px' }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Card>
      </Box>

      {showShareDialog && (
        <div ref={shareDialogRef}>
          <ShareDialog link={props.link} onClose={() => setShowShareDialog(false)} id="share-dialog" />
        </div>
      )}
    </Box>
  );
};

export default BookmarkCard;
