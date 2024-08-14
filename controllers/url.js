const shortid = require('shortid');
const URL = require('../models/urls');

async function handleGenerateShortUrls(req,res){
    const body = req.body;
    if(!body.url) return res.status(400).json( { error : "url is required"});
    const shortID = shortid();
    await URL.create({
        shortId : shortID,
        redirectUrl : body.url,
        visitHistory : [],
        createdBy : req.user._id

    });
    return res.render("home",({
        id :  shortID,
    }))
}

async function handleGetUrlAnalytics(req,res){
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
    return res.json({ totalClicks: result.visitHistory.length , analytics:result.visitHistory })
};

module.exports = {
    handleGenerateShortUrls,
    handleGetUrlAnalytics
}