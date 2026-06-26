import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback(
    (id) => favorites.includes(id),
    [favorites]
  );

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  }, []);

  return { favorites, isFavorite, toggleFavorite };
};
