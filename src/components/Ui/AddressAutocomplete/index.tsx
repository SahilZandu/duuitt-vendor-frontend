import { useEffect, useRef } from "react";

interface Props {
  value: string;
  onChange: (address: string, coordinates?: [number, number]) => void;
  disabled?: boolean;
}

const AddressAutocomplete = ({ value, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!window.google || !window.google.maps || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
      componentRestrictions: { country: "in" },
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        onChange(place.formatted_address || "", [lng, lat]);
      } else {
        onChange(place.formatted_address || "");
      }
    });
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      // disabled={disabled}
      placeholder="Enter restaurant address"
      className="input"
    />
  );
};

export default AddressAutocomplete;
