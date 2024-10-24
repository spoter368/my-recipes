// Global variable to store recipes
let allRecipes = [];

// Fetch the recipes from the JSON file
fetch('recipes.json')
    .then(response => response.json())
    .then(data => {
        allRecipes = data.recipes;
        displayRecipes(allRecipes);
    })
    .catch(error => console.error('Error fetching recipes:', error));

// Function to display recipes on the page
function displayRecipes(recipes) {
    const container = document.getElementById('recipes-container');
    container.innerHTML = ''; // Clear previous content

    if (recipes.length === 0) {
        container.innerHTML = '<p>No recipes found.</p>';
        return;
    }

    recipes.forEach(recipe => {
        // Create the recipe card element
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe');

        // Generate HTML content for the recipe
        let recipeHTML = `
            <div class="recipe-content">
                <h2>${recipe.name}</h2>
        `;

        // Optional fields
        if (recipe.source) {
            recipeHTML += `<p><strong>Source:</strong> ${recipe.source}</p>`;
        }
        if (recipe.servings) {
            recipeHTML += `<p><strong>Servings:</strong> ${recipe.servings}</p>`;
        }
        if (recipe.cooking_time) {
            recipeHTML += `<p><strong>Cooking Time:</strong> ${recipe.cooking_time}</p>`;
        }
        if (recipe.preheat) {
            recipeHTML += `<p><strong>Preheat Oven To:</strong> ${recipe.preheat}</p>`;
        }

        // Ingredients
        recipeHTML += `<h3>Ingredients:</h3>`;
        if (Array.isArray(recipe.ingredients)) {
            // Ingredients is an array
            recipeHTML += `
                <ul>
                    ${recipe.ingredients.map(ingredient => `<li>${ingredient.quantity} ${ingredient.item}</li>`).join('')}
                </ul>
            `;
        } else if (typeof recipe.ingredients === 'object') {
            // Ingredients is an object with subheadings
            for (let section in recipe.ingredients) {
                recipeHTML += `<h4>${capitalizeFirstLetter(section)}:</h4>`;
                recipeHTML += `
                    <ul>
                        ${recipe.ingredients[section].map(ingredient => `<li>${ingredient.quantity} ${ingredient.item}</li>`).join('')}
                    </ul>
                `;
            }
        }

        // Instructions
        recipeHTML += `
            <h3>Instructions:</h3>
            <ol>
                ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
            </ol>
        `;

        // Notes (optional)
        if (recipe.notes) {
            recipeHTML += `<h3>Notes:</h3><p>${recipe.notes}</p>`;
        }

        recipeHTML += `</div>`; // Close recipe-content div

        // Set the inner HTML of the recipe card
        recipeCard.innerHTML = recipeHTML;

        // Append the recipe card to the container
        container.appendChild(recipeCard);
    });
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Search functionality
const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const filteredRecipes = allRecipes.filter(recipe => {
        // Search in name, ingredients items, and notes
        let nameMatch = recipe.name.toLowerCase().includes(query);

        // Ingredients match
        let ingredientsMatch = false;
        if (Array.isArray(recipe.ingredients)) {
            ingredientsMatch = recipe.ingredients.some(ingredient =>
                ingredient.item.toLowerCase().includes(query)
            );
        } else if (typeof recipe.ingredients === 'object') {
            for (let section in recipe.ingredients) {
                if (recipe.ingredients[section].some(ingredient =>
                    ingredient.item.toLowerCase().includes(query)
                )) {
                    ingredientsMatch = true;
                    break;
                }
            }
        }

        // Notes match
        let notesMatch = recipe.notes ? recipe.notes.toLowerCase().includes(query) : false;

        return nameMatch || ingredientsMatch || notesMatch;
    });
    displayRecipes(filteredRecipes);
});
