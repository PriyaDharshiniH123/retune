const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
  createPlaylist,
  getPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist
} = require('../controllers/playlistController');

router.post('/', verifyToken, createPlaylist);
router.get('/', verifyToken, getPlaylists);
router.get('/:id', verifyToken, getPlaylistById);
router.put('/:id', verifyToken, updatePlaylist);
router.delete('/:id', verifyToken, deletePlaylist);
router.post('/:id/songs', verifyToken, addSongToPlaylist);
router.delete('/:id/songs/:songId', verifyToken, removeSongFromPlaylist);

module.exports = router;