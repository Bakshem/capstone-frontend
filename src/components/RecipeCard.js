import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/RecipeCard.css';

const RecipeCard = ({ recipe }) => {
  const handleAddToMealPlanner = async () => {
    try {
      const response = await fetch('https://meal-planner-backend-xtz8.onrender.com/api/meal-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          week: 'Week 1', // Replace this with dynamic week selection if needed
          meals: [{ name: recipe.strMeal, shoppingList: recipe.shoppingList || [] }],
        }),
      });

      if (response.ok) {
        alert('Recipe added successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding recipe to Meal Planner:', error);
      alert('Error adding recipe to Meal Planner');
    }
  };

  return (
    <div className="recipe-card">
      <img src={recipe.strMealThumb} alt={recipe.strMeal} />
      <h3>{recipe.strMeal}</h3>
      <Link to={`/recipe/${recipe.idMeal}`}>View Recipe</Link>
      <button className="add-meal-planner-btn" onClick={handleAddToMealPlanner}>
        Add to Meal Planner
      </button>
    </div>
  );
};

export default RecipeCard;