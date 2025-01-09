import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shoppingList, setShoppingList] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

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

  const handleIngredientChange = (ingredient) => {
    setSelectedIngredients((prevSelected) => {
      if (prevSelected.includes(ingredient)) {
        return prevSelected.filter((item) => item !== ingredient);
      } else {
        return [...prevSelected, ingredient];
      }
    });
  };

  const addSelectedToShoppingList = () => {
    const newShoppingList = [...shoppingList, ...selectedIngredients.filter(item => !shoppingList.includes(item))];
    setShoppingList(newShoppingList);
    setSelectedIngredients([]); // Reset selected ingredients
  };

  const saveShoppingList = async () => {
    if (shoppingList.length === 0) {
      alert('Please add some ingredients to the shopping list first!');
      return;
    }
    const shoppingData = {
      recipeId: id,
      recipeName: recipe.strMeal,
      shoppingList: shoppingList.map(ingredient => ({ name: ingredient.name, quantity: ingredient.quantity || "1" })), 
    };

    console.log('Data being sent to backend:', shoppingData);

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
      <div className="back-btn" onClick={() => navigate(-1)}>
        &lt; Back
      </div>
      <img src={recipe.strMealThumb} alt={recipe.strMeal} />
      <div className="instructions">
        <h2>Cooking Instructions</h2>
        <div className="instruction-steps">
          {recipe.strInstructions.split('\n').map((step, index) => (
            <div key={index} className="instruction-step">
              <p>{step}</p>
      </div>
    ))}
  </div>
</div>
      <div className="ingredients">
        <h2>Ingredients</h2>
        <ul>
          {Object.keys(recipe).map((key) =>
            key.startsWith('strIngredient') && recipe[key] ? (
              <li key={key}>
                <input
                  type="checkbox"
                  id={key}
                  value={recipe[key]}
                  onChange={() => handleIngredientChange(recipe[key])}
                />
                <label htmlFor={key}>{recipe[key]}</label>
              </li>
            ) : null
          )}
        </ul>
        <button className="add-to-list-btn" onClick={addSelectedToShoppingList}>
          Add Selected to Shopping List
        </button>
        <button className="save-shopping-list" onClick={saveShoppingList}>
          Save Shopping List
        </button>
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