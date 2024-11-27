const clientId = "a7269af82d7b490da8f1d5bf9eb152fa";
const redirectUri = "https://rsm-aburda.github.io/MGTA-452-Final-Project/"; // Change to your hosted URL
const authEndpoint = "https://accounts.spotify.com/authorize";
const scopes = ["user-top-read"];
let accessToken = "";

// Authenticate and Fetch Data
document.getElementById("auth-button").addEventListener("click", () => {
    const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scopes.join(
      "%20"
    )}`;
    window.location.href = authUrl;
  });
  
  // Extract Access Token and Fetch Songs
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
  
  // Fetch Top 10 Songs
  async function fetchTopSongs() {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=5", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      displayTopSongs(data.items);
    } catch (error) {
      console.error("Error fetching top songs:", error);
    }
  }
  
  // Display Top Songs as Cards
  function displayTopSongs(songs) {
    const topSongsElement = document.getElementById("top-songs");
    document.getElementById("user-data").style.display = "block";
  
    songs.forEach((song) => {
      // Create card container
      const card = document.createElement("div");
      card.classList.add("song-card");
  
      // Album art
      const img = document.createElement("img");
      img.src = song.album.images[0]?.url || ""; // Handle missing album art
      img.alt = `${song.name} Album Art`;
      card.appendChild(img);
  
      // Song title
      const title = document.createElement("h4");
      title.textContent = song.name;
      card.appendChild(title);
  
      // Artists
      const artist = document.createElement("p");
      artist.textContent = song.artists.map((artist) => artist.name).join(", ");
      card.appendChild(artist);
  
      // Append card to container
      topSongsElement.appendChild(card);
    });
  }
  

