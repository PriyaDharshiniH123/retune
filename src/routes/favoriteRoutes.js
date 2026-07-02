const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favoriteController');

console.log('verifyToken:', typeof verifyToken);
console.log('addFavorite:', typeof addFavorite);
console.log('removeFavorite:', typeof removeFavorite);
console.log('getFavorites:', typeof getFavorites);

router.post('/', verifyToken, addFavorite);
router.delete('/:songId', verifyToken, removeFavorite);
router.get('/', verifyToken, getFavorites);

module.exports = router;