const express = require('express');
const router = express.Router();
const {
  createSong,
  getSongs,
  getSongById,
  updateSong,
  deleteSong,
  discoverSongs
} = require('../controllers/songController');

router.post('/', createSong);
router.get('/', getSongs);
router.get('/discover', discoverSongs);
router.get('/:id', getSongById);
router.put('/:id', updateSong);
router.delete('/:id', deleteSong);

module.exports = router;