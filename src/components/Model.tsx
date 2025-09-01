import React, { useEffect, useState, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCoins, toggleCoinSelection } from '../store/features/coin/coin.actions';
import { addToWatchlist } from '../store/features/portfolio/portfolio.actions';
import OptimizedImage from './ui/optimized-image';
import { cn } from '../lib/utils';
import ButtonMemo from './ui/button';

interface ModalProps {
  closeModal: () => void;
  isModalOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({ closeModal, isModalOpen }) => {
  const dispatch = useAppDispatch();
  const { coins, loading, error, selectedCoins } = useAppSelector((state) => state.coins);
  const watchlist = useAppSelector((state) => state.portfolio.watchlist);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isModalOpen && coins.length === 0) {
      dispatch(fetchCoins());
    }
  }, [isModalOpen, coins.length, dispatch]);

  const filteredCoins = useMemo(
    () =>
      coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [coins, searchTerm]
  );

  const handleAddToWatchlist = () => {
    const newCoins = selectedCoins.filter((coin) => !watchlist.some((w) => w.id === coin.id));
    if (newCoins.length > 0) {
      dispatch(addToWatchlist(newCoins));
      closeModal();
    }
  };

  return (
    <div
      className="flex justify-center items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-(--bg-secondary) opacity-75 z-40" onClick={closeModal}></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div
          className="bg-(--bg-primary) border border-(--border) rounded-xl shadow-lg w-[640px] h-[480px] transform transition-all duration-300 scale-95 opacity-0 animate-fadeIn pointer-events-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex-shrink-0">
            <input
              type="text"
              aria-label='Search tokens'
              placeholder="Search tokens (e.g., ETH, SOL)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-b border-(--border) placeholder:text-sm outline-none bg-transparent"
            />
          </div>

          {/* Trending List */}
          <div className="flex-1 px-4 py-3 overflow-hidden flex flex-col">
            <p id="modal-title" className="text-(--text-secondary) text-sm mb-3 flex-shrink-0">
              Trending
            </p>
            <div className="flex-1 overflow-y-auto">
              {loading && <div className="flex justify-center items-center h-40">Loading</div>}

              {error && (
                <div className="flex items-center justify-center h-40 text-red-500">{error}</div>
              )}

              {!loading &&
                !error &&
                filteredCoins.slice(0, 50).map((coin) => {
                  const isSelected = selectedCoins.some((c) => c.id === coin.id);
                  const isInWatchlist = watchlist.some((w) => w.id === coin.id);

                  return (
                    <div
                      key={coin.id}
                      className={cn(
                        'flex items-center p-3 cursor-pointer rounded-lg mb-2 ',
                        isSelected
                          ? 'bg-[#A9E8510F] backdrop-blur-2xl'
                          : 'hover:bg-(--bg-secondary)',
                        isInWatchlist && 'opacity-50'
                      )}
                      onClick={() => !isInWatchlist && dispatch(toggleCoinSelection(coin))}
                    >
                      <OptimizedImage
                        src={coin.image}
                        alt={coin.name}
                        width={32}
                        height={32}
                        className="mr-3"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <div className="font-medium">{coin.name}</div>
                        <div className="text-sm text-gray-500 uppercase">({coin.symbol})</div>
                      </div>
                      {isInWatchlist && (
                        <span className="mr-3 text-xs border border-(--border) px-2 py-1 rounded">
                          In Watchlist
                        </span>
                      )}
                      <div className="text-right flex items-center gap-3">
                        {isSelected && (
                          <OptimizedImage
                            src="/icons/star.svg"
                            alt="Selected"
                            width={15}
                            height={15}
                          />
                        )}
                        <input
                          type="radio"
                          aria-label='Select coin'
                          checked={isSelected}
                          onChange={() => {}}
                          disabled={isInWatchlist}
                          className="mr-3 h-[15px] w-[15px] appearance-none rounded-full border-2 border-gray-400 checked:border-none checked:bg-(--neon-green) relative"
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 bg-(--bg-secondary) rounded-b-xl px-4 py-3 flex justify-end border-t border-(--border)">
            <ButtonMemo
              aria-label='Add selected coins to watchlist'
              className={cn(
                'rounded-lg border',
                selectedCoins.length === 0
                  ? 'text-(--border) cursor-not-allowed border-(--border)'
                  : 'bg-(--neon-green) text-(--text-neon-button) border-[#1F6619]'
              )}
              disabled={selectedCoins.length === 0}
              onClick={handleAddToWatchlist}
            >
              Add to WatchList
            </ButtonMemo>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
