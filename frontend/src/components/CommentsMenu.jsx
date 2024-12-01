import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Alert,
  Paper,
  Popover,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { POST } from '../api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CommentsMenu = ({ isOpen, anchorEl, onClose, articleURL, setNumComments }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loggedUserName, setLoggedUserName] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await POST('/api/userdo/getComments', { articleURL });
        if (response.data.success === true) {
          setComments(response.data.comments);
          setLoggedUserName(response.data.loggedUserName);
        }
        if (response.data?.caught) {
          navigate('/login'); return;
          // toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, articleURL, newComment, navigate]);


  useEffect(() => {

    const HandleNumComments = async () => {
      try {
        const response = await POST('/api/userdo/numComments', { articleURL });
        if (response.data.success === true) {
          setNumComments(response.data.numComments);
        }

        if (response.data?.caught) {
          navigate('/login'); return;
          // toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };
    HandleNumComments();

  }, [articleURL, comments, newComment, setNumComments, navigate]);


  const handleAddComment = () => {
    if (newComment.trim() === '') {
      return;
    }

    const addComment = async () => {
      try {
        const response = await POST('/api/userdo/addComment', { articleURL, comment: newComment });
        // console.log(response.data);
        if (response.data.success === true) {
          setComments([...comments, {
            username: response.data.username,
            comment: newComment,
            commentId: comments.length + 1,
          }]);
          setNewComment('');
          toast.success('Comment added successfully');
        }

        if (response.data?.caught) {
          navigate('/login'); return;
          // toast.error(response.data.message);
        }

      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    };
    addComment();
  };

  const handleDeleteComment = (commentId) => {


    const deleteComment = async () => {
      try {
        const response = await POST('/api/userdo/deleteComment', {
          articleURL,
          commentId
        });
        // console.log(response.data);
        if (response.data.success === true) {
          setComments(comments.filter((comment) => comment.commentId !== commentId));
          toast.success('Comment deleted successfully');
        }

        if (response.data?.caught) {
          navigate('/login'); return;
          // toast.error(response.data.message);
        }

      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    };
    deleteComment();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          marginLeft: 7,
        }
      }}
    >
      <Box sx={{
        width: 380,
        height: 'auto',
        maxHeight: '80vh',
        bgcolor: localStorage.getItem('mode') === 'dark' ? '#464646' : 'background.paper',
        p: 2,
        borderRadius: 2,
      }}>
        {/* Header */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          borderBottom: 1,
          borderColor: 'divider',
          pb: 1
        }}>
          <Typography variant="h6">Comments</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Comments List */}
        <Box sx={{
          flexGrow: 1,
          overflowY: 'auto',
          mb: 2
        }}>
          {comments.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              No comments yet. Be the first to share your thoughts!
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {comments.map((comment) => (
                <Paper
                  key={comment.commentId}
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: 'action.hover',
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle2">{comment.username}</Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {comment.comment}
                      </Typography>
                    </Box>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1
                    }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(comment.timestamp || new Date())}
                      </Typography>
                      {comment.username === loggedUserName && (

                        <IconButton
                          size="small"
                          onClick={() => handleDeleteComment(comment.commentId)}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>

        {/* Comment Input */}
        <Box sx={{
          mt: 'auto',
          display: 'flex',
          gap: 1
        }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleAddComment}
            sx={{ minWidth: '50px' }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default CommentsMenu;
