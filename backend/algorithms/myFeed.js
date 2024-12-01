import mongoose from "mongoose";
import { searchLocation_model } from "../models/msearchLocation.js";
import { ScrapForFeed } from "../algorithms/ScrapForFeed.js";
import { usermodel } from "../models/muser.js";

const getTextByCount = async (id) => {

  const resultByCount = await searchLocation_model.aggregate([
    { $match: { user_id: new mongoose.Types.ObjectId(id) } },  // Match user_id
    { $unwind: "$searchText" },  // Flatten the searchText array
    { $sort: { "searchText.count": -1 } },  // Sort by count in descending order
    { $project: { _id: 0, text: "$searchText.text" } }  // Project only the 'text' field
  ]);


  const resultByUpdatedAt = await searchLocation_model.aggregate([
    { $match: { user_id: new mongoose.Types.ObjectId(id) } },  // Match user_id
    { $unwind: "$searchText" },  // Flatten the searchText array
    { $sort: { "searchText.updateAt": -1 } },  // Sort by count in descending order
    { $project: { _id: 0, text: "$searchText.text" } }  // Project only the 'text' field
  ]);


  if (resultByCount.length === 0 && resultByUpdatedAt.length === 0) {
    return [];
  }

  const textArrayForCount = resultByCount.map(item => item.text);
  const textArrayForUpdatedAt = resultByUpdatedAt.map(item => item.text);

  const interleavedSet = new Set();  // Use a Set to avoid duplicates
  const maxLength = 8;  // Set maximum length

  const totalLength = Math.max(textArrayForCount.length, textArrayForUpdatedAt.length);

  // Interleave the two arrays and add to the Set
  for (let i = 0; i < totalLength; i++) {
    if (interleavedSet.size >= maxLength) break;  // Stop if the set reaches the max length

    if (i < textArrayForCount.length) {
      interleavedSet.add(textArrayForCount[i]);
    }
    if (interleavedSet.size >= maxLength) break;  // Check again after adding

    if (i < textArrayForUpdatedAt.length) {
      interleavedSet.add(textArrayForUpdatedAt[i]);
    }
  }
  const interleavedArray = Array.from(interleavedSet);

  if (interleavedArray.length === 0) {
    return [];
  }
  return interleavedArray;
};


let TextArray = [];


const ByText = async (req, res) => {


  try {
    const { id } = req.user;

    const textId = req.params.textId;

    if (textId == 0) {
      TextArray = (await getTextByCount(id));
    }

    let firstelement = [];

    firstelement.push(TextArray[textId]);

    let ArticlesByText = (await ScrapForFeed(firstelement));
    return res.status(202).json({ success: true, partialArticles: ArticlesByText });
  } catch (error) {
    console.error("Error fetching user feed:\n", error);
    return res.status(210).json({ message: "Internal Server Error" });
  }
};


let userTopics = [];


const ByTopic = async (req, res) => {

  try {

    const { id } = req.user;

    const topicId = req.params.topicId;

    if (topicId == 0) {

      const user = await usermodel.findById(id);

      if (!user) {

        return res.status(210).json({ message: "User not found" });
      }


      let OneElementArray = [];
      OneElementArray.push(user.topics[topicId]);


      let ArticlesByTopic = (await ScrapForFeed(OneElementArray));

      return res.status(202).json({ success: true, partialArticles: ArticlesByTopic });

    } else {


      let OneElementArray = [];

      OneElementArray.push(userTopics[topicId]);

      let ArticlesByTopic = (await ScrapForFeed(OneElementArray));

      return res.status(202).json({ success: true, partialArticles: ArticlesByTopic });

    }

  } catch (error) {

    console.error("Error fetching user feed:\n", error);

    return res.status(210).json({ message: "Internal Server Error" });

  }
}

export { ByText, ByTopic };
