import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Grid,
  Avatar,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import config from "../config";
import CryptoJS from 'crypto-js';
import { POST } from '../api'; // Adjust the import path as needed
// import image1 from "../images/bg2.jpg";
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import { Modal } from 'react-bootstrap';
import ForgotPassword from "../components/ForgotPassword";
import login_background from "../images/login_background.jpg";


export default function Login() {

  const [loading, setLoading] = useState(false);
  const [justVerify, setJustVerify] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailUsername, setEmailUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("READER");

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handlePasswordofLogin = (e) => {
    const input = e.target.value;
    setPassword(input);
    if (input.length < 8) {
      setValidPassword(false);
      return;
    } else {
      setValidPassword(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setJustVerify(true);
    if (
      emailUsername === "" ||
      password === "" ||
      // !validPassword ||
      emailUsername.length >= 255 ||
      password.length > 255
    ) {
      return;
    }
    setLoading(true);
    const encryptedPassword = CryptoJS.AES.encrypt(password, config.PWD_SECRET).toString();

    const loginDetails = {
      role,
      email: emailUsername,
      password: encryptedPassword
    };

    try {
      const result = await POST('/api/user/login', loginDetails);

      if (result.data?.success) {
        window.localStorage.setItem('token', result.data.token);
        toast.success("Logged in successfully");
        // navigate('/');
        window.location.href = '/';
      }
      else {
        toast.error(result.data?.message);
      }
    } catch (err) {
      toast.error("Error Occured !!");
      console.log("error -> ", err);
    }
    setLoading(false);
  };


  const [showModal, setShowModal] = useState(false);


  return (

    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundImage: `url(${login_background})`,
      }}
    >
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        lg={4}
        sx={{
          padding: { xs: 2, sm: 4 },
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          backdropFilter: "blur(12px)",
          backgroundColor: "white",
        }}
      >
        <Avatar sx={{ backgroundColor: "#134611", mb: 2 }}>
          <LockOutlinedIcon />
        </Avatar>


        <Typography variant="h5" fontWeight="bold" mb={2} sx={{
          fontFamily: "'Quicksand', 'Arial', sans-serif",
        }}>
          Log In
        </Typography>


        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Grid container spacing={2}>

            <Grid item xs={12}>
              <FormControl size="small" fullWidth>
                <InputLabel id="role-label" color="success">
                  Role
                </InputLabel>
                <Select
                  color="success"
                  labelId="role-label"
                  id="role"
                  label="Role"
                  value={role}
                  onChange={(e) => { setRole(e.target.value); }}
                  sx={{
                    borderRadius: 25,
                    fontWeight: "bold",
                    "& .MuiSelect-select": {
                      fontFamily: "'Quicksand', 'Arial', sans-serif", // Apply font family to the selected value
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: "'Quicksand', 'Arial', sans-serif", // Apply font family to the label
                    },
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <PeopleAltRoundedIcon color="success" />
                    </InputAdornment>
                  }
                >

                  <MenuItem value="READER" sx={{
                    fontFamily: "'Quicksand', 'Arial', sans-serif",

                  }}>READER</MenuItem>
                  <MenuItem value="PROVIDER" sx={{
                    fontFamily: "'Quicksand', 'Arial', sans-serif",

                  }}>PROVIDER</MenuItem>
                </Select>
              </FormControl>
            </Grid>


            <Grid item xs={12}>
              <TextField
                color="success"
                value={emailUsername}
                onChange={(e) => {
                  setEmailUsername(e.target.value);
                }}
                id="username"
                label="Email"
                placeholder="email"
                variant="outlined"
                fullWidth
                required
                size="small"
                autoComplete="on"
                error={
                  justVerify &&
                  (emailUsername === "" || emailUsername.length >= 255)
                }
                helperText={
                  justVerify &&
                  (emailUsername === "" ? "This field cannot be empty." : "")
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailRoundedIcon color="success" />
                    </InputAdornment>
                  ),
                  style: { fontFamily: "'Quicksand', 'Arial', sans-serif" }, // Use style for InputProps
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 25,
                    fontWeight: "bold",
                  },
                  "& label": {
                    fontFamily: "'Quicksand', 'Arial', sans-serif", // Apply font family to label
                  },
                  "& .MuiInputBase-input": {
                    fontFamily: "'Quicksand', 'Arial', sans-serif", // Apply font family to the input
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                color="success"
                value={password}
                onChange={handlePasswordofLogin}
                id="password"
                label="Password"
                placeholder="password"
                variant="outlined"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                size="small"
                autoComplete="on"
                error={
                  justVerify &&
                  (!validPassword || password === "" || password.length >= 255)
                }
                helperText={
                  justVerify &&
                  (password === ""
                    ? "This field cannot be empty."
                    : !validPassword
                      ? "The password must contain at least 8 characters."
                      : "")
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyRoundedIcon color="success" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? (
                          <Visibility color="success" />
                        ) : (
                          <VisibilityOff color="success" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 25,
                    fontWeight: "bold",
                  },
                  "& label": {
                    fontFamily: "'Quicksand', 'Arial', sans-serif", // Apply font family to label
                  },
                  "& .MuiInputBase-input": {
                    fontFamily: "'Quicksand', 'Arial', sans-serif", // Apply font family to the input
                  },
                }}
              />
            </Grid>


            <Grid item container justifyContent="space-between" xs={12}>
              <Button
                color="error"
                variant="text"
                onClick={() => setShowModal(true)}
                sx={{
                  fontFamily: "'Quicksand', 'Arial', sans-serif",
                  fontWeight: "bold",
                  textDecoration: "underline",
                  marginTop: '-15px',
                }}
              >
                Forgot Password?
              </Button>
            </Grid>


            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  fontFamily: "'Quicksand', 'Arial', sans-serif",
                  fontWeight: "bold",
                  borderRadius: "12px",
                  backgroundColor: "#134611",
                  color: "white",
                  "&:hover": {
                    color: "white",
                    backgroundColor: "#155d27",
                  },
                }}
              >
                {!loading ? "Log In" : "Logged In"}
                {loading && <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}
                {loading && (
                  <CircularProgress
                    size={20}
                    sx={{
                      color: "white",
                      right: 0,
                    }}
                  />
                )}
              </Button>
            </Grid>



            <Grid item container justifyContent="center" xs={12}>
              <Button
                color="success"
                variant="text"
                onClick={() => {
                  navigate("/signup");
                }}
                sx={{
                  fontFamily: "'Quicksand', 'Arial', sans-serif",
                  fontWeight: "bold",
                  textDecoration: "underline",
                  display: "flex",
                  textAlign: "center",
                  alignItems: "center",
                  alignContent: "center",
                  width: '100%', // Ensures the button takes full width
                }}
              >
                Don't have an account? Sign Up
              </Button>
            </Grid>


          </Grid>
        </form>
      </Grid>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          {/* This adds the cross (X) button */}
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            Forgot password
          </Typography>

        </Modal.Header>
        <Modal.Body>
          <ForgotPassword setShowModal={setShowModal} />
        </Modal.Body>
      </Modal>


    </Grid>
  );
}
