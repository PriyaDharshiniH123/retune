const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favoriteController');

router.post('/', verifyToken, addFavorite);
router.delete('/:songId', verifyToken, removeFavorite);
router.get('/', verifyToken, getFavorites);

module.exports = router;