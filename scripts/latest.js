(() => {
  const JOLPICA_BASE_URL = "https://api.jolpi.ca/ergast/f1/";
  // This endpoint always grabs the most recent completed race
  const LATEST_RESULTS_URL = JOLPICA_BASE_URL + "current/last/results.json";
  
  const container = document.getElementById("results-container");

  async function fetchLatestResults() {
    if (!container) return;

    container.innerHTML = `<div id="season-results-area"><p class="loading">Fetching latest race results...</p></div>`;

    try {
      const response = await fetch(LATEST_RESULTS_URL);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const data = await response.json();
      
      // Navigate to the specific race data
      const race = data.MRData.RaceTable.Races[0];

      if (!race) {
        container.innerHTML = `<div id="season-results-area"><p>No latest race data found.</p></div>`;
        return;
      }

      const results = race.Results;
      
      // Build the table header including the Race Name and Season
      let tableHTML = `
        <div id="season-results-area">
          <h2>${race.season} ${race.raceName} (Round ${race.round})</h2>
          <table class="standings-table">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Driver</th>
                <th>Constructor</th>
                <th>Laps</th>
                <th>Time/Status</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
      `;

      // Loop through the race results
      results.forEach(result => {
        // If they finished, show their time. If they DNF or got lapped, show their status.
        const timeOrStatus = result.Time ? result.Time.time : result.status;

        tableHTML += `
            <tr>
              <td>${result.position}</td>
              <td>
                <a href="${result.Driver.url}" target="_blank" rel="noopener noreferrer">
                  <strong>${result.Driver.givenName} ${result.Driver.familyName}</strong>
                </a>
              </td>
              <td>
                <a href="${result.Constructor.url}" target="_blank" rel="noopener noreferrer">
                  ${result.Constructor.name}
                </a>
              </td>
              <td>${result.laps}</td>
              <td>${timeOrStatus}</td>
              <td>${result.points}</td>
            </tr>
        `;
      });

      // Close the table tags
      tableHTML += `
            </tbody>
          </table>
        </div>
      `;

      // Inject the completed HTML into the DOM
      container.innerHTML = tableHTML;

    } catch (error) {
      console.error("Error fetching latest results:", error);
      container.innerHTML = `<div id="season-results-area"><p class="error">Error fetching latest race results.</p></div>`;
    }
  }

  // Run the fetch function as soon as the DOM is loaded
  document.addEventListener("DOMContentLoaded", fetchLatestResults);
})();