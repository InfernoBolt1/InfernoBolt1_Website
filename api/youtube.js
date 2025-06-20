import fetch from 'node-fetch';

const API_KEY = process.env.YOUTUBE_API_KEY; // Set this in Vercel environment variables
const CHANNEL_ID = 'UC1bCh-EWF8JsNtrlMfdYelA'; // Your channel ID

export default async function handler(req, res) {
  try {
    // Fetch channel stats
    const statsUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`;
    const statsResponse = await fetch(statsUrl);
    const statsData = await statsResponse.json();

    if (!statsData.items || statsData.items.length === 0) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const stats = statsData.items[0].statistics;

    // Fetch latest video
    const latestVideoUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=1`;
    const latestVideoResponse = await fetch(latestVideoUrl);
    const latestVideoData = await latestVideoResponse.json();

    if (!latestVideoData.items || latestVideoData.items.length === 0) {
      return res.status(404).json({ error: 'No videos found' });
    }

    const latestVideo = latestVideoData.items[0];

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json({
      subscribers: stats.subscriberCount,
      totalViews: stats.viewCount,
      latestVideo: {
        id: latestVideo.id.videoId,
        title: latestVideo.snippet.title,
        thumbnail: latestVideo.snippet.thumbnails.medium.url,
        publishedAt: latestVideo.snippet.publishedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
