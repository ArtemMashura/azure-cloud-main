const express = require('express');
const router = express.Router();
const path = require('path');
const getAllGoods = require('../controllers/goods/getAllGoods');

router.get('^/showItem$|/index(.html)?', (req, res) =>{
    res.sendFile(path.resolve("views/showItem.html"))
});

router.post('/*', getAllGoods.handleGetFilteredGoods);

module.exports = router;