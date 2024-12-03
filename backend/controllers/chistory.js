// const history_model = require("../models/mhistory");
import {history_model} from "../models/mhistory.js";

const gethistory = async (req, res, next) => {

    const user_id = req.user.id;
    let userHistory = await history_model.findOne({ userid: user_id });

    console.log(userHistory.historyData);
    if (userHistory) {
        res.status(202).json({ success: true, data: userHistory.historyData });
    } else {
        res.status(210).json({ success: false, message: "No History Found" });
    }
}

const removehistory = async (req, res, next) => {
    const user_id = req.user.id;

    const { baseURL } = req.body;

    let userHistory = await history_model.findOne({ userid: user_id });

    if (userHistory) {
        let newHistory = userHistory.historyData.filter((data) => data.link !== baseURL);
        userHistory.historyData = newHistory;
        await userHistory.save();
        res.status(202).json({ success: true, message: "Article Removed from History" });
    }
    else {
        res.status(210).json({ success: false, message: "History of Article not Found" });
    }
}



const addhistory = async (req, res, next) => {

    const user_id = req.user.id;

    const { title, link } = req.body;

    let userHistory = await history_model.findOne({ userid: user_id });

    if (userHistory) {

        let newHistory = { title: title, link: link, time: new Date() }

        userHistory.historyData.unshift(newHistory);
        await userHistory.save();
        res.status(202).json({ success: true, message: "Article Added to History" });
    }
    else {
        let newHistory = new history_model({ userid: user_id, historyData: [{ title: title, link: link, time: new Date() }] });
        await newHistory.save();
        res.status(202).json({ success: true, message: "Article Added to History" });
    }
}


const removeallhistory = async (req, res, next) => {
    const user_id = req.user.id;

    let userHistory = await history_model.findOne({ userid: user_id });

    if (userHistory) {
        userHistory.historyData = [];
        await userHistory.save();
        res.status(202).json({ success: true, message: "All History Articles Deleted" });
    }
    else {
        res.status(210).json({ success: false, message: "No History Found" });
    }
}

export { gethistory, addhistory, removehistory, removeallhistory };