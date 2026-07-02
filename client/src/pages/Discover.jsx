import { useState, useEffect } from 'react';
import api from '../api/axios';

function Discover() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/songs/discover')
      .then((res) => {
        setSongs(res.data.songs);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load songs');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-white p-6">Loading...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Discover — Anti-Trending</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {songs.map((song) => (
          <div key={song.id} className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold">{song.title}</h2>
            <p className="text-gray-400">Artist ID: {song.artist_id}</p>
            <p className="text-sm text-gray-500">Plays: {song.play_count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Discover;