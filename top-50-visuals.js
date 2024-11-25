Papa.parse("Top 50_2023.csv", {
    download: true,
    header: true,
    complete: function(results) {
        const data = results.data;
        const genreCounts = {};

        // Parse and clean the genres
        data.forEach(song => {
            let genreString = song.genres;
            if (genreString) {
                const genres = JSON.parse(genreString.replace(/'/g, '"')); // Convert string to array
                const primaryGenre = genres[0]?.trim(); // Take the first genre
                if (primaryGenre) {
                    genreCounts[primaryGenre] = (genreCounts[primaryGenre] || 0) + 1;
                }
            }
        });

        console.log("Genre Counts:", genreCounts); // Debugging log

        // Prepare data for Chart.js
        const genres = Object.keys(genreCounts);
        const counts = Object.values(genreCounts);

        if (genres.length === 0 || counts.length === 0) {
            console.error("No genres found in the dataset.");
            return;
        }

        // Create Pie Chart
        createGenreChart(genres, counts);
    }
});
