const Mute = require('../models/mute');
const muteprovider = async(req,res,next)=>{
    let {id}=req.params;
    let provider = await mnewsProvider.findById(id);
    const mute = await Mute.findOne({user:req.user._id});
    if(mute==null){
        const newmute = new Mute({user:req.user._id,mutedURL:[provider.baseURL]});
        await newmute.save();
    }
    else {
        const ismute=mute.mutedURL.some(muteurl => muteurl.equals(provider.baseURL));
        if(!ismute){
        mute.mutedURL.push(provider.baseURL);
        await mute.save();
    }
    }
    res.status(202).json({success:true, mutedURL:mute.mutedURL});
}
const unmuteprovider = async(req,res,next)=>{
    let {id}=req.params;
    let provider = await mnewsProvider.findById(id);
    const mute = await Mute.findOne({user:req.user._id});
    if(mute!=null){
        const ismute=mute.mutedURL.some(muteurl => muteurl.equals(provider.baseURL));
        if(ismute){
        mute.mutedURL=mute.mutedURL.filter(muteurl => !muteurl.equals(provider.baseURL));
        await mute.save();
    }
    }
    res.status(202).json({success:true, mutedURL:mute.mutedURL});
  }

module.exports = {muteprovider,unmuteprovider};