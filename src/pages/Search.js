import React, { useState } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import '../assets/styles/Search.css';
const Search = () => {
 const [ingredient, setIngredient] = useState('');
 const [recipes, setRecipes] = useState([]);
 const [loading, setLoading] = useState(false);

 const handleSearch = async () => {
  if (ingredient) {
   setLoading(true);
   try {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    setRecipes(response.data.meals || []);
   } catch (error) {
    console.error('Error searching recipes', error);
   } finally {
    setLoading(false);
   }
  }
 };

 const addRecipeToMealPlanner = async (recipe) => {
    try {
      const response = await axios.post("https://meal-planner-backend-xtz8.onrender.com/api/meal-plans/add-recipe", {
        recipe,
      });
      if (response.status === 200) {
        alert(`${recipe.strMeal} added to Meal Planner!`);
      }
    } catch (error) {
      console.error("Error adding recipe to Meal Planner:", error);
      alert("Failed to add recipe to Meal Planner.");
    }
 };

 return (
  <div className="search">
   <h1>Search Recipes by Ingredient</h1>
   <input
    type="text"
    value={ingredient}
    onChange={(e) => setIngredient(e.target.value)}
    placeholder="Enter ingredient"
   />
   <button onClick={handleSearch}>Search</button>
   {loading ? (
    <div className="loading">Loading...</div>
   ) : (
    <div className="recipe-list">
     {recipes.map((recipe) => (
      <RecipeCard key={recipe.idMeal} recipe={recipe} onAddToMealPlanner={addRecipeToMealPlanner} />
     ))}
    </div>
   )}
  </div>
 );
};
export default Search;