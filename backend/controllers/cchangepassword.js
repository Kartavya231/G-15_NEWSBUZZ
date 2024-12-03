// const usermodel = require("../models/muser");
// const CryptoJS = require('crypto-js');

import {usermodel} from "../models/muser.js";
// const CryptoJS = require('crypto-js');
import CryptoJS from 'crypto-js';


const ChangePassword = async (req, res) => {

  const { CurrentPassword, password } = req.body;


  const user = await usermodel.findById(req.user.id);


  if (!user) {
    return res.status(210).json({ success: false, message: "User associated with this email doesn't exist" });
  }

  // console.log(CurrentPassword, password);

  const decrypteuserExistPwd = CryptoJS.AES.decrypt(user.password, "news-aggregator-secret").toString(CryptoJS.enc.Utf8);
  const decryptCurrentPassword = CryptoJS.AES.decrypt(CurrentPassword, "news-aggregator-secret").toString(CryptoJS.enc.Utf8);

  // console.log(decrypteuserExistPwd);
  // console.log('asdf');
  // console.log("current", decryptCurrentPassword);

  if (decryptCurrentPassword !== decrypteuserExistPwd) {
    return res.status(210).json({ success: false, message: "Enter Correct password" });
  }

  user.password = password;
  await user.save();


  return res.status(202).json({ success: true, message: "Password reset successfully" });

}

// module.exports = { ChangePassword };

export { ChangePassword };