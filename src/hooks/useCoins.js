import { useState, useEffect, useMemo } from 'react';

const API_URL = import.meta.env.VITE_COINS_API_URL;

export const useCoins = (
  limit,
  filter,
  sortBy,
  { favorites = [], showFavorites = false } = {}
) => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch(
          `${API_URL}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
        );
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [limit]);

  const filteredCoins = useMemo(() => {
    return coins
      .filter((coin) => {
        return (
          coin.name.toLowerCase().includes(filter.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(filter.toLowerCase())
        );
      })
      .filter((coin) => !showFavorites || favorites.includes(coin.id))
      .slice()
      .sort((a, b) => {
        switch (sortBy) {
          case 'market_cap_desc':
            return b.market_cap - a.market_cap;
          case 'market_cap_asc':
            return a.market_cap - b.market_cap;
          case 'price_desc':
            return b.current_price - a.current_price;
          case 'price_asc':
            return a.current_price - b.current_price;
          case 'change_desc':
            return b.price_change_percentage_24h - a.price_change_percentage_24h;
          case 'change_asc':
            return a.price_change_percentage_24h - b.price_change_percentage_24h;
          default:
            return 0;
        }
      });
  }, [coins, filter, sortBy, favorites, showFavorites]);

  return { coins: filteredCoins, loading, error };
};
