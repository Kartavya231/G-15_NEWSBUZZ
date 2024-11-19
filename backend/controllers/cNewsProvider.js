const newsProvidermodel = require('../models/mNewsprovider.js');
const usermodel = require('../models/muser.js');

const getAllProviders = async (req, res) => {

  try {
    const providers = await newsProvidermodel.find();
    res.status(202).json({ success: true, providers });
  } catch (error) {
    res.status(210).json({ success: false, message: error });
  }
};



module.exports = { getAllProviders};