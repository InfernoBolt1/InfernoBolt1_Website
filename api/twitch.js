import fetch from 'node-fetch';

const CLIENT_ID = process.env.TWITCH_CLIENT_ID; // Your Twitch client ID in Vercel env vars
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET; // Your Twitch client secret
const USER_LOGIN = 'infernobolt1'; // Your Twitch username

// Twitch OAuth token cache (simple in-memory, resets on cold start)
let cachedToken = null;
let tokenExpiry = 0;

async function getOAuthToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry) return cachedToken;

  const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;
  const response = await fetch(url, { method: 'POST' });
  const data = await response.json();

  cachedToken = data.access_token;
  tokenExpiry = now + data.expires_in * 1000 - 60000; // 1 min early refresh

  return cachedToken;
}

export default async function handler(req, res) {
  try {
    const token = await getOAuthToken();

    // Get user info (id, follower count)
    const userRes = await fetch(`https://api.twitch.tv/helix/users?login=${USER_LOGIN}`, {
      headers: {
        'Client-ID': CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    });
    const userData = await userRes.json();

    if (!userData.data || userData.data.length === 0) {
      return res.status(404).json({ error: 'Twitch user not found' });
    }

    const user = userData.data[0];

    // Get follower count
    const followersRes = await fetch(`https://api.twitch.tv/helix/users/follows?to_id=${user.id}`, {
      headers: {
        'Client-ID': CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    });
    const followersData = await followersRes.json();

    // Check if live
    const liveRes = await fetch(`https://api.twitch.tv/helix/streams?user_login=${USER_LOGIN}`, {
      headers: {
        'Client-ID': CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    });
    const liveData = await liveRes.json();

    const isLive = liveData.data && liveData.data.length > 0;
    const streamInfo = isLive ? liveData.data[0] : null;

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json({
      followers: followersData.total || 0,
      isLive,
      streamInfo,
      user: {
        displayName: user.display_name,
        profileImage: user.profile_image_url,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default async function handler(req, res) {
  try {
    // your code
  } catch (error) {
    console.error('YouTube API error:', error);  // <-- here
    res.status(500).json({ error: error.message });
  }
}
