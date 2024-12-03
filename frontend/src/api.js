import axios from "axios";
import config from "./config";



const GET = async (url) => {

  const headers = {
    'Content-Type': 'application/json',
    "authorization": "Bearer " + localStorage.getItem("token")
  };
  try {
    const response = await axios.get(config.BACKEND_API + url, { headers });
    return response;
  } catch (error) {
    console.error("GET request error:", error);
    // Handle the error gracefully
    return { success: false, message: "An error occurred while fetching data." };
  }
};

const POST = async (url, data) => {
  const headers = {
    'Content-Type': 'application/json',
    "authorization": "Bearer " + localStorage.getItem("token")
  };
  try {
    const response = await axios.post(config.BACKEND_API + url, data, { headers });
    return response;
  } catch (error) {
    console.error("POST request error:", error);
    // Handle the error gracefully
    return { success: false, message: "An error occurred while sending data." };
  }
};

const DELETE = async (url, data) => {
  const headers = {
    'Content-Type': 'application/json',
    "authorization": "Bearer " + localStorage.getItem("token")
  };
  try {
    const response = await axios.delete(config.BACKEND_API + url, data, { headers });
    return response;
  } catch (error) {
    console.error("POST request error:", error);
    // Handle the error gracefully
    return { success: false, message: "An error occurred while sending data." };
  }
};

export { GET, POST,DELETE };