// const quickSearch_model = require("../models/mquicksearch");

import quickSearch_model from "../models/mquicksearch.js";

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

    const user_id = req.user.id;

    if (!user_id) {
      return res.status(210).json({ success: false, message: "User id is required" });
    }


    const { quickSearchTextFromFrontend } = req.body;

    if (!quickSearchTextFromFrontend) {
      return res.status(210).json({ success: false, message: "Quick Search Text is required" });
    }

    const quickSearchUser = await quickSearch_model.findOne({ user_id });

    // if (!quickSearchUser) {
    //   const newQuickSearch = new quickSearch_model({
    //     user_id, quickSearchText: [{ text: quickSearchTextFromFrontend }]
    //   });

    //   await newQuickSearch.save();
    //   return res.status(202).json({ success: true, message: "Quick Search added successfully" });
    // }

    quickSearchUser.quickSearchText.push({ text: quickSearchTextFromFrontend });

    res.status(202).json({ success: true, message: "Quick Search added successfully" });


  } catch (error) {
    res.status(210).json({ message: error.message });
  }
}


const deleteQuickSearch = async (req, res) => {
  try {

    const user_id = req.user.id;

    if (!user_id) {
      return res.status(210).json({ success: false, message: "User id is required" });
    }

    const { quickSearchTextFromFrontend } = req.body;

    if (!quickSearchTextFromFrontend) {
      return res.status(210).json({ success: false, message: "Quick Search Text is required" });
    }

    const quickSearchUser = await quickSearch_model.findOne({ user_id });

    if (!quickSearchUser) {
      return res.status(210).json({ success: false, message: "No quick search found for the user" });
    }

    quickSearchUser.quickSearchText = quickSearchUser.quickSearchText.filter((quickSearch) => quickSearch.text !== quickSearchTextFromFrontend);

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