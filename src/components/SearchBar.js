import React from 'react';
const SearchBar = ({ ingredient, setIngredient, onSearch }) => {
 return (
  <div className="search-bar">
   <input
    type="text"
    value={ingredient}
    onChange={(e) => setIngredient(e.target.value)}
    placeholder="Enter ingredient"
   />
   <button onClick={onSearch}>Search</button>
  </div>
 );
};
export default SearchBar;