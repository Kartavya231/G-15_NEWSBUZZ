import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import CryptoJS from 'crypto-js';
import PersonIcon from "@mui/icons-material/Person";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
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
import image1 from "../images/bg2.jpg";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [justVerify, setJustVerify] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const handlePasswordofLogin = (e) => {
    const input = e.target.value;
    setPassword(input);
    setValidPassword(input.length >= 8);
  };

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("READER");
  const [showPassword, setShowPassword] = useState(false);
  const [errorEmailId, setErrorEmailId] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setJustVerify(true);

    if (
      errorEmailId ||
      username === "" ||
      email === "" ||
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

    setLoading(true);
    const encryptedPassword = CryptoJS.AES.encrypt(password, "your-secret-key").toString();
    console.log("Form data:", {
      username,
      email,
      role,
      encryptedPassword,
      certificate: selectedFile,
    });

    toast.success("Signup successfully");
    navigate('/');
    setLoading(false);
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
            backgroundColor: "transparent",
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
            <Typography variant="h5" fontWeight="bold" sx={{ fontFamily: "'Quicksand', 'Arial', sans-serif" }}>
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
                <InputLabel id="role-label" color="success">Role</InputLabel>
                <Select
                  color="success"
                  labelId="role-label"
                  id="role"
                  label="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  sx={{ borderRadius: 25, fontWeight: "bold" }}
                >
                  <MenuItem value="READER">READER</MenuItem>
                  <MenuItem value="PROVIDER">PROVIDER</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="username"
                label="User Name"
                placeholder="username"
                variant="outlined"
                fullWidth
                required
                size="small"
                error={justVerify && (username === "" || username.length >= 255)}
                helperText={justVerify && (username === "" ? "This field cannot be empty." : "")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="success" />
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 25, fontWeight: "bold" } }}
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
                error={justVerify && (email === "" || errorEmailId)}
                helperText={justVerify && (email === "" ? "This field cannot be empty." : "Invalid email address")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailRoundedIcon color="success" />
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 25, fontWeight: "bold" } }}
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
                error={justVerify && (!validPassword || password.length >= 255)}
                helperText={justVerify && (!validPassword ? "Password must have at least 8 characters." : "")}
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
                        {showPassword ? <Visibility color="success" /> : <VisibilityOff color="success" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 25, fontWeight: "bold" } }}
              />
            </Grid>

            <Grid item xs={12}>
              {role === 'PROVIDER' && (
                <>
                  <Typography variant="body2" align="left">Provide Certificate</Typography>
                  <TextField
                    type="file"
                    fullWidth
                    required
                    onChange={handleFileChange}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, fontWeight: "bold" } }}
                  />
                </>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                disabled={loading}
                variant="contained"
                sx={{
                  textTransform: "none",
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: "'Quicksand', 'Arial', sans-serif",
                  borderRadius: 25,
                  background: "#0B6B77",
                  "&:hover": { background: "#0D5C63" },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
