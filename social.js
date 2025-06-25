async function fetchYoutubeData() {
  try {
    const res = await fetch('/api/youtube');
    if (!res.ok) throw new Error('Failed to fetch YouTube data');
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function fetchTwitchData() {
  try {
    const res = await fetch('/api/twitch');
    if (!res.ok) throw new Error('Failed to fetch Twitch data');
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

function formatNumber(num) {
  return Number(num).toLocaleString();
}

function createYouTubeEmbed(videoId) {
  return `
    <iframe 
      width="320" 
      height="180" 
      src="https://www.youtube.com/embed/${videoId}" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen
      title="Latest YouTube Video"
    ></iframe>
  `;
}

function createTwitchEmbed() {
  return `
    <iframe 
      src="https://player.twitch.tv/?channel=infernobolt1&parent=${window.location.hostname}" 
      height="180" 
      width="320" 
      frameborder="0" 
      scrolling="no" 
      allowfullscreen="true">
    </iframe>
  `;
}

async function updateSocialStats() {
  const container = document.getElementById('social-stats');
  container.innerHTML = '<p>Loading social data…</p>';

  const [ytData, twitchData] = await Promise.all([fetchYoutubeData(), fetchTwitchData()]);

  if (!ytData && !twitchData) {
    container.innerHTML = '<p>Failed to load social data.</p>';
    return;
  }

  let html = '';

  // YouTube stats
  if (ytData) {
	html += `
      <div class="social-section youtube-section">
        <h3>YouTube Stats</h3>
        <p>Subscribers: <strong>${formatNumber(ytData.subscribers)}</strong></p>
        <p>Total Views: <strong>${formatNumber(ytData.totalViews)}</strong></p>
        <p>Latest Video Views: <strong>${formatNumber(ytData.latestVideo.views)}</strong></p>
        <div class="video-embed">
          ${createYouTubeEmbed(ytData.latestVideo.id)}
        </div>
      </div>
    `;
  }

  // Twitch stats
  if (twitchData) {
    html += `
      <div class="social-section twitch-section">
        <h3>Twitch Stats</h3>
        <p>Followers: <strong>${formatNumber(twitchData.followers)}</strong></p>
        <p>Status: <strong>${twitchData.isLive ? 'LIVE NOW!' : 'Offline'}</strong></p>
        <div class="twitch-embed">
          ${twitchData.isLive ? createTwitchEmbed() : '<button id="show-twitch-player">Watch Twitch</button>'}
        </div>
      </div>
    `;
  }

  container.innerHTML = html;

  if (twitchData && !twitchData.isLive) {
    const btn = document.getElementById('show-twitch-player');
    btn.addEventListener('click', () => {
      btn.outerHTML = createTwitchEmbed();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateSocialStats();
});
