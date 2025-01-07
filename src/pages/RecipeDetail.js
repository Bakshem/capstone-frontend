import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/RecipeDetail.css';

const RecipeDetail = () => {
 const { id } = useParams();
 const [recipe, setRecipe] = useState(null);
 const [loading, setLoading] = useState(true);
 const [shoppingList, setShoppingList] = useState([]);

 useEffect(() => {
  const fetchRecipeDetail = async () => {
   try {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    setRecipe(response.data.meals[0]);
   } catch (error) {
    console.error('Error fetching recipe detail', error);
   } finally {
    setLoading(false);
   }
  };
  fetchRecipeDetail();
 }, [id]);

 const addToShoppingList = (ingredient) => {
  if (!shoppingList.includes(ingredient)) {
   setShoppingList((prevList) => [...prevList, ingredient]);
  } else {
   alert(`${ingredient} is already in your shopping list!`);
  }
 };
 const saveShoppingList = async () => {
    const shoppingData = {
      recipeId: id,
      recipeName: recipe.strMeal,
      shoppingList,
    };

    try {
      const response = await fetch('https://meal-planner-backend-xtz8.onrender.com/api/shopping-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shoppingData),
      });

      if (response.ok) {
        alert('Shopping list saved successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error saving shopping list:', error);
    }
  };

 if (loading) return <div className="loading">Loading...</div>;

 return (
  <div className="recipe-detail">
   <h1>{recipe.strMeal}</h1>
   <img src={recipe.strMealThumb} alt={recipe.strMeal} />
   <div className="instructions">
    <h2>Cooking Instructions</h2>
    <p>{recipe.strInstructions}</p>
   </div>
   <div className="ingredients">
    <h2>Ingredients</h2>
    <ul>
     {Object.keys(recipe).map((key) =>
      key.startsWith('strIngredient') && recipe[key] ? (
       <li key={key}>
        {recipe[key]}{' '}
        <button
         className="add-to-list-btn"
         onClick={() => addToShoppingList(recipe[key])}
        >
         Add to Shopping List
        </button>
       </li>
      ) : null
     )}
    </ul>
    <button className='save-shopping-list' onClick={saveShoppingList}>Save Shopping List</button>
   </div>
   <div className="shopping-list">
    <h2>Shopping List</h2>
    <ul>
     {shoppingList.map((item, index) => (
      <li key={index}>{item}</li>
     ))}
    </ul>
   </div>
  </div>
 );
};

export default RecipeDetail;