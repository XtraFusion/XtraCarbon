import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export function useUserSync() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !isSignedIn || !user || synced) return;

      setSyncing(true);
      try {
        const response = await fetch('/api/users/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setSynced(true);
        }
      } catch (error) {
        console.error('Error syncing user:', error);
      } finally {
        setSyncing(false);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user, synced]);

  return { syncing, synced };
}
