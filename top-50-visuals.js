// Parse CSV and Initialize Visualization
Papa.parse("Top 50_2023.csv", {
    download: true,
    header: true,
    complete: function(results) {
        const data = results.data;
        const genres = new Set();
        const labels = [];
        const popularity = [];
        const energy = [];
        const genreMap = {};

        // Process data
        data.forEach(song => {
            const genre = song.Genre;
            genres.add(genre);
            labels.push(song.Song);
            popularity.push(parseFloat(song.Popularity));
            energy.push(parseFloat(song.Energy));
            genreMap[song.Song] = genre; // Map songs to genres
        });

        // Populate genre filter
        const genreFilter = document.getElementById("genre-filter");
        genres.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });

        // Create initial chart
        const chartData = { labels, datasets: createDatasets(labels, popularity, energy, genreMap, "All") };
        const chart = createChart(chartData);

        // Add event listener for filtering
        genreFilter.addEventListener("change", function() {
            const selectedGenre = genreFilter.value;
            const filteredData = createDatasets(labels, popularity, energy, genreMap, selectedGenre);
            chart.data.datasets = filteredData;
            chart.update();
        });
    }
});

// Create datasets based on genre filtering
function createDatasets(labels, popularity, energy, genreMap, selectedGenre) {
    const filteredPopularity = [];
    const filteredEnergy = [];
    const filteredLabels = labels.filter((label, index) => {
        if (selectedGenre === "All" || genreMap[label] === selectedGenre) {
            filteredPopularity.push(popularity[index]);
            filteredEnergy.push(energy[index]);
            return true;
        }
        return false;
    });

    return [
        {
            label: "Popularity",
            data: filteredPopularity,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
        {
            label: "Energy",
            data: filteredEnergy,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
        }
    ];
}

// Create the chart
function createChart(chartData) {
    const ctx = document.getElementById("songsChart").getContext("2d");
    return new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: { position: "top" },
            },
        }
    });
}
