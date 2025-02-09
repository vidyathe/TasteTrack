const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('search');
const recipeContainer = document.getElementById('recipeContainer');

searchBtn.addEventListener('click', fetchRecipes);

// Allow Enter key to trigger the search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchRecipes();
    }
});

async function fetchRecipes() {
    try {
        const query = searchInput.value.trim();

        if (!query) {
            recipeContainer.innerHTML = '<p>Please enter a search term.</p>';
            return;
        }

        recipeContainer.innerHTML = '<p>Loading recipes...</p>';

        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displayRecipes(data.meals);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        recipeContainer.innerHTML = '<p>Error loading recipes. Please try again later.</p>';
    }
}

function displayRecipes(recipes) {
    recipeContainer.innerHTML = ''; // Clear previous results
    
    if (!recipes) {
        recipeContainer.innerHTML = '<p>No recipes found. Try a different search term.</p>';
        return;
    }

    const recipeElements = recipes.map(recipe => {
        const sourceUrl = recipe.strSource || '#';
        const placeholderImage = 'https://via.placeholder.com/250x200?text=No+Image';

        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');

        const instructions = recipe.strInstructions
            ? `${recipe.strInstructions.substring(0, 100)}...`
            : 'Instructions not available';

        recipeDiv.innerHTML = `
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" onerror="this.src='${placeholderImage}'">
            <div class="recipe-details">
                <h2 class="recipe-title">${recipe.strMeal}</h2>
                <p class="recipe-instructions">${instructions}</p>
                ${sourceUrl !== '#' 
                    ? `<a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">View Recipe</a>` 
                    : '<p>Source not available</p>'
                }
            </div>
        `;

        return recipeDiv;
    });

    recipeContainer.append(...recipeElements);
}
