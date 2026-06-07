import { useState, useEffect } from 'react';
import * as Network from 'expo-network';

export function useConnectivity() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        setIsOnline(state.isConnected !== false && state.isInternetReachable !== false);
      } catch {
        setIsOnline(true);
      }
    };
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  return isOnline;
}
