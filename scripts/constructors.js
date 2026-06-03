(() => {
        const JOLPICA_BASE_URL = "https://api.jolpi.ca/ergast/f1/";
        const API_URL_SEASONS = JOLPICA_BASE_URL + "seasons.json?limit=1000"; 

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

        document.addEventListener('DOMContentLoaded', populateSeasonsDropdown);
})();