const express = require('express');
const router = express.Router();
const path = require('path');
const addThumbnail = require('../controllers/blob/addThumbnail');


router.get('^/$|/index(.html)?', (req, res) =>{
    res.sendFile(path.resolve("views/addBlob.html"))
});

router.post('/', addThumbnail.handleAddThumbnail)

module.exports = router;