import React, { useEffect, useRef } from 'react';

function LocationAutocomplete({ value, onChange }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!window.google) return;
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['(cities)'], // Restricting to cities (optional)
      // You can add componentRestrictions if needed:
      // componentRestrictions: { country: 'us' },
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        onChange({ target: { name: 'location', value: place.formatted_address } });
      }
    });
  }, [onChange]);

  return (
    <input
      ref={inputRef}
      type="text"
      name="location"
      value={value}
      onChange={onChange}
      placeholder="Enter your city"
      className="inp"
      required
    />
  );
}

export default LocationAutocomplete;