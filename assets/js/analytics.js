const clientId = "YOUR_SPOTIFY_CLIENT_ID";
const redirectUri = "http://localhost:5500/analytics.html"; // Change to your hosted URL
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
  const response = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=10", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await response.json();
  displayTopSongs(data.items);
  generateChart(data.items);
}

// Step 4: Display Top Songs
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

// Step 5: Generate Visualization
function generateChart(songs) {
  const ctx = document.getElementById("chart").getContext("2d");
  const labels = songs.map((song) => song.name);
  const playCounts = songs.map(() => Math.floor(Math.random() * 100)); // Replace with actual data if available
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Top Songs",
          data: playCounts,
          backgroundColor: "rgba(29, 185, 84, 0.6)",
          borderColor: "rgba(29, 185, 84, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}
