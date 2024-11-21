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
const createChannel = async (req, res) => {
  const { name, baseURL } = req.body;

  let logoURL = '';

  try {
    if (req.file) {
      const cloudinary_res = await cloudinary_v2.uploader.upload(req.file.path, {
        folder: 'news-aggregator',
        resource_type: 'auto',
      });
      logoURL = cloudinary_res.secure_url;
    }


    const providerExist = await usermodel.findById(req.user.id);

    if (!providerExist) {
      return res.status(210).json({ success: false, message: 'User not found' });
    }

    const newChannel = new newsProvidermodel({
      name,
      baseURL,
      logo: logoURL,
      provider_id: req.user.id,
    });

    await newChannel.save();
    res.status(202).json({ success: true, message: 'Channel created successfully', channel: newChannel });
  } catch (error) {
    console.error('Error creating channel:', error);
    res.status(210).json({ success: false, message: 'Error creating channel', error });
  }
};


const getChannels = async (req, res) => {

  // console.log(req.user);

  try {
    // console.log(req.user.id);

    const channels = await newsProvidermodel.find({ provider_id: req.user.id });

    console.log(channels);

    res.status(202).json({ success: true, channels });
  } catch (error) {
    res.status(210).json({ success: false, message: error });
  }
};

const deleteChannel = async (req, res) => {
  const { id } = req.params;

  try {
    const channel = await newsProvidermodel.findById(id);

    if (!channel) {
      return res.status(210).json({ success: false, message: 'Channel not found' });
    }

    await newsProvidermodel.findByIdAndDelete(id);
    res.status(202).json({ success: true, message: 'Channel deleted successfully' });

  } catch (error) {
    res.status(210).json({ success: false, message: error });
  }
}




module.exports = { getAllProviders,getFollowingProviders, createChannel, getChannels, deleteChannel};