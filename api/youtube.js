import fetch from 'node-fetch';

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = 'UC1bCh-EWF8JsNtrlMfdYelA';

export default async function handler(req, res) {
  try {
    if (!API_KEY) {
      console.error('Missing YOUTUBE_API_KEY in environment variables');
      return res.status(500).json({ error: 'Server misconfiguration' });
    }

    // Get channel statistics
    const statsUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`;
    const statsResponse = await fetch(statsUrl);
    const statsData = await statsResponse.json();

    if (!statsData.items?.length) {
      return res.status(404).json({ error: 'YouTube channel not found' });
    }

    const stats = statsData.items[0].statistics;

    // Get latest video
    const videosUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=1`;
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();

    if (!videosData.items?.length) {
      return res.status(404).json({ error: 'No videos found for this channel' });
    }

    const latestVideo = videosData.items[0];

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json({
      subscribers: stats.subscriberCount,
      totalViews: stats.viewCount,
      latestVideo: {
        id: latestVideo.id?.videoId || null,
        title: latestVideo.snippet?.title || '',
        thumbnail: latestVideo.snippet?.thumbnails?.medium?.url || '',
        publishedAt: latestVideo.snippet?.publishedAt || '',
      },
    });
  } catch (error) {
    console.error('YouTube API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
