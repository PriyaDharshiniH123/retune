const db = require('../config/db');

// Create a new playlist
const createPlaylist = async (req, res) => {
  const userId = req.user.id;
  const { name, is_public = 1 } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO playlists (user_id, name, is_public) VALUES (?, ?, ?)',
      [userId, name, is_public]
    );

    res.status(201).json({ message: 'Playlist created successfully', playlistId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all playlists for logged-in user
const getPlaylists = async (req, res) => {
  const userId = req.user.id;

  try {
    const [playlists] = await db.query(
      'SELECT * FROM playlists WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.status(200).json({ playlists });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get single playlist with its songs (ordered by position)
const getPlaylistById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const [playlists] = await db.query(
      'SELECT * FROM playlists WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    if (playlists.length === 0) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    const [songs] = await db.query(
      `SELECT s.*, ps.position FROM playlist_songs ps
       JOIN songs s ON ps.song_id = s.id
       WHERE ps.playlist_id = ?
       ORDER BY ps.position ASC, ps.added_at ASC`,
      [id]
    );

    res.status(200).json({ playlist: playlists[0], songs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update playlist details
const updatePlaylist = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { name, is_public } = req.body;

  try {
    const [existing] = await db.query(
      'SELECT * FROM playlists WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    await db.query(
      'UPDATE playlists SET name = ?, is_public = ? WHERE id = ?',
      [name, is_public, id]
    );

    res.status(200).json({ message: 'Playlist updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete playlist
const deletePlaylist = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const [existing] = await db.query(
      'SELECT * FROM playlists WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    await db.query('DELETE FROM playlists WHERE id = ?', [id]);

    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Add song to playlist (auto-increment position)
const addSongToPlaylist = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params; // playlist id
  const { song_id } = req.body;

  try {
    const [playlist] = await db.query(
      'SELECT * FROM playlists WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    if (playlist.length === 0) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    const [song] = await db.query('SELECT * FROM songs WHERE id = ?', [song_id]);
    if (song.length === 0) {
      return res.status(404).json({ message: 'Song not found' });
    }

    const [existing] = await db.query(
      'SELECT * FROM playlist_songs WHERE playlist_id = ? AND song_id = ?',
      [id, song_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Song already in playlist' });
    }

    const [countResult] = await db.query(
      'SELECT COUNT(*) AS count FROM playlist_songs WHERE playlist_id = ?',
      [id]
    );
    const nextPosition = countResult[0].count + 1;

    await db.query(
      'INSERT INTO playlist_songs (playlist_id, song_id, position) VALUES (?, ?, ?)',
      [id, song_id, nextPosition]
    );

    res.status(201).json({ message: 'Song added to playlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Remove song from playlist
const removeSongFromPlaylist = async (req, res) => {
  const userId = req.user.id;
  const { id, songId } = req.params;

  try {
    const [playlist] = await db.query(
      'SELECT * FROM playlists WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    if (playlist.length === 0) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    await db.query(
      'DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?',
      [id, songId]
    );

    res.status(200).json({ message: 'Song removed from playlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createPlaylist,
  getPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist
};