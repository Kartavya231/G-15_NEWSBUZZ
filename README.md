# NEWSBUZZ

Welcome to the **NEWSBUZZ**, a one-stop platform to access, explore, and interact with diverse news content from multiple channels. Our mission is to make news discovery easy, engaging, and tailored to individual preferences.

---

## Table of Contents

1. [About the Project](#about-the-project)  
2. [Features](#features)  
3. [Technologies Used](#technologies-used)  
4. [Usage](#usage)  
5. [Acknowledgments](#acknowledgments)  

---

## About the Project

The **NEWSBUZZ** bridges the gap between readers and high-quality news from multiple sources. Users can personalize their experience by following preferred channels, bookmarking articles, and engaging with content through likes, comments, and shares. The platform also allows interactive features like quizzes to make the news reading experience more enjoyable.

---

## Features

- 📰 **Diverse News Channels**: Explore news from multiple sources in one place.  
- 🔍 **Search & Filters**: Search news by topics, keywords, categories, or date.  
- 🏷️ **Personalized Feed**: Follow/unfollow channels or mute them to curate your feed.  
- 💬 **Article Engagement**: Like, share, and comment on articles.  
- 📌 **Bookmarks**: Save articles for later reference.  
- 🧩 **Quizzes**: Participate in topic-specific quizzes and view your scores.  
- 🕒 **Reading History**: Access previously read articles.  
- 🔒 **User Authentication**: Secure signup/login options with email verification.   
- 🔔 **Notifications**: Stay updated with new articles and interactions.  

---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript (React)  
- **Backend**: Node.js, Express, MongoDB  
- **Authentication**: JWT-based authentication, Email OTP verification  
- **Hosting**: Render (Frontend and Backend)  
- **Testing**:   
  - Jest for unit testing  
  - Selenium IDE for GUI testing  
  - ApacheJmeter for load testing
- **Documentation**: 
  - User stories, class diagram, Object design, System design, Sequence diagram and Software requirement specifications

---

## Usage

The platform is deployed and accessible via the following link:  
[NEWSBUZZ](https://normal-frontend.onrender.com/)

For local setup, follow these steps:  

### Prerequisites

1. Node.js installed on your system  
2. MongoDB running locally or on a cloud service  
3. Git installed  

### Steps

1. Clone the repository:  
   ```bash
   git clone https://github.com/Kartavya231/G-15_NEWSBUZZ.git
2. Set up .env and other files:


-  Create a **/src/config.js** in the client directory with the following

   - BACKEND_API: "YOUR_BACKEND_API",
   - BACKEND_API_SCRAP: 'YOUR_BACKEND_API_SCRAP(vercel)',
   - PWD_SECRET: 'YOUR_PWD_SECRET'


-  Create a **.env** in the server directory with the following

   - PORT = (Enter Port)
   - MONGO_URL = (Enter MongoDB URL)
   - JWT_SECRET = (Enter JWT token Secret key)
   - PWD_SECRET = (Enter Secret key to Hash Password)
   - CLOUDINARY_CLOUD_NAME = (Enter Cloudinary provided cloud name)  
   - CLOUDINARY_API_KEY = (Enter Cloudinary provided api key)
   - CLOUDINARY_API_SECRET = (Enter Cloudinary provided api secret)
   - CLIENT_ID = (Enter Google provided client id)
   - CLIENT_SECRET = (Enter Google provided client secret)
   - REDIRECT_URI = (Enter Google provided Redirect URL)
   - REFRESH_TOKEN = (Enter Google provided Refresh token)

-  Create a **.env** in the client directory
   - LOCAL_BACKEND_URL=http://localhost:3000
   - LOCAL_FRONTEND_URL=http://localhost:9000
     
3. Set up Backend:
    ```bash
    $ cd backend
    $ npm install
    $ npm run dev 
4. Set up frontend:
    ```bash
    $ cd frontend
    $ npm install
    $ npm run start
    
## Acknowledgments
### References used:
- [Javascript-Course](https://www.youtube.com/watch?v=lfmg-EJ8gm4)
- [Node.js-Course](https://www.youtube.com/playlist?list=PLuJJZ-W1NwdqgvE0D-1SMS7EpWIC5cKqu)
- [HTML-CSS-Course](https://www.w3schools.com/html/html_css.asp)
- [JWT-Auth-Reference](https://www.youtube.com/playlist?list=PLinedj3B30sDby4Al-i13hQJGQoRQDfPo)
### Contributors:
- [@Boghara Zeel - 202201201](https://github.com/202201201)
- [@Rathod Harsh - 202201212](https://github.com/harshrathod0585)
- [@Akabari Kartavya - 202201213](https://github.com/Kartavya231)
- [@Akbari Kamal - 202201215](https://github.com/kamal-akbari-13)
- [@Sarvan Meet - 202201218](https://github.com/202201218)
- [@Lathiya Yashvi - 202201220](https://github.com/YashviLathiya)
- [@Chauhan Fajilmiya - 202201221](https://github.com/202201221)
- [@Vaghani Parthiv - 202201249](https://github.com/thankyou0)
- [@Vasa Saumya - 202201254](https://github.com/SaumyaVasa3084)
- [@Ayush Pandita- 202201256](https://github.com/AyushPandita111)

---
