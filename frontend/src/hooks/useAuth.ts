import type { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { subscribeAuthState } from '../services/authService';

export type UseAuthResult = {
  user: User | null;
  loading: boolean;
};

export const useAuth = (): UseAuthResult => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeAuthState((nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  return { user, loading };
};
