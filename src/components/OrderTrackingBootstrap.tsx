import React, { useEffect } from 'react';
import { useOrderTracking } from './context/OrderTrackingContext';
import { sessionStore } from '../store/sessionStore';

/** Refreshes active order tracking when session is restored. */
export function OrderTrackingBootstrap({
  children,
}: {
  children: React.ReactNode;
}) {
  const { refreshTracking } = useOrderTracking();
  const userId = sessionStore(s => s.user?.uid);

  useEffect(() => {
    if (userId) {
      void refreshTracking();
    }
  }, [refreshTracking, userId]);

  return children;
}
