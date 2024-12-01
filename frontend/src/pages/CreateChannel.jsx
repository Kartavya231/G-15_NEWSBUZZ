// // import React, { useState } from 'react';
// // import { Button, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
// // import axios from 'axios'; // Import axios for making HTTP requests
// // import { toast } from "react-hot-toast";
// // import config from '../config'; // Adjust the import path as needed


// // const CreateChannel = () => {
// //   const [open, setOpen] = useState(false);
// //   const [channelName, setChannelName] = useState('');
// //   const [baseURL, setBaseURL] = useState('');
// //   const [logo, setLogo] = useState(null);

// //   const handleCreateChannel = () => {
// //     setOpen(true);
// //   };

// //   const handleClose = () => {
// //     setOpen(false);
// //   };

// //   const handleLogoChange = (event) => {
// //     setLogo(event.target.files[0]);
// //   };

// //   const handleSubmit = async () => {
// //     const formData = new FormData();
// //     formData.append('name', channelName);
// //     formData.append('baseURL', baseURL);
// //     formData.append('logo', logo);

// //     try {
// //       const response = await axios.post(`${config.BACKEND_API}/api/provider/createchannel`, formData, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data',
// //           "authorization": "Bearer " + localStorage.getItem("token")
// //         },
// //       });
// //       console.log('Channel created:', response.data);
// //       if (response.data.success) {
// //         toast.success("Channel created successfully");
// //       } else {
// //         toast.error("Channel creation failed");
// //       }
// //       handleClose();
// //     } catch (error) {
// //       console.error('Error creating ch  annel:', error);
// //     }
// //   };

// //   return (
// //     <Box
// //       sx={{
// //         display: 'flex',
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         height: '100vh',
// //         backgroundColor: '#f8f9fa',
// //       }}
// //     >
// //       <Button
// //         variant="contained"
// //         color="primary"
// //         className="btn btn-primary"
// //         onClick={handleCreateChannel}
// //         sx={{
// //           fontSize: '1.2rem',
// //           padding: '0.5rem 1.5rem',
// //         }}
// //       >
// //         Create News Channel
// //       </Button>

// //       <Dialog open={open} onClose={handleClose}>
// //         <DialogTitle>Create News Channel</DialogTitle>
// //         <DialogContent>
// //           <TextField
// //             autoFocus
// //             margin="dense"
// //             label="Channel Name"
// //             type="text"
// //             fullWidth
// //             value={channelName}
// //             onChange={(e) => setChannelName(e.target.value)}
// //           />
// //           <TextField
// //             margin="dense"
// //             label="Base URL"
// //             type="url"
// //             fullWidth
// //             value={baseURL}
// //             onChange={(e) => setBaseURL(e.target.value)}
// //           />
// //           <Button
// //             variant="contained"
// //             component="label"
// //             sx={{ mt: 2 }}
// //           >
// //             Upload Logo
// //             <input
// //               type="file"
// //               hidden
// //               onChange={handleLogoChange}
// //             />
// //           </Button>
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={handleClose} color="secondary">
// //             Cancel
// //           </Button>
// //           <Button onClick={handleSubmit} color="primary">
// //             Submit
// //           </Button>
// //         </DialogActions>
// //       </Dialog>
// //     </Box>
// //   );
// // };

// // export default CreateChannel;



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
//       else if (response.data?.caught) {
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
//       } else if (response.data?.caught) {
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
//       } else if (response.data?.caught) {
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
//         backgroundColor: '#f8f9fa',
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







import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function CreateChannelModal({ open, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    baseUrl: "",
    logo: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", baseUrl: "", logo: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: "#f8f9fa" }}>
        Create News Channel
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Channel Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Base URL"
              name="baseUrl"
              value={formData.baseUrl}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              type="url"
            />
            <TextField
              label="Logo URL"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              type="url"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, backgroundColor: "#f8f9fa" }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "#1a73e8" }}
          >
            Create Channel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateChannelModal;