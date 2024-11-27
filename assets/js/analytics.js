const clientId = "a7269af82d7b490da8f1d5bf9eb152fa";
const redirectUri = "https://rsm-aburda.github.io/MGTA-452-Final-Project/"; // Change to your hosted URL
const authEndpoint = "https://accounts.spotify.com/authorize";
const scopes = ["user-top-read"];
let accessToken = "";

// Step 1: Authenticate and Fetch Data
document.getElementById("auth-button").addEventListener("click", () => {
  const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scopes.join(
    "%20"
  )}`;
  window.location.href = authUrl;
});

// Step 2: Extract Access Token and Fetch Songs
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
    displayTopSongs(data.items);
    generateGenreChart(data.items);
  } catch (error) {
    console.error("Error fetching top songs:", error);
  }
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

// Step 5: Generate Genre Breakdown Chart
function generateGenreChart(songs) {
  const genres = {};

  // Collect genres from the song's album or artist
  songs.forEach((song) => {
    song.album.artists.forEach((artist) => {
      const genre = artist.name; // Placeholder for actual genre
      genres[genre] = (genres[genre] || 0) + 1;
    });
  });

  const ctx = document.getElementById("genre-chart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(genres),
      datasets: [
        {
          label: "Genres",
          data: Object.values(genres),
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
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });
}
