// const quickSearch_model = require("../models/mquicksearch");

import { quickSearch_model } from "../models/mquicksearch.js";

const getQuickSearch = async (req, res) => {

  // console.log("getQuickSearch");

  // try {

  const user_id = req.user.id;

  if (!user_id) {
    return res.status(210).json({ success: false, message: "User id is required" });
  }

  const quickSearchUser = await quickSearch_model.findOne({ user_id });

  // console.log("quickSearchUser", quickSearchUser);

  if (!quickSearchUser) {
    return res.status(210).json({ success: false, message: "No quick search found for the user" });
  }

  // console.log("quickSearchUser.quickSearchText", quickSearchUser.quickSearchText);


  res.status(202).json({ success: true, quickSearchText: quickSearchUser.quickSearchText });

  // } catch (error) {
  //   res.status(210).json({ message: error.message });
  // }
}



const addQuickSearch = async (req, res) => {
  try {
    const user_id = req.user.id; // Extract user ID from the request (e.g., via middleware)

    // Validate the user_id
    if (!user_id) {
      return res.status(210).json({ success: false, message: "User ID is required." });
    }

    const { quickSearchTextFromFrontend } = req.body;

    // Validate quickSearchTextFromFrontend
    if (!quickSearchTextFromFrontend) {
      return res.status(210).json({ success: false, message: "Quick Search Text is required." });
    }

    // Check if the user already has a quick search entry
    let quickSearchUser = await quickSearch_model.findOne({ user_id });

    if (!quickSearchUser) {
      // If no quickSearch record exists, create a new one
      const newQuickSearch = new quickSearch_model({
        user_id,
        quickSearchText: [quickSearchTextFromFrontend], // Add the new quick search text
      });

      await newQuickSearch.save();

      return res
        .status(202)
        .json({ success: true, message: "Quick Search added successfully." });
    }

    // If quickSearchUser exists, append the new text to the existing array
    quickSearchUser.quickSearchText.push(quickSearchTextFromFrontend);

    await quickSearchUser.save();

    return res
      .status(202)
      .json({ success: true, message: "Quick Search updated successfully." });
  } catch (error) {
    // Catch any errors and return a response
    return res.status(210).json({ success: false, message: error.message });
  }
};



const deleteQuickSearch = async (req, res) => {
  console.log("deleteQuickSearch");
  try {

    const user_id = req.user.id;

    if (!user_id) {
      return res.status(210).json({ success: false, message: "User id is required" });
    }

    const { quickSearchText } = req.body;
    console.log(quickSearchText);

    if (!quickSearchText) {
      return res.status(210).json({ success: false, message: "Quick Search Text is required" });
    }

    const quickSearchUser = await quickSearch_model.findOne({ user_id });

    if (!quickSearchUser) {
      return res.status(210).json({ success: false, message: "No quick search found for the user" });
    }

    quickSearchUser.quickSearchText = quickSearchUser.quickSearchText.filter((quickSearch) => quickSearch !== quickSearchText);

    console.log(quickSearchUser.quickSearchText);
    await quickSearchUser.save();

    res.status(202).json({ success: true, message: "Quick Search deleted successfully" });

  } catch (error) {
    res.status(210).json({ message: error.message });
  }
}




// module.exports = { addQuickSearch, deleteQuickSearch, getQuickSearch };

export { addQuickSearch, deleteQuickSearch, getQuickSearch };
// const temp = { addQuickSearch, deleteQuickSearch, getQuickSearch };

// export default temp;
