import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import Search from './pages/Search';
import Navbar from './components/Navbar';
import MealPlanner from './pages/MealPlanner';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/meal-planner" element={<MealPlanner />} />
      </Routes>
    </Router>
  );
}

export default App;