import mute_model from '../models/mmute.js';  // Assuming you're using ES6 imports

const addMute = async (req, res) => {
  const user_id = req.user.id;
  const { baseURL } = req.body;

  try {
    // Check if the user already has a mute document
    const isUserExist = await mute_model.findOne({ user: user_id });

    if (isUserExist) {
      // Check if the URL is already muted for the user
      const isURLExist = isUserExist.mutedURL.includes(baseURL);  // Use includes to check the array

      if (isURLExist) {
        return res.status(210).json({ success: false, message: "URL already muted" });
      }

      // If the URL is not already muted, add it to the mutedURLs array
      await mute_model.findOneAndUpdate(
        { user: user_id },
        { $push: { mutedURL: baseURL } }
      );
      return res.status(202).json({ success: true, message: "Provider muted successfully" });
    }

    // If no mute document exists for the user, create a new one with the mutedURL array
    const mute = new mute_model({
      user: user_id,
      mutedURL: [baseURL],  // Initialize mutedURLs with the first URL
    });

    await mute.save();
    return res.status(202).json({ success: true, message: "Provider muted successfully" });

  } catch (error) {
    console.error("Error while muting provider:", error);
    return res.status(210).json({ success: false, message: "Internal server error while muting provider" });
  }
}

const removeMute = async (req, res) => {
  const user_id = req.user.id;
  const { baseURL } = req.body;

  try {
    // Check if the user has a mute document
    const isUserExist = await mute_model.findOne({ user: user_id });

    if (isUserExist) {
      // Check if the URL is muted for the user
      const isURLExist = isUserExist.mutedURL.includes(baseURL);  // Use includes to check the array

      if (!isURLExist) {
        return res.status(210).json({ success: false, message: "URL not muted" });
      }

      // Remove the URL from the mutedURLs array
      await mute_model.findOneAndUpdate(
        { user: user_id },
        { $pull: { mutedURL: baseURL } }  // Use $pull to remove the URL
      );
      return res.status(202).json({ success: true, message: "Provider unmuted successfully" });
    }

    return res.status(210).json({ success: false, message: "URL not muted" });

  } catch (error) {
    console.error("Error while unmuting provider:", error);
    return res.status(210).json({ success: false, message: "Internal server error while unmuting provider" });
  }
}


const getMute = async (req, res) => {

  const user_id = req.user.id;
  const { baseURL } = req.body;

  try {

    const isUserExist = await mute_model.findOne({ user: user_id });

    if (isUserExist) {

      const isURLExist = isUserExist.mutedURL.includes(baseURL);

      if (isURLExist) {
        return res.status(202).json({ success: true, isMuted: true });
      } else {
        return res.status(202).json({ success: true, isMuted: false });
      }

    } else {
      return res.status(202).json({ success: true, isMuted: false });
    }

  } catch (error) {
    console.error("Error while getting mute status:", error);
    return res.status(210).json({ success: false, message: "Internal server error while getting mute status" });
  }
}
export { addMute, removeMute, getMute };
