import { useState, useEffect } from 'react';

interface CurrentUser {
  id: string;
  email: string;
  full_name: string | null;
  role: 'administrador' | 'personal';
  is_active: boolean;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/current-user');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return {
    user,
    loading,
    isAdmin: user?.role === 'administrador',
    isPersonal: user?.role === 'personal',
  };
}
