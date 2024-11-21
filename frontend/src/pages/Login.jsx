import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  InputLabel,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailUsername, setEmailUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("READER");

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login success
    setTimeout(() => {
      alert("Login successful!"); // Replace with actual navigation logic
      setLoading(false);
      navigate("/");
    }, 1000);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "fixed",
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
        sx={{
          padding: { xs: 2, sm: 4 },
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          backgroundColor: "white",
        }}
      >
        <Avatar sx={{ backgroundColor: "#134611", mb: 2 }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography
          variant="h5"
          fontWeight="bold"
          mb={2}
          sx={{ fontFamily: "'Quicksand', 'Arial', sans-serif" }}
        >
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
                  onChange={(e) => setRole(e.target.value)}
                  sx={{
                    borderRadius: 25,
                    fontWeight: "bold",
                    "& .MuiSelect-select": {
                      fontFamily: "'Quicksand', 'Arial', sans-serif",
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: "'Quicksand', 'Arial', sans-serif",
                    },
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <PeopleAltRoundedIcon color="success" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="READER">READER</MenuItem>
                  <MenuItem value="PROVIDER">PROVIDER</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                color="success"
                value={emailUsername}
                onChange={(e) => setEmailUsername(e.target.value)}
                id="username"
                label="Email"
                placeholder="email"
                variant="outlined"
                fullWidth
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailRoundedIcon color="success" />
                    </InputAdornment>
                  ),
                  style: { fontFamily: "'Quicksand', 'Arial', sans-serif" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 25,
                    fontWeight: "bold",
                  },
                  "& label": {
                    fontFamily: "'Quicksand', 'Arial', sans-serif",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                color="success"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                label="Password"
                placeholder="password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="success" />
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
                    fontFamily: "'Quicksand', 'Arial', sans-serif",
                  },
                }}
              />
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
                    backgroundColor: "#155d27",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  "Log In"
                )}
              </Button>
            </Grid>

            <Grid item container justifyContent="center" xs={12}>
              <Button
                color="success"
                variant="text"
                onClick={() => navigate("/signup")}
                sx={{
                  fontFamily: "'Quicksand', 'Arial', sans-serif",
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                Don't have an account? Sign Up
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}
