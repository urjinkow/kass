import React from 'react';
import './CategoryGrid.css';

interface Category {
  id: number;
  name: string;
  name_mn: string;
}

interface CategoryGridProps {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, selectedId, onSelect }) => {
  // Take first 6 categories
  const displayCategories = categories.slice(0, 6);
  
  return (
    <div className="category-grid">
      {displayCategories.map((category) => (
        <button
          key={category.id}
          className={`category-btn glass-button ${selectedId === category.id ? 'selected' : ''}`}
          onClick={() => onSelect(category.id)}
        >
          {category.name_mn}
        </button>
      ))}
    </div>
  );
};
