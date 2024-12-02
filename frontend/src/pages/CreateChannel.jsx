
// import React, { useState, useEffect } from 'react';

// import {
//   Button,
//   Box,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   TextField,
//   DialogActions,
//   Grid,
//   Card,
//   CardContent,
//   CardMedia,
//   Typography
// } from '@mui/material';
// import axios from 'axios';
// import { toast } from "react-hot-toast";
// import config from '../config';
// import { useNavigate } from 'react-router-dom';
// const CreateChannel = () => {
//   const [open, setOpen] = useState(false);
//   const [channelName, setChannelName] = useState('');
//   const [baseURL, setBaseURL] = useState('');
//   const [logo, setLogo] = useState(null);
//   const [channels, setChannels] = useState([]);
//   const navigate = useNavigate();
//   useEffect(() => {
//     fetchChannels();
//     // eslint-disable-next-line
//   }, []);
//   const fetchChannels = async () => {
//     try {
//       const response = await axios.get(`${config.BACKEND_API}/api/provider/getchannels`, {
//         headers: {
//           "authorization": "Bearer " + localStorage.getItem("token")
//         }
//       });
//       console.log('Channels:', response.data);
//       if (response.data.success) {
//         setChannels(response.data.channels || []);
//       }
//       else if (response.data.caught) {
//         navigate("/login");
//         // toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error('Error fetching channels:', error);
//       toast.error("Failed to fetch channels");
//     }
//   };
//   const handleCreateChannel = () => {
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleLogoChange = (event) => {
//     setLogo(event.target.files[0]);
//   };

//   const handleSubmit = async () => {
//     const formData = new FormData();
//     formData.append('name', channelName);
//     formData.append('baseURL', baseURL);
//     formData.append('logo', logo);
//     try {
//       const response = await axios.post(`${config.BACKEND_API}/api/provider/createchannel`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           "authorization": "Bearer " + localStorage.getItem("token")
//         },
//       });
//       console.log('Channel created:', response.data);
//       if (response.data.success) {
//         toast.success("Channel created successfully");
//         fetchChannels(); // Refresh the channels list after creation
//       } else if (response.data.caught) {
//         navigate("/login");
//         // toast.error(response.data.message);
//       } else {
//         toast.error("Channel creation failed");
//       }
//       handleClose();
//     } catch (error) {
//       console.error('Error creating channel:', error);
//     }
//   };

//   const handledeleteChannel = async (id) => {
//     try {
//       const response = await axios.delete(`${config.BACKEND_API}/api/provider/deletechannel/${id}`, {
//         headers: {
//           "authorization": "Bearer " + localStorage.getItem("token")
//         }
//       });
//       console.log('Channel deleted:', response.data);
//       if (response.data.success) {
//         toast.success("Channel deleted successfully");
//         fetchChannels(); // Refresh the channels list after deletion
//       } else if (response.data.caught) {
//         navigate("/login");
//         // toast.error(response.data.message);
//       } else {
//         toast.error("Channel deletion failed");
//       }
//     }
//     catch (error) {
//       console.error('Error deleting channel:', error);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         padding: '2rem',
//         // backgroundColor: { localStorage.getItem("mode") === 'dark' ? 'black' : 'white' },
//         backgroundColor: localStorage.getItem("mode") === 'dark' ? 'black' : 'white',
//         minHeight: '100vh'
//       }}
//     >
//       <Box sx={{ mb: 4 }}>
//         <Button
//           variant="contained"
//           color="primary"
//           className="btn btn-primary"
//           onClick={handleCreateChannel}
//           sx={{
//             fontSize: '1.2rem',
//             padding: '0.5rem 1.5rem',
//           }}
//         >
//           Create News Channel
//         </Button>
//       </Box>
//       <Grid container spacing={3}>
//         {channels.map((channel) => (
//           <Grid item xs={12} sm={6} md={4} key={channel._id}>
//             <Card sx={{ height: '100%' }}>
//               <CardMedia
//                 component="img"
//                 height="140"
//                 image={`${channel.logo}`}
//                 alt={channel.name}
//                 sx={{ objectFit: 'contain', p: 2 }}
//               />
//               <CardContent>
//                 <Typography variant="h6" component="div">
//                   {channel.name}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Base URL: {channel.baseURL}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Followers: {channel.followers?.length || 0}
//                 </Typography>
//               </CardContent>
//               <Button
//                 onClick={() => { handledeleteChannel(channel._id) }}
//               >
//                 Delete
//               </Button>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle>Create News Channel</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Channel Name"
//             type="text"
//             fullWidth
//             value={channelName}
//             onChange={(e) => setChannelName(e.target.value)}
//           />
//           <TextField
//             margin="dense"
//             label="Base URL"
//             type="url"
//             fullWidth
//             value={baseURL}
//             onChange={(e) => setBaseURL(e.target.value)}
//           />
//           <Button
//             variant="contained"
//             component="label"
//             sx={{ mt: 2 }}
//           >
//             Upload Logo
//             <input
//               type="file"
//               hidden
//               onChange={handleLogoChange}
//             />
//           </Button>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} color="primary">
//             Submit
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default CreateChannel;



import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography
} from '@mui/material';
import axios from 'axios';
import { toast } from "react-hot-toast";
import config from '../config';
import { useNavigate } from 'react-router-dom';

const CreateChannel = () => {
  const [open, setOpen] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [baseURL, setBaseURL] = useState('');
  const [logo, setLogo] = useState(null);
  const [channels, setChannels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChannels();
    // eslint-disable-next-line
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await axios.get(`${config.BACKEND_API}/api/provider/getchannels`, {
        headers: {
          "authorization": "Bearer " + localStorage.getItem("token")
        }
      });
      console.log('Channels:', response.data);
      if (response.data.success) {
        setChannels(response.data.channels || []);
      }
      else if (response.data.caught) {
        navigate("/login");
        // toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
      toast.error("Failed to fetch channels");
    }
  };

  const handleCreateChannel = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogoChange = (event) => {
    setLogo(event.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', channelName);
    formData.append('baseURL', baseURL);
    formData.append('logo', logo);
    try {
      const response = await axios.post(`${config.BACKEND_API}/api/provider/createchannel`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "authorization": "Bearer " + localStorage.getItem("token")
        },
      });
      console.log('Channel created:', response.data);
      if (response.data.success) {
        toast.success("Channel created successfully");
        fetchChannels(); // Refresh the channels list after creation
      } else if (response.data.caught) {
        navigate("/login");
        // toast.error(response.data.message);
      } else {
        toast.error("Channel creation failed");
      }
      handleClose();
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };

  const handledeleteChannel = async (id) => {
    try {
      const response = await axios.delete(`${config.BACKEND_API}/api/provider/deletechannel/${id}`, {
        headers: {
          "authorization": "Bearer " + localStorage.getItem("token")
        }
      });
      console.log('Channel deleted:', response.data);
      if (response.data.success) {
        toast.success("Channel deleted successfully");
        fetchChannels(); // Refresh the channels list after deletion
      } else if (response.data.caught) {
        navigate("/login");
        // toast.error(response.data.message);
      } else {
        toast.error("Channel deletion failed");
      }
    }
    catch (error) {
      console.error('Error deleting channel:', error);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        padding: '2rem',
        backgroundColor: localStorage.getItem("mode") === 'dark' ? 'black' : 'white',
        minHeight: '100vh'
      }}
    >
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          color="primary"
          className="btn btn-primary"
          onClick={handleCreateChannel}
          sx={{
            fontSize: '1.2rem',
            padding: '0.5rem 1.5rem',
          }}
        >
          Create News Channel
        </Button>

        <Button
          onClick={handleLogout}
          variant="contained"
          color="secondary"
          sx={{
            fontSize: '1.2rem',
            padding: '0.5rem 1.5rem',
          }}
        >
          Logout
        </Button>
      </Box>

      <Grid container spacing={3}>
        {channels.map((channel) => (
          <Grid item xs={12} sm={6} md={4} key={channel._id}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image={`${channel.logo}`}
                alt={channel.name}
                sx={{ objectFit: 'contain', p: 2 }}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {channel.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Base URL: {channel.baseURL}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Followers: {channel.followers?.length || 0}
                </Typography>
              </CardContent>
              <Button
                onClick={() => { handledeleteChannel(channel._id) }}
              >
                Delete
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create News Channel</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Channel Name"
            type="text"
            fullWidth
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Base URL"
            type="url"
            fullWidth
            value={baseURL}
            onChange={(e) => setBaseURL(e.target.value)}
          />
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2 }}
          >
            Upload Logo
            <input
              type="file"
              hidden
              onChange={handleLogoChange}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateChannel;
