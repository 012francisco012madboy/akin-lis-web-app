import React, { useState } from "react";
import clsx from "clsx";

interface AutocompleteProps {
  suggestions: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
  className?: string; // Estilo da div raiz
  inputClassName?: string; // Estilo do input
  listClassName?: string; // Estilo da lista de sugestões
  itemClassName?: string; // Estilo dos itens na lista
  hoverClassName?: string; // Estilo ao passar o mouse nos itens
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  suggestions,
  onSelect,
  placeholder = "Search...",
  className,
  inputClassName,
  listClassName,
  itemClassName,
  hoverClassName,
}) => {
  const [query, setQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setFilteredSuggestions(
      suggestions.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSelect = (value: string) => {
    setQuery(value);
    setFilteredSuggestions([]);
    onSelect(value);
    setIsFocused(false);
  };

  return (
    <div className={clsx("relative w-full", className)}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        className={clsx(
          "form-input w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",
          inputClassName
        )}
        placeholder={placeholder}
      />
      {isFocused && filteredSuggestions.length > 0 && (
        <ul
          className={clsx(
            "absolute z-10 mt-2 w-full rounded-md border border-gray-300 bg-white shadow-lg",
            listClassName
          )}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelect(suggestion)}
              className={clsx(
                "cursor-pointer px-4 py-2",
                itemClassName,
                hoverClassName ? hoverClassName : "hover:bg-indigo-100"
              )}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
