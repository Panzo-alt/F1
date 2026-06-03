(() => {
        const JOLPICA_BASE_URL = "https://api.jolpi.ca/ergast/f1/";
        const API_URL_CONSTRUCTORS = JOLPICA_BASE_URL + "constructors.json?limit=174"; 

        // Select elements - These variable names are now safe because they are inside the wrapper
        const constructorSelect = document.getElementById('constructor-select');
        const viewResultsButton = document.getElementById('view-results-button');
        const outputMessage = document.getElementById('output-message');
        const container = document.getElementById('results-container'); 

        // 1. Populate Dropdown
        async function populateConstructorsDropdown() {
            if (!constructorSelect) {
                console.error("Constructors Script: Dropdown element not found!");
                return;
            }

            constructorSelect.innerHTML = '<option value="" disabled selected>Loading constructors...</option>';
            
            try {
                const response = await fetch(API_URL_CONSTRUCTORS);
                if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

                const data = await response.json();
                const constructors = data.MRData.ConstructorTable.Constructors.map(c => c.constructorId);

                constructorSelect.innerHTML = '<option value="" disabled selected>Select a Constructor</option>';
                constructors.sort();

                constructors.forEach(constructor => {
                    const option = document.createElement('option');
                    option.value = constructor; 
                    option.textContent = constructor; 
                    constructorSelect.appendChild(option);
                });

                if (viewResultsButton) viewResultsButton.disabled = false;
                
            } catch (error) {
                console.error('Error fetching constructors:', error);
                constructorSelect.innerHTML = '<option disabled selected>Error loading constructors</option>';
            }
        }

        document.addEventListener('DOMContentLoaded', populateConstructorsDropdown);
})();