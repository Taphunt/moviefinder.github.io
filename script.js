const API_KEY = "5264b796";  // Replace with your OMDb API key
let debounceTimer; 

// Function to get real-time movie suggestions
async function fetchSuggestions() {
    clearTimeout(debounceTimer);
    let movieName = document.getElementById("movieName").value.trim();

    if (movieName.length < 3) {
        document.getElementById("suggestions").style.display = "none";
        return;
    }

    debounceTimer = setTimeout(async () => {
        let response = await fetch(`https://www.omdbapi.com/?s=${movieName}&apikey=${API_KEY}`);
        let data = await response.json();

        if (data.Response === "True") {
            let suggestionsDiv = document.getElementById("suggestions");
            suggestionsDiv.innerHTML = "";
            suggestionsDiv.style.display = "block";

            data.Search.slice(0, 5).forEach(movie => {
                let suggestionItem = document.createElement("div");
                suggestionItem.classList.add("suggestion-item");
                suggestionItem.innerHTML = `${movie.Title} (${movie.Year})`;
                suggestionItem.onclick = function () {
                    document.getElementById("movieName").value = movie.Title;
                    suggestionsDiv.style.display = "none";
                    searchMovie();
                };
                suggestionsDiv.appendChild(suggestionItem);
            });
        }
    }, 500); // Debounce delay for better performance
}

// Function to search movie details
async function searchMovie() {
    let movieName = document.getElementById("movieName").value.trim();
    
    if (!movieName) {
        alert("Please enter a movie name!");
        return;
    }
    
    let response = await fetch(`https://www.omdbapi.com/?t=${movieName}&apikey=${API_KEY}`);
    let data = await response.json();

    if (data.Response === "True") {
        document.getElementById("result").innerHTML = `
            <div class="movie-info">
                <img src="${data.Poster}" alt="${data.Title} Poster">
                <div class="movie-details">
                    <h2>${data.Title} (${data.Year})</h2>
                    <p>⭐ <strong>IMDb Rating:</strong> ${data.imdbRating}</p>
                    <p>🎭 <strong>Genre:</strong> ${data.Genre}</p>
                    <p>🎥 <strong>Director:</strong> ${data.Director}</p>
                    <p>📜 <strong>Plot:</strong> ${data.Plot.substring(0, 100)}...</p>
                    <a href="https://www.imdb.com/title/${data.imdbID}" class="imdb-btn" target="_blank">View on IMDb</a>
                </div>
            </div>
        `;
    } else {
        document.getElementById("result").innerHTML = `<p>Movie not found! Try another title.</p>`;
    }
}

// Enable Telegram Web App Support
window.onload = function () {
    if (window.Telegram?.WebApp) {
        Telegram.WebApp.expand();
    }
};
