document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('searchBtn').addEventListener('click', () => {
    const ingredients = document.getElementById('ingredients').value;
    if (ingredients) {
        fetchRecipes(ingredients);
    } else {
        alert('Please enter some ingredients.');
    }
});

function fetchRecipes(ingredients) {
    const apiKey = '471b2174bc204973b435ec7a551a7d75'; // Replace with your Spoonacular API key
    const numberOfResults = 5; // Limit the number of recipes

    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=${numberOfResults}&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const recipePromises = data.map(recipe => fetchRecipeDetails(recipe.id, apiKey));
            return Promise.all(recipePromises);
        })
        .then(recipesDetails => displayRecipes(recipesDetails))
        .catch(error => console.error('Error fetching recipes:', error));
}

function fetchRecipeDetails(id, apiKey) {
    return fetch(`https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(recipe => {
            return {
                title: recipe.title,
                image: recipe.image,
                ingredients: recipe.extendedIngredients.map(ing => ing.original).join(', '),
                instructions: recipe.instructions ? recipe.instructions.replace(/<\/?[^>]+(>|$)/g, "") : 'No instructions available.',
            };
        });
}

function displayRecipes(recipes) {
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = ''; // Clear previous results

    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe';
        recipeDiv.innerHTML = `
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}" alt="${recipe.title}">
            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions}</p>
        `;
        recipesDiv.appendChild(recipeDiv);
    });
}

const modal = document.getElementById('privacy-policy');
const modalLink = document.querySelector('a[href="#privacy-policy"]');
const closeBtn = document.querySelector('.close-btn');

modalLink.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
});
