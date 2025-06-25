import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = 'UCBeAkr6PGdN-A6mlUpUY0UQ'; // replace with your actual channel ID

    // 1. Get channel statistics and uploads playlist ID
    const channelResp = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics,contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`);
    const channelData = await channelResp.json();

    const stats = channelData.items[0].statistics;
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // 2. Get latest video from uploads playlist
    const uploadsResp = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${uploadsPlaylistId}&key=${API_KEY}`);
    const uploadsData = await uploadsResp.json();

    const latestVideoSnippet = uploadsData.items[0].snippet;
    const videoId = latestVideoSnippet.resourceId.videoId;

    // 3. Get view count of the latest video
    const videoStatsResp = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`);
    const videoStatsData = await videoStatsResp.json();

    const latestVideoViews = videoStatsData.items[0].statistics.viewCount;

    // 4. Construct final response
    const ytData = {
      subscribers: stats.subscriberCount,
      totalViews: stats.viewCount,
      latestVideo: {
        id: videoId,
        title: latestVideoSnippet.title,
        thumbnail: latestVideoSnippet.thumbnails.medium.url,
        views: latestVideoViews
      }
    };

    res.status(200).json(ytData);

  } catch (error) {
    console.error('YouTube API error:', error);
    res.status(500).json({ error: 'Failed to fetch YouTube data' });
  }
}
