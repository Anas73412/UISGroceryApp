import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import AuthRepository from '../data/repositories/AuthRepository';
import { sessionStore } from '../store/sessionStore';

type Props = {
  children: React.ReactNode;
};

/** Restores in-memory session from Keychain + DB when the app returns to foreground. */
export function SessionRehydrator({ children }: Props) {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        void AuthRepository.isLoggedIn().then(loggedIn => {
          if (loggedIn) {
            void sessionStore.getState().loadSession();
          }
        });
      }
    });

    return () => subscription.remove();
  }, []);

  return <>{children}</>;
}
