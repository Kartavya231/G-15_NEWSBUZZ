const [searchQuery, setSearchQuery] = useState('');
const [filteredArticles, setFilteredArticles] = useState([]);
const [articles, setArticles] = useState([]);

// Filtering articles based on search query
useEffect(() => {
  setFilteredArticles(
    articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
}, [searchQuery, articles]);

// Search input field with query state management
<TextField
  hiddenLabel
  variant="outlined"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Search from given articles..."
  sx={{
    m: 1,
    width: "400px",
    height: "100%",
    borderRadius: "25px",
    bgcolor: mode === "dark" ? "#444" : "rgb(251, 248, 248)",
    transition: "width 0.25s ease-in-out",
    "& .MuiOutlinedInput-root": {
      borderRadius: "25px",
      "& fieldset": { borderColor: "transparent" },
      "&:hover fieldset": { borderColor: "transparent" },
      "&.Mui-focused fieldset": { borderColor: "transparent" },
    },
    "&:hover": { bgcolor: mode === "dark" ? "#555" : "rgb(240, 240, 240)" },
    "&:focus-within": {
      width: "600px",
      bgcolor: mode === "dark" ? "#555" : "rgb(240, 240, 240)",
      "& .MuiInputAdornment-root .MuiSvgIcon-root": {
        color: "blue",
        transform: "scale(1.4) rotateY(360deg)",
        transition: "transform 1.1s ease-in-out, color 0.3s ease-in-out",
      },
    },
  }}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchRoundedIcon />
      </InputAdornment>
    ),
    sx: {
      "&::placeholder": { color: mode === "dark" ? "#bbb" : "#888" },
    },
  }}
/>;
