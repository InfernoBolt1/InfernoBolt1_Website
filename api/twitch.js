import fetch from 'node-fetch';

const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const USER_LOGIN = 'infernobolt1';

let cachedToken = null;
let tokenExpiry = 0;

async function getOAuthToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry) return cachedToken;

  const tokenUrl = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;
  const response = await fetch(tokenUrl, { method: 'POST' });
  const data = await response.json();

  if (!data.access_token) {
    throw new Error('Failed to obtain Twitch OAuth token');
  }

  cachedToken = data.access_token;
  tokenExpiry = now + (data.expires_in * 1000) - 60000;

  return cachedToken;
}

export default async function handler(req, res) {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error('Missing Twitch credentials in environment variables');
      return res.status(500).json({ error: 'Server misconfiguration' });
    }

    const token = await getOAuthToken();

    const headers = {
      'Client-ID': CLIENT_ID,
      Authorization: `Bearer ${token}`,
    };

    // Get user info
    const userRes = await fetch(`https://api.twitch.tv/helix/users?login=${USER_LOGIN}`, { headers });
    const userData = await userRes.json();

    if (!userData.data?.length) {
      return res.status(404).json({ error: 'Twitch user not found' });
    }

    const user = userData.data[0];

    // Get followers
    const followersRes = await fetch(`https://api.twitch.tv/helix/users/follows?to_id=${user.id}`, { headers });
    const followersData = await followersRes.json();

    // Check if live
    const liveRes = await fetch(`https://api.twitch.tv/helix/streams?user_login=${USER_LOGIN}`, { headers });
    const liveData = await liveRes.json();

    const isLive = liveData.data?.length > 0;
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
    console.error('Twitch API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
