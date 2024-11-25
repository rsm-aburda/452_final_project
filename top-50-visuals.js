// Parse CSV and Generate Genre Distribution
Papa.parse("Top 50_2023.csv", {
    download: true,
    header: true,
    complete: function(results) {
        const data = results.data;
        const genreCounts = {};

        // Count songs per genre
        data.forEach(song => {
            const genre = song.Genre;
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });

        // Prepare data for Chart.js
        const genres = Object.keys(genreCounts);
        const counts = Object.values(genreCounts);

        // Create Pie Chart
        createGenreChart(genres, counts);
    }
});

// Function to Create Genre Pie Chart
function createGenreChart(genres, counts) {
    const ctx = document.getElementById("genreChart").getContext("2d");
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: genres,
            datasets: [
                {
                    data: counts,
                    backgroundColor: generateColors(genres.length),
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const label = tooltipItem.label || '';
                            const value = tooltipItem.raw || 0;
                            return `${label}: ${value} songs`;
                        }
                    }
                }
            }
        }
    });
}

// Function to Generate Colors for Pie Chart
function generateColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(`hsl(${(360 / count) * i}, 70%, 50%)`);
    }
    return colors;
}
