const express = require('express');
const router = express.Router();
const createCategory = require('../controllers/category/createCategory');
const updateCategory = require('../controllers/category/updateCategory')
const deleteCategory = require('../controllers/category/deleteCategory')

router.post("/*", createCategory.handleCreateCategory);

router.put("/*", updateCategory.handleUpdateCategory);

router.delete("/*", deleteCategory.handleDeleteCategory)

module.exports = router;