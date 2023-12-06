const express = require('express');
const router = express.Router();
const path = require('path');
const addThumbnail = require('../controllers/blob/addThumbnail');
const addGood = require('../controllers/goods/addGood')
const editGood = require('../controllers/goods/editGood')
const deleteGood = require('../controllers/goods/deleteGood')


router.get('^/addBlob$|/index(.html)?', (req, res) =>{
    res.sendFile(path.resolve("views/addBlob.html"))
});
router.post('/addBlob', addThumbnail.handleAddThumbnail)

router.get('^/addGood$|/index(.html)?', (req, res) =>{
    res.sendFile(path.resolve("views/addGood.html"))
});
router.post('/addGood', addGood.handleAddGood)

router.get('^/editGood$|/index(.html)?', (req, res) =>{
    res.sendFile(path.resolve("views/editGood.html"))
});
router.put('/editGood', editGood.handleEditGood)

router.delete('/deleteGood', deleteGood.handleDeleteGood)


module.exports = router;