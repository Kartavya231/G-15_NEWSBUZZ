// const searchLocation_model = require("../models/msearchLocation.js");

import {searchLocation_model} from "../models/msearchLocation.js";


const addSearchLocation = async (req, res, Text) => {

  
  let searchText = Text;
  console.log(searchText);
  searchText = searchText.toLowerCase();
  const user_id = req.user.id;

  if (!searchText) {
    return res.status(210).json({ success: false, message: "Search Text is required" });
  }

  const searchLocation = await searchLocation_model.findOne({ user_id });

  if (!searchLocation) {
    const newSearchLocation = new searchLocation_model({
      user_id, searchText: [{ text: searchText }]
    });

    await newSearchLocation.save();
    return;
  }

  const search = searchLocation.searchText.find((search) => search.text === searchText);
  //   The object returned by find() is a reference to the element inside the searchText array, not a separate copy.
  // Modifying search.count directly updates the original array element within searchLocation.

  if (search) {
    search.count += 1;
    search.date = Date.now();
  } else {
    searchLocation.searchText.push({ text: searchText });
  }

  await searchLocation.save();
  return;


}

export {addSearchLocation};