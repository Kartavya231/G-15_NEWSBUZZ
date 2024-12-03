import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useSearchParams } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CssBaseline, AppBar } from '@mui/material';
import SidebarNavigation from './components/SidebarNavigation';
import Navbar from './components/Navbar';
import LoggedHome from './pages/LoggedHome';
import SearchResults from './pages/SearchResults';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyFeed from './pages/MyFeed';
import Bookmark from './pages/Bookmark.jsx';
import PageNotFound from './pages/PageNotFound';
import { ThemeContextProvider, ThemeContext } from './context/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';
import UserProfile from './pages/UserProfile';
import NewsProviderPageAll from './pages/NewsProviderPageAll.jsx';
import NewsProviderPageFollowing from './pages/NewsProviderPageFollowing.jsx';
import QuizApp from './components/QuizApp.jsx';
import History from './pages/History';
import ProviderPage from './pages/ProviderPage.jsx';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import quiz from './images/quiz.png';
import { GET } from './api';

const theme = createTheme({
  typography: {
    fontFamily: 'Quicksand, Arial, sans-serif',
  },
});

function App() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Define routes where ThemeProvider and ThemeContextProvider are not needed
  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.includes(location.pathname);

  const validRoutes = ['/', '/login', '/signup', '/search', '/myfeed', '/history', '/account', '/bookmark', '/providers/all', '/providers/following', '/quiz'];
  const validRoutesForQuiz = ['/', '/search', '/myfeed', '/history', '/account', '/bookmark', '/providers/all', '/providers/following'];
  const hideNavbar_SidebarRoutes = ['/login', '/signup'];

  const shouldShowNavbar_Sidebar =
    validRoutes.includes(location.pathname.split('?')[0]) &&
    !hideNavbar_SidebarRoutes.includes(location.pathname.split('?')[0]);

  const shouldShowQuizButton = validRoutesForQuiz.includes(location.pathname.split('?')[0]);

  const [searchParams] = useSearchParams();
  const queries = {
    q: searchParams.get('q'),
    site: searchParams.get('site'),
    tbs: searchParams.get('tbs'),
    gl: searchParams.get('gl'),
    location: searchParams.get('location'),
  };

  const handleQuizButtonClick = () => {
    const isLoggedIn = window.localStorage.getItem('token'); // Check if token exists

    if (isLoggedIn) {
      navigate('/quiz');
    } else {
      navigate('/login');
    }
  };


  useEffect(() => {
    // console.log("af");
    const getRole = async () => {
      const response = await GET('/api/user/getuserrole');
      if (response.data?.success) {
        console.log(response.data?.role);
        setRole(response.data?.role);
      }
    };
    getRole();
  }, []);

  // useEffect(() => {
  //   if (role === 'PROVIDER') {
  //     navigate('/providers/create');
  //   }
  // }, [role, navigate]);

  const AppContent = (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {window.localStorage.getItem('token') && role !== "PROVIDER" && (
        <Box sx={{ zIndex: (theme) => theme.zIndex.appBar + 2 }}>
          {shouldShowNavbar_Sidebar && <SidebarNavigation open={open} setOpen={setOpen} />}
        </Box>
      )}

      {shouldShowQuizButton && window.localStorage.getItem('token') && role !== "PROVIDER" && (
        <Button
          variant="contained"
          onClick={handleQuizButtonClick}
          sx={{
            position: 'fixed',
            top: 150,
            right: 16,
            zIndex: 10000000,
            padding: 0,
            minWidth: 'auto',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)', // Subtle hover effect
            },
          }}
        >
          <img
            src={quiz}
            alt="Quiz Icon"
            style={{
              width: 32,
              height: 40,
              display: 'block',
              borderRadius: 8, // Rounded corners for the image
            }}
          />
        </Button>
      )}

      <Box component="main" sx={{ flexGrow: 1, ml: `${open ? '-120px' : '60px'}`, padding: '24px', position: 'relative' }}>
        <AppBar position="fixed" sx={{ top: 0 }}>
          <Box sx={{ marginLeft: '60px' }}>
            {shouldShowNavbar_Sidebar && role !== "PROVIDER" && <Navbar />}
          </Box>
        </AppBar>

        {shouldShowNavbar_Sidebar && (
          <ThemeContext.Consumer>
            {({ toggleTheme, mode }) => (
              <IconButton
                onClick={toggleTheme}
                sx={{
                  position: 'fixed',
                  top: 10,
                  right: 10,
                  backgroundColor: mode === 'dark' ? 'white' : 'black',
                  color: mode === 'dark' ? 'black' : 'white',
                  zIndex: 999999999,
                }}
              >
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            )}
          </ThemeContext.Consumer>
        )}

        <Routes>
          {role !== "PROVIDER" && <Route path="/" element={window.localStorage.getItem('token') ? <LoggedHome /> : <Home />} />}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<SearchResults queries={queries} />} />
          <Route path="/myfeed" element={<MyFeed />} />
          <Route path="/account" element={<UserProfile />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path="/providers/all" element={<NewsProviderPageAll provider="all" />} />
          <Route path="/providers/following" element={<NewsProviderPageFollowing provider="following" />} />
          {/* <Route path="/providers/create" element={<ProviderPage />} /> */}

          {role !== 'READER' && <Route path="/providers/create" element={<ProviderPage />} />}
          {role === 'PROVIDER' && <Route path="/" element={<ProviderPage />} />}
          <Route path="*" element={<PageNotFound />} />
          <Route path="/quiz" element={<QuizApp />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Box>
    </Box>
  );

  return isAuthRoute ? (
    <>{AppContent}</>
  ) : (
    <ThemeProvider theme={theme}>
      <ThemeContextProvider>{AppContent}</ThemeContextProvider>
    </ThemeProvider>
  );
}

export default App;
