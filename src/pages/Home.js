import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import '../assets/styles/Home.css';

const Home = () => {
    const [recipes, setRecipes] = useState([null]);
    const [loading, setLoading] = useState(true);
   
    const addRecipeToMealPlanner = async (recipe) => {
       try {
            const response = await axios.post('http://localhost:5000/api/meal-plans/add-recipe', {
            recipe,
            });
            if (response.status === 200) {
            alert(`${recipe.strMeal} added to Meal Planner!`);
            }
       } catch (error) {
         console.error('Error adding recipe to meal planner', error);
         alert('Error adding recipe to Meal Planner');}
         };
   
    useEffect(() => {
     const fetchRandomRecipes = async () => {
      try {
       const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
       setRecipes(response.data.meals);
      } catch (error) {
       console.error('Error fetching recipes', error);
      } finally {
       setLoading(false);
      }
     };
     fetchRandomRecipes();
    }, []);
    if (loading) return <div className="loading">Loading...</div>;
    return (
     <div className="home">
        <Link to="/meal-planner" className="meal-planner-link">
           Go to Meal Planner
         </Link>
      <h1>Today's Recipe For You</h1>
      <div className="recipe-list">
       {recipes.map((recipe) => (
        <RecipeCard key={recipe.idMeal} recipe={recipe} onAddToMealPlanner={addRecipeToMealPlanner} />
       ))}
      </div>
     </div>
    );
   };

export default Home;