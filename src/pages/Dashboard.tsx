import { lazy, Suspense, useMemo, useState, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import Modal from '../components/Model';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateWatchlistData } from '../store/features/portfolio/portfolio.actions';
import OptimizedImage from '../components/ui/optimized-image';
import ButtonMemo from '../components/ui/button';
import { cn } from '../lib/utils';

const Table = lazy(() => import('../components/Table'));
const DoughnutChart = lazy(() => import('../components/DoughnutChart'));
const WalletConnect = lazy(() => import('../components/WalletConnect'));

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const watchlist = useAppSelector((state) => state.portfolio.watchlist);
  const lastUpdated = useAppSelector((state) => state.portfolio.lastUpdated);

  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: watchlist.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
  });

  // Calculate total portfolio value
  const portfolioTotal = useMemo(
    () => watchlist.reduce((sum, coin) => sum + (coin.value || 0), 0),
    [watchlist]
  );

  // Handle manual refresh
  const handleManualRefresh = () => {
    setIsRefresh(true);
    try {
      if (watchlist.length > 0) {
        dispatch(updateWatchlistData());
      }
    } catch (error) {
      console.error('Error refreshing watchlist data:', error);
    } finally {
      setIsRefresh(false);
    }
  };

  // Generate random colors for chart
  const generateColors = (numColors: number): string[] => {
    return Array.from({ length: numColors }, () => {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      return `rgba(${r}, ${g}, ${b}, 0.6)`;
    });
  };

  const colors = useMemo(() => generateColors(watchlist.length || 0), [watchlist.length]);
  const total = useMemo(() => watchlist.reduce((acc, c) => acc + (c.value || 0), 0), [watchlist]);

  return (
    <div className="md:p-(--large-page-padding) p-(--small-page-padding)">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <OptimizedImage src="/icons/logo.svg" alt="brand logo" width={32} height={32} />
          <h1 className="sm:text-xl font-semibold">Token Portfolio</h1>
        </div>

        <Suspense
          fallback={
            <OptimizedImage
              src="/icons/cached.svg"
              alt="Loading Spinner"
              className="animate-spin"
              width={32}
              height={32}
            />
          }
        >
          <WalletConnect />
        </Suspense>
      </div>

      <main className="py-7 flex flex-col gap-12">
        {/* Portfolio Overview */}
        <div className="bg-(--bg-secondary) rounded-xl p-6 flex gap-12 md:flex-row flex-col md:gap-0">
          <div className="flex flex-col justify-between gap-5 h-auto w-full">
            <div className="flex flex-col gap-2">
              <p className="text-(--text-secondary) font-medium">Portfolio Total</p>
              <p className="text-[56px] font-medium">
                $
                {portfolioTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="text-(--text-secondary) text-xs">
              Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : '-'}
            </div>
          </div>

          <div className="h-full w-full">
            <div>
              <p className="text-(--text-secondary) font-medium">Portfolio Breakdown</p>
            </div>
            <div className="mt-4 w-full flex gap-5 xl:flex-row flex-col items-center xl:items-start h-full">
              <Suspense
                fallback={
                  <div className="w-full h-full my-8 flex items-center justify-center">
                    <OptimizedImage
                      src="/icons/cached.svg"
                      alt="Loading Spinner"
                      className="animate-spin"
                      width={32}
                      height={32}
                    />
                  </div>
                }
              >
                {watchlist.length > 0 ? (
                  <>
                    <DoughnutChart portfolioData={watchlist} colors={colors} />
                    <div ref={parentRef} className="h-[300px] w-full overflow-auto">
                      <div
                        style={{
                          height: `${rowVirtualizer.getTotalSize()}px`,
                          width: '100%',
                          position: 'relative',
                        }}
                      >
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                          const coin = watchlist[virtualRow.index];
                          const percentage = total === 0 ? 0 : ((coin.value / total) * 100).toFixed(2);
                          return (
                            <div
                              key={virtualRow.key}
                              data-index={virtualRow.index}
                              className="absolute top-0 left-0 flex justify-between w-full gap-5 px-2"
                              style={{
                                transform: `translateY(${virtualRow.start}px)`,
                                color: colors[virtualRow.index].replace('0.6', '1'),
                                height: `${virtualRow.size}px`,
                              }}
                            >
                              <p className="text-sm sm:text-base font-medium">
                                {coin.name} ({coin.symbol.toUpperCase()})
                              </p>
                              <p className="text-(--text-secondary) text-sm sm:text-base font-medium">
                                {percentage}%
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full flex flex-col gap-1 mt-2">
                    <h3>No Data Available</h3>
                    <p className="text-(--text-secondary) text-sm">
                      Start by updating your holdings for a token
                    </p>
                  </div>
                )}
              </Suspense>
            </div>
          </div>
        </div>

        {/* Watchlist Table */}
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <OptimizedImage src="/icons/star.svg" alt="Star Icon" width={32} height={32} />
              <p className="text-2xl font-medium">Watchlist</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Desktop Refresh */}
              <div className="hidden md:block">
                <ButtonMemo
                  aria-label="Refresh Prices"
                  onClick={handleManualRefresh}
                  disabled={isRefresh}
                  className={'rounded-lg border border-[#0000001F] bg-(--bg-secondary) gap-2 disabled:cursor-wait disabled:opacity-70'}
                >
                  <OptimizedImage
                    src="/icons/cached.svg"
                    alt="Refresh Icon"
                    width={16}
                    height={16}
                    className={cn(isRefresh && 'animate-spin')}
                  />
                  {isRefresh ? 'Refreshing...' : 'Refresh Prices'}
                </ButtonMemo>
              </div>
              {/* Mobile Refresh */}
              <ButtonMemo
                aria-label="Refresh Prices"
                onClick={handleManualRefresh}
                disabled={isRefresh}
                className="md:hidden bg-(--bg-secondary) rounded-lg border border-[#0000001F] disabled:cursor-wait disabled:opacity-70"
              >
                <OptimizedImage
                  src="/icons/cached.svg"
                  alt="Refresh Icon"
                  width={16}
                  height={16}
                  className={cn(isRefresh && 'animate-spin')}
                />
              </ButtonMemo>

              {/* Add Token Button */}
              <ButtonMemo
                aria-label="Add Token"
                onClick={() => setIsModalOpen(true)}
                className="hidden md:flex gap-2 bg-(--neon-green) text-(--text-neon-button) rounded-lg border border-[#1F6619]"
              >
                <OptimizedImage src="/icons/plus-mini.svg" alt="Add Icon" width={16} height={16} />
                Add Token
              </ButtonMemo>
            </div>
          </div>

          {isModalOpen && (
            <Modal closeModal={() => setIsModalOpen(false)} isModalOpen={isModalOpen} />
          )}

          <Suspense
            fallback={
              <div className="w-full h-full my-8 flex items-center justify-center">
                <OptimizedImage
                  src="/icons/cached.svg"
                  alt="Loading Spinner"
                  className="animate-spin"
                  width={32}
                  height={32}
                />
              </div>
            }
          >
            <Table />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
