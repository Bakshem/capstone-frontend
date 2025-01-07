import React, { useState, useEffect } from 'react';
import '../assets/styles/MealPlanner.css';

const MealPlanner = () => {
  const [week, setWeek] = useState('');
  const [meals, setMeals] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const response = await fetch('https://meal-planner-backend-xtz8.onrender.com/api/meal-plans');
        const data = await response.json();
        setMealPlans(data);
      } catch (error) {
        console.error('Error fetching meal plans:', error);
      }
    };

    fetchMealPlans();
  }, []);

  const handleSubmit = async () => {
    const mealPlan = {
      week,
      meals: meals.map((meal) => ({
        name: meal.name,
        shoppingList: meal.shoppingList,
      })),
    };

    try {
      const response = await fetch('https://meal-planner-backend-xtz8.onrender.com/api/meal-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mealPlan),
      });

      if (response.ok) {
        alert('Meal plan saved successfully!');
        const newMealPlan = await response.json();
        setMealPlans([...mealPlans, newMealPlan]);
        setWeek('');
        setMeals([]);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClearMealPlans = async () => {
    try {
      const response = await fetch('https://meal-planner-backend-xtz8.onrender.com/api/meal-plans', {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('All meal plans have been cleared!');
        setMealPlans([]);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error clearing meal plans:', error);
      alert('An error occurred while trying to clear meal plans.');
    }
  };

  const addMeal = () =>
    setMeals([...meals, { name: '', shoppingList: [] }]);

  const updateMealName = (index, value) => {
    const updatedMeals = [...meals];
    updatedMeals[index].name = value;
    setMeals(updatedMeals);
  };

  const addShoppingItemToMeal = (mealIndex, item) => {
    const updatedMeals = [...meals];
    updatedMeals[mealIndex].shoppingList.push(item);
    setMeals(updatedMeals);
  };

  return (
    <div className="meal-planner">
      <h1>Meal Planner</h1>
      <input
        type="text"
        placeholder="Week (e.g., Week 1)"
        value={week}
        onChange={(e) => setWeek(e.target.value)}
      />
      <h3>Meals</h3>
      {meals.map((meal, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder={`Meal for Day ${index + 1}`}
            value={meal.name}
            onChange={(e) => updateMealName(index, e.target.value)}
          />
          <div>
            <h4>Shopping List</h4>
            <input
              type="text"
              placeholder="Add shopping item"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  addShoppingItemToMeal(index, e.target.value.trim());
                  e.target.value = ''; // Clear input field
                }
              }}
            />
            <ul>
              {meal.shoppingList.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
      <button onClick={addMeal}>Add Meal</button>
      <button onClick={handleSubmit}>Save Meal Plan</button>

      <h2>Saved Meal Plans</h2>
      {mealPlans.length > 0 ? (
        <>
          {mealPlans.map((plan, index) => (
            <div key={index}>
              <h3>{plan.week}</h3>
              <ul>
                {plan.meals.map((meal, idx) => (
                  <li key={idx}>
                    <strong>{meal.name}</strong>
                    <ul>
                      {meal.shoppingList.map((item, id) => (
                        <li key={id}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button onClick={handleClearMealPlans}>Clear All Meal Plans</button>
        </>
      ) : (
        <p>No meal plans saved yet.</p>
      )}
    </div>
  );
};

export default MealPlanner;