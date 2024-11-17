const newsProvidermodel = require('../models/mnewsProvider.js');
const usermodel = require('../models/muser.js');

const getAllProviders = async (req, res) => {

  try {
    const providers = await newsProvidermodel.find();
    res.status(202).json({ success: true, providers });
  } catch (error) {
    res.status(210).json({ success: false, message: error });
  }
};

const getFollowingProviders = async (req, res) => {
  try {
    const user = await usermodel.findById(req.user.id).populate('following');

    const following = user.following;

    const followingProvidersDetails = await newsProvidermodel.find({ baseURL: { $in: following } });

    res.status(202).json({ success: true, providers: followingProvidersDetails });
  }
  catch (error) {
    console.log(error);
    res.status(210).json({ success: false, message: "Error while geting Following Providers" });
  }
};


module.exports = { getAllProviders, getFollowingProviders };
