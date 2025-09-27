import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleSelectVideo = async (videoId) => {
    try {
      const res = await fetch(`/api/get-video-info?id=${videoId}`);
      const data = await res.json();
      setSelectedVideo(data);
    } catch (error) {
      console.error('Failed to get video info:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Head>
        <title>Yuzutube 🍋</title>
      </Head>

      <h1>Yuzutube 🍋</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for videos or playlists..."
          style={{ width: '300px', padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px' }}>Search</button>
      </form>

      {selectedVideo && (
        <div style={{ marginTop: '20px' }}>
          <h2>{selectedVideo.title}</h2>
          <p>by {selectedVideo.author.name}</p>
          <p>{selectedVideo.views} views</p>
          <video controls width="640" src={selectedVideo.streamUrl}>
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {results && (
        <div style={{ marginTop: '20px' }}>
          <h3>Search Results</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.videos.map(video => (
              <li key={video.id} style={{ marginBottom: '15px', border: '1px solid #ccc', padding: '10px' }}>
                <img src={video.thumbnail} alt={video.title} style={{ width: '150px' }} />
                <div style={{ marginLeft: '10px' }}>
                  <h4><a href="#" onClick={() => handleSelectVideo(video.id)}>{video.title}</a></h4>
                  <p>Views: {video.views} | Duration: {video.duration}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
              }
