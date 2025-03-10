import React, { useEffect, useRef } from 'react';

const AddressAutocomplete = ({ onPlaceSelected }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    // Ensure that the Google API is loaded
    if (!window.google) {
      console.error('Google Maps JavaScript API library is not loaded!');
      return;
    }

    // Initialize the Autocomplete object
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'], // Restrict the suggestions to addresses
      // Optionally, you can add componentRestrictions, e.g.,
      // componentRestrictions: { country: "us" },
    });

    // Listen for when the user selects an address
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (onPlaceSelected) {
        onPlaceSelected(place);
      }
    });
  }, [onPlaceSelected]);

  return (
    <input 
      type="text" 
      ref={inputRef} 
      placeholder="Enter your address" 
    />
  );
};

export default AddressAutocomplete;