import { useEffect, useRef, useState, useCallback } from 'react';
import { useDisconnect } from 'wagmi';

import OptimizedImage from './ui/optimized-image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import ButtonMemo from './ui/button';

const WalletConnect = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { disconnect } = useDisconnect();

  const formatAddress = useCallback((addr?: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' },
            })}
          >
            {!connected ? (
              <ButtonMemo
                aria-label="Connect Wallet"
                onClick={openConnectModal}
                className="bg-(--neon-green) text-(--text-neon-button) text-xs sm:text-base rounded-3xl border border-[#1F6619] gap-2"
              >
                <OptimizedImage src="/icons/wallet.svg" alt="Wallet Icon" width={24} height={24} />
                Connect Wallet
              </ButtonMemo>
            ) : (
              <div className="relative" ref={menuRef}>
                <ButtonMemo
                  aria-label="Wallet Menu"
                  onClick={() => setOpenMenu(!openMenu)}
                  className="bg-(--neon-green) text-(--text-neon-button) rounded-3xl border border-[#1F6619] gap-2"
                  aria-expanded={openMenu}
                >
                  <OptimizedImage
                    src="/icons/wallet.svg"
                    alt="Wallet Icon"
                    width={28}
                    height={28}
                  />
                  Connected
                </ButtonMemo>
                {openMenu && (
                  <div
                    role="menu"
                    className="absolute animate-fadeIn -bottom-28 right-0 
                      bg-(--bg-secondary) rounded-lg border border-(--bg-primary) 
                      shadow text-sm text-(--text-secondary) font-medium z-50 
                      min-w-[144px] flex flex-col gap-4 py-4 px-8"
                  >
                    <div role="menuitem" className="font-semibold text-sm">
                      <p>{formatAddress(account?.address)}</p>
                    </div>
                    <div role="menuitem">
                      <ButtonMemo
                        aria-label="Disconnect Wallet"
                        onClick={disconnect}
                        className="rounded-3xl border border-red-800 bg-red-500 gap-2"
                      >
                        <OptimizedImage
                          src="/icons/wallet.svg"
                          alt="Wallet Icon"
                          width={28}
                          height={28}
                        />
                        Disconnect
                      </ButtonMemo>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default WalletConnect;
