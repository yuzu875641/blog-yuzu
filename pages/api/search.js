import { Innertube } from 'youtubei.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ message: 'Missing search query' });
  }

  try {
    const yt = await Innertube.create();
    const searchResults = await yt.search(query);
    
    // 必要な情報のみをフィルタリングして返す
    const videos = searchResults.videos.map(video => ({
      id: video.id,
      title: video.title.text,
      thumbnail: video.thumbnails[0].url,
      views: video.view_count.text,
      author: video.author.name,
      duration: video.duration.text
    }));
    
    const playlists = searchResults.playlists.map(playlist => ({
      id: playlist.id,
      title: playlist.title.text,
      video_count: playlist.video_count
    }));

    res.status(200).json({ videos, playlists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to perform search' });
  }
}
