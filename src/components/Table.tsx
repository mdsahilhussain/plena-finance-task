import { useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  updateWatchlistData,
  updateHoldings,
  removeFromWatchlist,
} from '../store/features/portfolio/portfolio.actions';
import OptimizedImage from './ui/optimized-image';
import { cn } from '../lib/utils';
import Sparkline from './ui/sparkline';
import ButtonMemo from './ui/button';

const ITEMS_PER_PAGE = 10;

const Table: React.FC = () => {
  const dispatch = useAppDispatch();
  const watchlist = useAppSelector((state) => state.portfolio.watchlist);

  const [editingHoldings, setEditingHoldings] = useState<Record<string, number | undefined>>({});
  const [isMenuOpen, setIsMenuOpen] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  // Auto-refresh every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      if (watchlist.length > 0) {
        dispatch(updateWatchlistData());
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [watchlist.length, dispatch]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pagination
  const totalItems = watchlist.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentData = watchlist.slice(startIndex, endIndex);

  // Handlers
  const handleHoldingsChange = (coinId: string, value: string) => {
    setEditingHoldings((prev) => ({ ...prev, [coinId]: parseFloat(value) }));
  };

  const handleHoldingsUpdate = (coinId: string) => {
    const holdings = editingHoldings[coinId];
    if (holdings !== undefined && !isNaN(holdings) && holdings >= 0) {
      dispatch(updateHoldings(coinId, holdings));
      setEditingHoldings((prev) => ({ ...prev, [coinId]: undefined }));
    }
  };

  const handleMenuToggle = (coinId: string) => {
    setIsMenuOpen((prev) => (prev === coinId ? null : coinId));
  };

  return (
    <div className="overflow-x-auto overflow-y-auto border border-(--border) mt-4 rounded-xl">
      <table className="min-w-[1200px] w-full border-collapse">
        {/* Header */}
        <thead className="w-full text-(--text-secondary) bg-(--bg-secondary) text-sm">
          <tr>
            {['Token', 'Price', '24h %', 'Sparkline (7d)', 'Holdings', 'Value', ''].map(
              (col, i) => (
                <th key={i} className="py-4 px-8 text-nowrap font-normal text-left">
                  {col}
                </th>
              )
            )}
          </tr>
        </thead>

        {/* Body */}
        {totalItems === 0 ? (
          <tbody>
            <tr>
              <td className="px-8 py-4 text-(--text-secondary)" colSpan={7}>
                No Tokens Added
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {currentData.map((coin) => {
              const isEditing = editingHoldings[coin.id] !== undefined;
              return (
                <tr key={coin.id} className="hover:bg-(--bg-secondary)">
                  {/* Token */}
                  <td className="px-8 py-4 max-w-[206px]">
                    <div className="flex items-center">
                      <OptimizedImage
                        src={coin.image}
                        alt={coin.name}
                        width={32}
                        height={32}
                        className="mr-3"
                      />
                      <div className="flex items-center gap-2">
                        <div className="text-[13px] sm:text-base font-[400] sm:font-medium">
                          {coin.name}
                        </div>
                        <div className="text-sm text-gray-500 uppercase">({coin.symbol})</div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-8 py-4 text-(--text-secondary) text-[13px] sm:text-base font-[400] sm:font-medium">
                    ${coin.current_price?.toLocaleString()}
                  </td>

                  {/* 24h Change */}
                  <td className="px-8 py-4 text-(--text-secondary) text-[13px] sm:text-base font-[400] sm:font-medium">
                    <div className="inline-flex items-center">
                      {coin.price_change_percentage_24h >= 0 ? '+' : '-'}
                      {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
                    </div>
                  </td>

                  {/* Sparkline */}
                  <td className="px-8 py-4">
                    <Sparkline
                      data={coin.sparkline_in_7d?.price || []}
                      trendPositive={coin.price_change_percentage_24h >= 0}
                    />
                  </td>

                  {/* Holdings */}
                  <td className="px-8 py-4">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          aria-label="Edit holdings"
                          value={editingHoldings[coin.id]}
                          onChange={(e) => handleHoldingsChange(coin.id, e.target.value)}
                          onBlur={() => handleHoldingsUpdate(coin.id)}
                          onKeyDown={(e) => e.key === 'Enter' && handleHoldingsUpdate(coin.id)}
                          className="w-24 px-2 py-1 border rounded border-(--neon-green) focus:outline-none backdrop-blur-3xl placeholder:text-sm ring-2 ring-(--neon-shadow)"
                          step="0.01"
                          min="0"
                          autoFocus
                        />
                        <ButtonMemo
                          aria-label="Save Holding"
                          className="rounded-lg border text-sm sm:text-base border-[#1F6619] bg-(--neon-green) text-(--text-neon-button)"
                        >
                          Save
                        </ButtonMemo>
                      </div>
                    ) : (
                      <p className="text-[13px] sm:text-base font-[400] sm:font-medium">
                        {coin.holdings || 0}
                      </p>
                    )}
                  </td>

                  {/* Value */}
                  <td className="px-8 py-4 text-[13px] sm:text-base font-[400] sm:font-medium">
                    $
                    {(coin.value || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>

                  {/* Menu */}
                  <td className="px-8 py-4 relative">
                    <ButtonMemo
                      onClick={() => handleMenuToggle(coin.id)}
                      className="hover:cursor-pointer"
                      aria-label="Open menu"
                      aria-haspopup="true"
                      aria-expanded={isMenuOpen === coin.id}
                      aria-controls={`menu-${coin.id}`}
                    >
                      <OptimizedImage
                        src="/icons/ellipsis-horizontal.svg"
                        alt="ellipsis horizontal icon"
                        width={28}
                        height={28}
                      />
                    </ButtonMemo>
                    {isMenuOpen === coin.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-15 top-11 bg-(--bg-secondary) rounded-lg border border-(--bg-primary) shadow text-sm text-(--text-secondary) font-medium z-50 min-w-[144px] flex flex-col"
                      >
                        <ButtonMemo
                          aria-label="Edit Holdings"
                          onClick={() => {
                            setEditingHoldings((prev) => ({
                              ...prev,
                              [coin.id]: coin.holdings || 0,
                            }));
                            setIsMenuOpen(null);
                          }}
                          className="gap-2 border-b border-(--border)"
                        >
                          <OptimizedImage src="/icons/pencil-square.svg" alt="Edit Holdings" />
                          Edit Holdings
                        </ButtonMemo>
                        <ButtonMemo
                          aria-label="Remove from Watchlist"
                          onClick={() => dispatch(removeFromWatchlist(coin.id))}
                          className="gap-2 text-red-400"
                        >
                          <OptimizedImage src="/icons/trash.svg" alt="Remove Holdings" /> Remove
                        </ButtonMemo>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        )}
      </table>

      {/* Footer */}
      <div className="min-w-[1200px] flex justify-between w-full py-4 px-8 text-nowrap border-t border-(--border) font-medium text-sm text-(--text-secondary)">
        {totalItems > 0 ? (
          <>
            <p>{`${startIndex + 1} - ${endIndex} of ${totalItems} results`}</p>
            <div className="flex items-center gap-4">
              <p>{`${currentPage} of ${totalPages} pages`}</p>
              <div className="flex items-center gap-4">
                <ButtonMemo
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={cn(
                    'px-2 py-1 rounded',
                    currentPage === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-(--bg-secondary)'
                  )}
                >
                  Prev
                </ButtonMemo>
                <ButtonMemo
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={cn(
                    'px-2 py-1 rounded',
                    currentPage === totalPages
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-(--bg-secondary)'
                  )}
                >
                  Next
                </ButtonMemo>
              </div>
            </div>
          </>
        ) : (
          <>
            <p>0 - 0 of 0 results</p>
            <div className="flex items-center gap-4">
              <p>0 of 0 pages</p>
              <div className="flex items-center gap-4">
                <ButtonMemo aria-label="Prev Page" className="cursor-not-allowed">
                  Prev
                </ButtonMemo>
                <ButtonMemo aria-label="Next Page" className="cursor-not-allowed">
                  Next
                </ButtonMemo>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Table;
