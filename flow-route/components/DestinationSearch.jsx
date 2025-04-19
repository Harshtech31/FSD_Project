import React, { useState, useEffect, useRef } from 'react';

const DestinationSearch = ({ onSelectDestination }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const suggestionsRef = useRef(null);

  // Fetch suggestions from Photon API
  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`https://photon.komoot.io/api/?q=${query}`);
      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  // Handle suggestion click
  const handleSuggestionClick = (place) => {
    setQuery(place.properties.name);
    setSuggestions([]);
    onSelectDestination(place); // Call parent callback (addDestinationMarker)
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mt-4 relative z-10">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter Destination"
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg"
        >
          {suggestions.map((place, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(place)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {place.properties.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DestinationSearch;
