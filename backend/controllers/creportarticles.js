// const reportarticlesModel = require('../models/reportarticles');
// const newsProvidermodel = require('../models/newsProvider');

import {reportarticlesModel} from '../models/mreportarticles.js';
import {newsProvidermodel} from '../models/mnewsProvider.js';


const AddreportArticles = async (req, res) => {

  try {
    const { title, link, num } = req.body;

    const existingreportarticles = await reportarticlesModel.findOne({ link });

    if (existingreportarticles) {

      const updatedreportarticles = await reportarticlesModel.findOneAndUpdate({ link }, { num: num + 1 });

      if (updatedreportarticles)
        return res.status(202).json({ success: true, message: "Article Reported Successfully" });
      else
        return res.status(210).json({ success: false, message: "Article Report Failed" });
    }
    else {
      const newreportarticles = new reportarticlesModel({ title, link, num });

      await newreportarticles.save();

      if (newreportarticles)
        return res.status(202).json({ success: true, message: "Article Reported Successfully" });
      else
        return res.status(210).json({ success: false, message: "Article Report Failed" });
    }
  } catch (error) {
    res.status(210).json({ error: error.message });
  }
}

const GetreportArticles = async (req, res) => {
  try {
    // Fetch the baseURL from the provider model
    const provider = await newsProvidermodel.findOne({ provider_id: req.user._id });

    if (!provider) {
      return res.status(210).json({ success: false, message: "Error finding Provider" });
    }
    const BaseURL = provider.baseURL;
    // Use regex to find links that start with the BaseURL
    const reportarticles = await reportarticlesModel.find({ link: { $regex: `^${BaseURL}` } });

    return res.status(202).json({ success: true, reportarticles });
  } catch (error) {
    console.error("Error fetching report articles:", error);
    return res.status(210).json({ success: false, message: "Internal Server Error" });
  }
};


module.exports = { AddreportArticles, GetreportArticles };