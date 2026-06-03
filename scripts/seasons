// WRAPPER START: Keeps these variables private
(() => {

    const JOLPICA_BASE_URL = "https://api.jolpi.ca/ergast/f1/";
    const API_URL_SEASONS = JOLPICA_BASE_URL + "seasons.json?limit=100"; 

    // Select elements - These variable names are now safe because they are inside the wrapper
    const seasonSelect = document.getElementById('season-select');
    const viewResultsButton = document.getElementById('view-results-button');
    const outputMessage = document.getElementById('output-message');
    const container = document.getElementById('results-container'); 

    // 1. Populate Dropdown
    async function populateSeasonsDropdown() {
        if (!seasonSelect) {
            console.error("Seasons Script: Dropdown element not found!");
            return;
        }

        seasonSelect.innerHTML = '<option value="" disabled selected>Loading seasons...</option>';
        
        try {
            const response = await fetch(API_URL_SEASONS);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

            const data = await response.json();
            const seasons = data.MRData.SeasonTable.Seasons.map(s => s.season);

            seasonSelect.innerHTML = '<option value="" disabled selected>Select a Season</option>';
            seasons.sort((a, b) => b - a);

            seasons.forEach(season => {
                const option = document.createElement('option');
                option.value = season; 
                option.textContent = season; 
                seasonSelect.appendChild(option);
            });

            if (viewResultsButton) viewResultsButton.disabled = false;
            
        } catch (error) {
            console.error('Error fetching seasons:', error);
            seasonSelect.innerHTML = '<option disabled selected>Error loading seasons</option>';
        }
    }

    // 2. Fetch & Display Season Results
    async function processSelection() {
        const selectedSeason = seasonSelect.value; 
        if (!selectedSeason) return;

        // Create or clear a specific div for season results so we don't delete the "Latest Race" card
        // Check if we already made a season div
        let seasonDiv = document.getElementById('season-results-area');
        if (!seasonDiv) {
            seasonDiv = document.createElement('div');
            seasonDiv.id = 'season-results-area';
            container.appendChild(seasonDiv);
        }

        seasonDiv.innerHTML = `<p class="loading">Fetching results for ${selectedSeason}...</p>`;
        const API_URL_SEASON_RESULTS = `${JOLPICA_BASE_URL}${selectedSeason}/results/1.json?limit=1000`; 

        try {
            const response = await fetch(API_URL_SEASON_RESULTS);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

            const data = await response.json();
            const races = data.MRData.RaceTable.Races;

            if (!races || races.length === 0) {
                seasonDiv.innerHTML = `<p>No data found for ${selectedSeason}.</p>`;
                return;
            }

            let htmlContent = `<h2>Season ${selectedSeason} Results</h2><ul>`;
            races.forEach(race => {
                const winner = race.Results && race.Results.length > 0 
                               ? race.Results[0].Driver.familyName 
                               : 'N/A';
                htmlContent += `<li><strong>${race.raceName}</strong>: ${winner}</li>`;
            });
            htmlContent += '</ul>';
            
            seasonDiv.innerHTML = htmlContent;

        } catch (error) {
            console.error('Season fetch error:', error);
            seasonDiv.innerHTML = `<p class="error">Failed to load season data.</p>`;
        }
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', populateSeasonsDropdown);
    
    if (viewResultsButton) {
        viewResultsButton.addEventListener('click', processSelection);
    }

})(); // WRAPPER END