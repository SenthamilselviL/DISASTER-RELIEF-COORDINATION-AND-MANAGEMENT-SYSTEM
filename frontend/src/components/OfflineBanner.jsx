import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

export const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setJustReconnected(true);
      setTimeout(() => setJustReconnected(false), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setJustReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (justReconnected) {
    return (
      <div className="offline-banner" style={{ backgroundColor: '#15803d' }}>
        <Wifi size={18} />
        <span>Connection Restored! You are back online.</span>
      </div>
    );
  }

  if (isOnline) return null;

  return (
    <div className="offline-banner">
      <WifiOff size={18} />
      <span>You are currently working offline. Emergency forms will save drafts locally.</span>
      <button
        onClick={() => window.location.reload()}
        className="btn btn-sm btn-outline"
        style={{ color: '#ffffff', borderColor: '#ffffff', marginLeft: '12px' }}
      >
        <RefreshCw size={14} /> Retry Connection
      </button>
    </div>
  );
};
