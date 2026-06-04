(() => {
  const JOLPICA_BASE_URL = "https://api.jolpi.ca/ergast/f1/";
  const API_URL_SEASONS = JOLPICA_BASE_URL + "seasons.json?limit=100";

  // Select elements
  const seasonSelect = document.getElementById("season-select");
  const viewResultsButton = document.getElementById("view-results-button");
  const outputMessage = document.getElementById("output-message");
  const container = document.getElementById("results-container");

  // 1. Populate Dropdown
  async function populateSeasonsDropdown() {
    if (!seasonSelect) {
      console.error("Seasons Script: Dropdown element not found!");
      return;
    }

    seasonSelect.innerHTML =
      '<option value="" disabled selected>Loading seasons...</option>';

    try {
      const response = await fetch(API_URL_SEASONS);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const data = await response.json();
      const seasons = data.MRData.SeasonTable.Seasons.map((s) => s.season);

      seasonSelect.innerHTML =
        '<option value="" disabled selected>Select a Season</option>';
      seasons.sort();

      seasons.forEach((season) => {
        const option = document.createElement("option");
        option.value = season;
        option.textContent = season;
        seasonSelect.appendChild(option);
      });

      if (viewResultsButton) viewResultsButton.disabled = false;
    } catch (error) {
      console.error("Error fetching seasons:", error);
      seasonSelect.innerHTML =
        "<option disabled selected>Error loading seasons</option>";
    }
  }

  // 2. Handle the Button Click and Fetch Results
  async function processSelection() {
    const selectedSeason = seasonSelect.value;
    if (!selectedSeason) return;

    let seasonDiv = document.getElementById("season-results-area");
    if (!seasonDiv) {
      seasonDiv = document.createElement("div");
      seasonDiv.id = "season-results-area";
      container.appendChild(seasonDiv);
    }

    seasonDiv.innerHTML = `<p class="loading">Fetching results for ${selectedSeason}...</p>`;
    const API_URL_SEASON_RESULTS = `${JOLPICA_BASE_URL}${selectedSeason}/driverstandings.json?limit=1000`;

    try {
      const response = await fetch(API_URL_SEASON_RESULTS);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const data = await response.json();
      const standings =
        data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];

      // Handle the case where a season (like a future year) has no data yet
      if (standings.length === 0) {
        seasonDiv.innerHTML = `<p>No driver standings found for ${selectedSeason}.</p>`;
        return;
      }

      // Build the table header
      let tableHTML = `
        <h2>${selectedSeason} Driver Standings</h2>
        <table class="standings-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Driver</th>
              <th>Points</th>
              <th>Wins</th>
              <th>Nationality</th>
            </tr>
          </thead>
          <tbody>
      `;

      // Loop through the standings array and create a row for each driver
      // Loop through the standings array and create a row for each driver
      standings.forEach(standing => {
        tableHTML += `
            <tr>
              <td>${standing.position}</td>
              <td>
                <a href="${standing.Driver.url}" target="_blank" rel="noopener noreferrer">
                  <strong>${standing.Driver.givenName} ${standing.Driver.familyName}</strong>
                </a>
              </td>
              <td>${standing.points}</td>
              <td>${standing.wins}</td>
              <td>${standing.Driver.nationality}</td>
            </tr>
        `;
      });

      // Close the table tags
      tableHTML += `
          </tbody>
        </table>
      `;

      // Inject the completed HTML into the DOM
      seasonDiv.innerHTML = tableHTML;
    } catch (error) {
      console.error("Error fetching season results:", error);
      seasonDiv.innerHTML = `<p class="error">Error fetching results for ${selectedSeason}.</p>`;
    }
  }
  // 3. Initialize everything once the DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    populateSeasonsDropdown();

    if (viewResultsButton) {
      viewResultsButton.addEventListener("click", processSelection);
    }
  });
})();
