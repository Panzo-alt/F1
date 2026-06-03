// We use the Jolpica "drop-in" replacement for Ergast since Ergast is deprecated.
// notice the '/ergast/f1' path which mimics the original API structure.
const API_URL = "https://api.jolpi.ca/ergast/f1/current/last/results.json";

document.addEventListener('DOMContentLoaded', fetchLastRaceResults);

async function fetchLastRaceResults() {
    const container = document.getElementById('results-container');

    try {
        // 1. Fetch the data
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        // 2. Parse the specific Ergast JSON structure
        // Structure: MRData -> RaceTable -> Races[0] -> Results
        const raceData = data.MRData.RaceTable.Races[0];
        const raceName = raceData.raceName;
        const results = raceData.Results;

        // 3. Generate HTML
        // First, update the header to show which race this was
        let htmlContent = `<h2>${raceName} (${raceData.season})</h2>`;
        
        // Build the table
        htmlContent += `
            <table>
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Driver</th>
                        <th>Constructor</th>
                        <th>Laps</th>
                        <th>Time/Status</th>
                    </tr>
                </thead>
                <tbody>
        `;

        results.forEach(result => {
            const pos = result.position;
            const driver = `${result.Driver.givenName} ${result.Driver.familyName}`;
            const team = result.Constructor.name;
            const laps = result.laps;
            // If they finished, show time; otherwise show status (e.g., "Collision")
            const timeOrStatus = result.Time ? result.Time.time : result.status;

            htmlContent += `
                <tr>
                    <td>${pos}</td>
                    <td>${driver}</td>
                    <td>${team}</td>
                    <td>${laps}</td>
                    <td>${timeOrStatus}</td>
                </tr>
            `;
        });

        htmlContent += `</tbody></table>`;

        // 4. Inject into DOM
        container.innerHTML = htmlContent;

    } catch (error) {
        console.error('Fetch error:', error);
        container.innerHTML = `<p class="error">Failed to load results: ${error.message}</p>`;
    }
}