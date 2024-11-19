import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { Button, Box, Menu, MenuItem, FormControl, InputLabel, Select, TextField } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import { Country, State, City } from "country-state-city";

const Navbar = () => {
  const { mode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [quickSearchText, setQuickSearchText] = useState(['']);
  const [newQuickSearch, setNewQuickSearch] = useState('');
  const [showAddBox, setShowAddBox] = useState(false);

  const countryData = Country.getAllCountries();
  const TokenExist = !!window.localStorage.getItem('token');

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setCountry(selectedCountry);
    setStateData(State.getStatesOfCountry(selectedCountry.isoCode));
    setCityData([]);
    setState("");
    setCity("");
  };

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setState(selectedState);
    setCityData(City.getCitiesOfState(country.isoCode, selectedState.isoCode));
    setCity("");
  };

  const handleLogout = () => {
    window.localStorage.removeItem('token');
    navigate('/login');
  };

  const navbarStyle = {
    backgroundColor: mode === 'dark' ? '#f0f0f0' : '#464646',
    backdropFilter: "blur(10px)",
    paddingLeft: '20px',
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg" style={navbarStyle}>
        <div className="container-fluid">
          <Link className={navbar-brand ${mode === 'dark' ? 'text-dark' : 'text-light'}} to="/">News Aggregator</Link>

          <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={nav-link active ${mode === 'dark' ? 'text-dark' : 'text-light'}} aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className={nav-link ${mode === 'dark' ? 'text-dark' : 'text-light'}} to="/providers/all">Providers</Link>
              </li>
            </ul>

            <form className="d-flex mx-5">
              {TokenExist ? (
                <button className="btn btn-danger mx-1" onClick={handleLogout}>Logout</button>
              ) : (
                <>
                  <Link className="btn btn-primary mx-1" to="/login" role="button">Login</Link>
                  <Link className="btn btn-primary mx-1" to="/signup" role="button">Signup</Link>
                </>
              )}
            </form>
          </div>
        </div>
      </nav>

      {TokenExist && (
        <Box
          sx={{
            fontFamily: "Quicksand",
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: '10px 0',
            overflowX: 'auto',
            backgroundColor: mode === 'dark' ? '#464646' : 'rgb(230, 230, 230)',
            color: mode === 'dark' ? '#fff' : '#000',
            marginLeft: '20px',
          }}
        >
          <Button
            onClick={(e) => setAnchorEl(e.currentTarget)}
            endIcon={<KeyboardArrowDownRoundedIcon />}
            sx={{
              fontWeight: 'bold',
              fontSize: 'large',
              color: mode === 'dark' ? 'rgb(255, 255, 255)' : '#000',
              backgroundColor: mode === 'dark' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)',
            }}
          >
            Global
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel>Country</InputLabel>
              <Select
                value={country}
                onChange={handleCountryChange}
              >
                {countryData.map((country, index) => (
                  <MenuItem key={index} value={country}>{country.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel>State</InputLabel>
              <Select
                value={state}
                onChange={handleStateChange}
                disabled={!country}
              >
                {stateData.map((state, index) => (
                  <MenuItem key={index} value={state}>{state.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel>City</InputLabel>
              <Select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!state}
              >
                {cityData.map((city, index) => (
                  <MenuItem key={index} value={city}>{city.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  const location = city.name || state.name || "";
                  navigate(/search?location=${location});
                }}
                endIcon={<TravelExploreRoundedIcon fontSize='large' />}
                sx={{ 
                  fontWeight: "bold", 
                  fontSize: "large", 
                  borderRadius: 2, 
                  m: 1, 
                  width: '80%' 
                }}
              >
                Localized News
              </Button>
            </Box>
          </Menu>

          {/* Quick Search and Add Topic sections would be similar to the original, 
              but I've omitted them for brevity */}
        </Box>
      )}
    </>
  );
};

export default Navbar;