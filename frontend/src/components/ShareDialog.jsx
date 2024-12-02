import React, { useContext } from 'react';
import { Box, Typography, Snackbar, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ThemeContext } from '../context/ThemeContext';
import XIcon from '@mui/icons-material/X';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import toast from 'react-hot-toast';

const ShareDialog = ({ link, onClose }) => {
  const { mode } = useContext(ThemeContext);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleShare = (platform) => {
    let url = '';
    switch (platform) {
      case 'x':
        url = `https://x.com/intent/post?url=${encodeURIComponent(link)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(link);

        toast.success('Link copied to clipboard');
        setOpenSnackbar(true); // Show snackbar when the link is copied
        onClose(); // Close dialog when link is copied
        return;
      default:
        return;
    }
    window.open(url, '_blank');
    onClose(); // Close dialog after sharing
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: mode === 'light' ? 'white' : 'grey.900',
        color: mode === 'light' ? 'black' : 'white',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        zIndex: 1300,
      }}
    >
      <Typography variant="h6" component="div" gutterBottom>
        Share this article
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
        <Tooltip title="Share on X" placement="top">
          <IconButton onClick={() => handleShare('x')} color="primary">
            <XIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Share on Facebook" placement="top">
          <IconButton onClick={() => handleShare('facebook')} color="primary">
            <FacebookRoundedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Copy link" placement="top">
          <IconButton onClick={() => handleShare('copy')} color="primary">
            <ContentCopyRoundedIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <IconButton
        sx={{ position: 'absolute', top: 8, right: 8 }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Link copied to clipboard"
      />
    </Box>
  );
};

export default ShareDialog;
