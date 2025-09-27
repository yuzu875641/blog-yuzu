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
    
    // オプショナルチェイニング `?.` を使って、プロパティの存在を確認
    const videos = searchResults.videos.map(video => ({
      id: video.id,
      title: video.title?.text || null,
      thumbnail: video.thumbnails?.[0]?.url || null,
      views: video.view_count?.text || null,
      author: video.author?.name || null,
      duration: video.duration?.text || null
    }));
    
    // 同様にプレイリストも修正
    const playlists = searchResults.playlists.map(playlist => ({
      id: playlist.id,
      title: playlist.title?.text || null,
      video_count: playlist.video_count || null
    }));

    res.status(200).json({ videos, playlists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to perform search' });
  }
}
