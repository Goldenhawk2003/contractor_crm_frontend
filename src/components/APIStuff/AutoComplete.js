import React, { useEffect, useRef } from 'react';

const GooglePlacesInput = ({ onPlaceSelected }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!window.google) {
      console.error('Google Maps API is not loaded.');
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode'], // You can change to ['address'] or other types
      componentRestrictions: { country: 'ca' },
    });

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
      style={{
        width: '100%',
        maxWidth: '400px',
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '16px',
        display: 'block',
        marginTop: '1rem'
      }}
    />
  );
};

export default GooglePlacesInput;