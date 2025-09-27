import { Innertube } from 'youtubei.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const videoId = req.query.id;

  if (!videoId) {
    return res.status(400).json({ message: 'Missing video ID' });
  }

  try {
    const yt = await Innertube.create();
    const videoInfo = await yt.getBasicInfo(videoId);
    
    // streaming_dataが存在するかどうかをチェック
    if (!videoInfo.streaming_data || !videoInfo.streaming_data.formats) {
      return res.status(404).json({ message: 'No stream data available for this video' });
    }

    const streamUrl = videoInfo.streaming_data.formats
      .filter(f => f.mime_type.startsWith('video/mp4'))
      .sort((a, b) => b.quality_label.localeCompare(a.quality_label))[0]?.url;

    if (!streamUrl) {
      return res.status(404).json({ message: 'Stream URL not found' });
    }

    res.status(200).json({
      title: videoInfo.basic_info.title,
      author: videoInfo.basic_info.author,
      views: videoInfo.basic_info.view_count,
      streamUrl: streamUrl
    });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to get video information' });
  }
}
