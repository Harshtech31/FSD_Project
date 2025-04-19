import React, { useState, useEffect, useRef, useCallback } from "react";

const DestinationSearch = ({ onSelectDestination }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const suggestionsRef = useRef(null);

  // Fetch suggestions from Photon API
  const fetchSuggestions = useCallback(async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching suggestions for:", query);
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received suggestions:", data.features?.length || 0);
      setSuggestions(data.features || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setError("Failed to fetch suggestions");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setQuery(value);

      // Clear any existing timer
      if (window.searchTimer) {
        clearTimeout(window.searchTimer);
      }

      // Set a new timer to delay the API call
      window.searchTimer = setTimeout(() => {
        fetchSuggestions(value);
      }, 300); // 300ms delay
    },
    [fetchSuggestions]
  );

  // Handle suggestion click
  const handleSuggestionClick = (place) => {
    try {
      setQuery(place.properties.name);
      setSuggestions([]);
      onSelectDestination(place); // Call parent callback (addDestinationMarker)
    } catch (error) {
      console.error("Error handling suggestion click:", error);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.searchTimer) {
        clearTimeout(window.searchTimer);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mt-4 relative z-10">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Enter Destination"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>

      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}

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
              <div className="font-medium">{place.properties.name}</div>
              {place.properties.city && (
                <div className="text-sm text-gray-500">
                  {[
                    place.properties.city,
                    place.properties.state,
                    place.properties.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DestinationSearch;
