import { useState } from 'react';
import CoinCard from '../components/CoinCard';
import LimitSelector from '../components/LimitSelector';
import FilterInput from '../components/FilterInput';
import SortSelector from '../components/SortSelector';
import Spinner from '../components/Spinner';
import { useCoins } from '../hooks/useCoins';
import { useFavorites } from '../hooks/useFavorites';

const HomePage = () => {
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('market_cap_desc');
  const [showFavorites, setShowFavorites] = useState(false);

  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { coins, loading, error } = useCoins(limit, filter, sortBy, {
    favorites,
    showFavorites,
  });

  return (
    <div>
      <h1>🚀 Crypto Dash</h1>
      {loading && <Spinner color='white' />}
      {error && <div className='error'>{error}</div>}

      <div className='top-controls'>
        <FilterInput filter={filter} onFilterChange={setFilter} />
        <LimitSelector limit={limit} onLimitChange={setLimit} />
        <SortSelector sortBy={sortBy} onSortChange={setSortBy} />
        <label className='favorites-toggle'>
          <input
            type='checkbox'
            checked={showFavorites}
            onChange={(e) => setShowFavorites(e.target.checked)}
          />
          Show favorites only
        </label>
      </div>

      {!loading && !error && (
        <main className='grid'>
          {coins.length > 0 ? (
            coins.map((coin) => (
              <CoinCard
                key={coin.id}
                coin={coin}
                isFavorite={isFavorite(coin.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))
          ) : (
            <p>{showFavorites ? 'No favorite coins yet' : 'No matching coins'}</p>
          )}
        </main>
      )}
    </div>
  );
};

export default HomePage;
