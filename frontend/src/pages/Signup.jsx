import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import config from '../config'; // Adjust the import path as needed
import CryptoJS from 'crypto-js';
import PersonIcon from "@mui/icons-material/Person";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import {
  InputAdornment,
  IconButton,
  Grid,
  Typography,
  Button,
  TextField,
  Avatar,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InfoIcon from "@mui/icons-material/Info";
import image1 from "../images/login_background.jpg";
import { POST } from "../api";
import { Modal } from "react-bootstrap";
import VerifyEmail from "../components/VerifyEmail.jsx";

export default function Register() {
  // axios.defaults.withCredentials = true;
  const [loading, setloading] = useState(false);
  const [justVerify, setJustVerify] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [isValidLength, setIsValidLength] = useState(false);

  const handlePasswordofLogin = (e) => {
    const input = e.target.value;
    setPassword(input);

    // Check for password length
    const lengthValid = input.length >= 8;
    setIsValidLength(lengthValid);

    // Check for uppercase letters
    const upperCaseValid = /[A-Z]/.test(input);
    setHasUpperCase(upperCaseValid);

    // Check for lowercase letters
    const lowerCaseValid = /[a-z]/.test(input);
    setHasLowerCase(lowerCaseValid);

    // Check for numbers
    const numberValid = /[0-9]/.test(input);
    setHasNumber(numberValid);

    // Check for special characters
    const specialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(input);
    setHasSpecialChar(specialCharValid);

    // Set validPassword to true only if all conditions are met
    if (lengthValid && upperCaseValid && lowerCaseValid && numberValid && specialCharValid) {
      setValidPassword(true);
    } else {
      setValidPassword(false);
    }
  };


  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("READER");
  const [showPassword, setShowPassword] = useState(false);
  const [errorEmailId, setErrorEmailId] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  // Function to handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const navigate = useNavigate();
  // const { validateUser, isLoggedIn } = useAuth();




  const [showModal, setShowModal] = useState(false);
  const [modalResponse, setModalResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setJustVerify(true);

    if (
      errorEmailId ||
      username === "" ||
      email === "" ||
      !validPassword ||
      role === "" ||
      username.length >= 255 ||
      email.length >= 255 ||
      password.length >= 255
    ) {
      toast("Please fill out all fields correctly.", {
        icon: <InfoIcon />,
      });
      return;
    }

    const data = new FormData();
    data.append("username", username);
    data.append("email", email);
    data.append("role", role);
    data.append("certificate", selectedFile);


    try {
      const result = await POST(`/api/user/isuserexistwhensignup`, {username, email, role });
      console.log(result.data);

      if (result.data?.success===false) {
        toast.error(result.data.message);
        return;
      }
    }
    catch (error) {
      toast.error("Signup failed");
      return;
    }


    setShowModal(true);

    // Wait for the modal's response
    const response = await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (modalResponse !== null) {
          clearInterval(interval);
          resolve(modalResponse);
        }
      }, 100);
    });

    // If the response is not valid, return early
    if (!response) {
      toast.error("Invalid code");
      return;
    }


    setloading(true);
    const encryptedPassword = CryptoJS.AES.encrypt(password, config.PWD_SECRET).toString();
    data.append('password', encryptedPassword);


    try {
      const result = await axios.post(`${config.BACKEND_API}/api/user/signup`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "authorization": "Bearer " + localStorage.getItem("token")
        }
      });

      if (result.data?.success) {
        window.localStorage.setItem('token', result.data.token);
        toast.success("Signup successfully");
        navigate('/');
      }
      else {
        console.log("asdf");
        toast.error(result.data?.message);
      }
    } catch (error) {
      toast.error("Signup failed");
    } finally {
      setloading(false);
    }

  };



  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundImage: `url(${image1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
        }}
      >
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={4}
          xl={4}
          sx={{
            borderRadius: "16px",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            backdropFilter: "blur(16px)",
            backgroundColor: "white",
            padding: 1.2,
          }}
        >
          <Grid
            item
            margin={0}
            padding={2}
            container
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Avatar sx={{ backgroundColor: "#25396F", mb: 1 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" fontWeight="bold" sx={{
              fontFamily: "'Quicksand', 'Arial', sans-serif",
            }}>
              Create A New Account
            </Typography>
          </Grid>
          <Grid
            container
            component="form"
            onSubmit={handleSubmit}
            spacing={2}
            padding={2}
          >


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
                value={username}
                onChange={(e) => {
                  const value = e.target.value;
                  setUsername(value);
                }}
                id="username"
                label="User Name"
                placeholder="username"
                variant="outlined"
                fullWidth
                required
                size="small"
                error={
                  justVerify &&
                  (username === "" || username.length >= 255)
                }
                helperText={
                  justVerify &&
                  (username === ""
                    ? "This field cannot be empty."
                    : "")
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="success" />
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
                value={email}
                onChange={(e) => {
                  const value = e.target.value;
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  setEmail(value);
                  setErrorEmailId(!emailRegex.test(value));
                }}
                id="email"
                label="Email Address"
                placeholder="abc@gmail.com"
                variant="outlined"
                fullWidth
                required
                size="small"
                error={
                  justVerify &&
                  (email === "" || email.length >= 255 || errorEmailId)
                }
                helperText={
                  justVerify &&
                  (email === ""
                    ? "This field cannot be empty."
                    : errorEmailId
                      ? "Please, enter valid email id"
                      : "")
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
                value={password}
                onChange={handlePasswordofLogin}
                id="password"
                label="Password"
                placeholder="e.g. 1A3a5$7"
                variant="outlined"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                size="small"
                error={
                  justVerify &&
                  (!validPassword || password === "" || password.length >= 255)
                }
                helperText={
                  justVerify &&
                  (password === ""
                    ? "This field cannot be empty."
                    : !isValidLength
                      ? "Password must be at least 8 characters long."
                      : !hasUpperCase
                        ? "Password must contain at least one uppercase letter."
                        : !hasLowerCase
                          ? "Password must contain at least one lowercase letter."
                          : !hasNumber
                            ? "Password must contain at least one number."
                            : !hasSpecialChar
                              ? "Password must contain at least one special character."
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



            <Grid item xs={12}>
              {role === 'PROVIDER' && (
                <>
                  <Typography variant="body2" align="left" sx={{
                    fontFamily: "'Quicksand', 'Arial', sans-serif",
                  }}>
                    Provide Certificate
                  </Typography>
                  <TextField
                    type="file"
                    fullWidth
                    required
                    onChange={handleFileChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
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
                </>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  position: "relative",
                  fontWeight: "bold",
                  borderRadius: "12px",
                  backgroundColor: "#02294F",
                  fontFamily: "'Quicksand', 'Arial', sans-serif",
                  color: "white",
                  "&:hover": {
                    color: "white",
                    backgroundColor: "#25396F",
                  },
                }}
              >
                {!loading ? "Sign Up" : "Signing Up"}
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
            <Grid item xs={12}>
              <Button
                color="success"
                variant="text"
                onClick={() => {
                  navigate("/login");
                }}
                sx={{
                  fontFamily: "'Quicksand', 'Arial', sans-serif",
                  fontWeight: "bold",
                  textDecoration: "underline",
                  display: "flex",
                  textAlign: "center",
                  alignItems: "center",
                  alignContent: "center",
                  width: '100%',

                }}
              >
                Already have an account? Log In
              </Button>

              <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600, pt: -3
                    }}
                  >
                    Verify Email
                  </Typography>

                </Modal.Header>
                <Modal.Body>
                  <VerifyEmail setShowModal={setShowModal} setModalResponse={setModalResponse} email={email} username={username} mode={"signup"} />
                </Modal.Body>
              </Modal>

            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
