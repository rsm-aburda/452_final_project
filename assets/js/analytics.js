const clientId = "a7269af82d7b490da8f1d5bf9eb152fa";
const redirectUri = "http://localhost:8888/callback/"; // Change to your hosted URL
const authEndpoint = "https://accounts.spotify.com/authorize";
const scopes = ["user-top-read"];
let accessToken = "";

// Step 1: Redirect to Spotify for Authorization
document.getElementById("authenticate").addEventListener("click", () => {
  const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scopes.join(
    "%20"
  )}`;
  window.location.href = authUrl;
});

// Step 2: Extract Access Token from URL
window.addEventListener("load", () => {
  const hash = window.location.hash;
  if (hash) {
    const token = hash
      .substring(1)
      .split("&")
      .find((elem) => elem.startsWith("access_token"))
      .split("=")[1];
    accessToken = token;
    fetchTopSongs();
  }
});

// Step 3: Fetch Top 10 Songs
async function fetchTopSongs() {
  try {
    const response = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=10", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    const trackIds = data.items.map((track) => track.id);
    displayTopSongs(data.items);
    fetchAudioFeatures(trackIds);
  } catch (error) {
    console.error("Error fetching top songs:", error);
  }
}

// Step 4: Fetch Audio Features for Tracks
async function fetchAudioFeatures(trackIds) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(",")}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const data = await response.json();
    generateTrackAttributesChart(data.audio_features);
    generatePopularityChart(data.audio_features);
  } catch (error) {
    console.error("Error fetching audio features:", error);
  }
}

// Step 5: Display Top Songs
function displayTopSongs(songs) {
  const topSongsElement = document.getElementById("top-songs");
  document.getElementById("user-data").style.display = "block";
  songs.forEach((song) => {
    const li = document.createElement("li");
    li.textContent = `${song.name} by ${song.artists
      .map((artist) => artist.name)
      .join(", ")}`;
    topSongsElement.appendChild(li);
  });
}

// Step 6: Generate Bar Chart for Track Attributes
function generateTrackAttributesChart(features) {
  const ctx = document.getElementById("chart").getContext("2d");
  const labels = features.map((f) => f.track.name || "Track");
  const energy = features.map((f) => f.energy);
  const danceability = features.map((f) => f.danceability);
  const valence = features.map((f) => f.valence);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        { label: "Energy", data: energy, backgroundColor: "rgba(255, 99, 132, 0.6)" },
        { label: "Danceability", data: danceability, backgroundColor: "rgba(54, 162, 235, 0.6)" },
        { label: "Valence", data: valence, backgroundColor: "rgba(75, 192, 192, 0.6)" },
      ],
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } },
    },
  });
}

// Step 7: Generate Pie Chart for Popularity
function generatePopularityChart(features) {
  const ctx = document.createElement("canvas");
  ctx.id = "popularity-chart";
  document.querySelector(".charts").appendChild(ctx);

  const labels = features.map((f) => f.track.name || "Track");
  const popularity = features.map((f) => f.popularity || Math.random() * 100); // Placeholder popularity

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Popularity",
          data: popularity,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
        },
      ],
    },
  });
}
