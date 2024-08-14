const express = require('express');
const router = express.Router();

const {handleGenerateShortUrls, handleGetUrlAnalytics} = require('../controllers/url');

router.post('/',handleGenerateShortUrls)

router.get('/analytics/:shortId', handleGetUrlAnalytics)

module.exports = router;