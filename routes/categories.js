const express = require('express');
const router = express.Router();
const createCategory = require('../controllers/createCategory');
const updateCategory = require('../controllers/updateCategory')
const deleteCategory = require('../controllers/deleteCategory')

router.post("/*", createCategory.handleCreateCategory);

router.put("/*", updateCategory.handleUpdateCategory);

router.delete("/*", deleteCategory.handleDeleteCategory)

module.exports = router;