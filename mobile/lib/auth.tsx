import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Tier = 'free' | 'basic' | 'premium' | 'pro';

export interface UserOffer {
  id: string;
  address: string;
  price: number;
  listPrice: number;
  status: 'pending' | 'draft' | 'accepted' | 'rejected';
  label: string;
  date: string;
  photo: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  tier: Tier;
  state: string;
  offers: UserOffer[];
  savedHomeIds: string[];
}

export const TIER_FEATURES: Record<Tier, {
  label: string; price: string; maxOffers: number;
  pdfDownload: boolean; agentSend: boolean; savedHomes: number; journeyTracker: boolean;
}> = {
  free:    { label: 'Free',    price: '$0',     maxOffers: 1,   pdfDownload: false, agentSend: false, savedHomes: 3,   journeyTracker: false },
  basic:   { label: 'Basic',   price: '$29',    maxOffers: 5,   pdfDownload: true,  agentSend: false, savedHomes: 15,  journeyTracker: true  },
  premium: { label: 'Premium', price: '$99',    maxOffers: 99,  pdfDownload: true,  agentSend: true,  savedHomes: 99,  journeyTracker: true  },
  pro:     { label: 'Pro',     price: '$49/mo', maxOffers: 999, pdfDownload: true,  agentSend: true,  savedHomes: 999, journeyTracker: true  },
};

const TEST_ACCOUNTS: Record<string, AuthUser> = {
  'free@test.com': {
    id: 'u-free', name: 'Alex Chen', email: 'free@test.com', tier: 'free', state: 'IL',
    offers: [
      { id: '1', address: '2847 N Clark St, Chicago, IL', price: 485000, listPrice: 485000,
        status: 'draft', label: 'Draft', date: 'May 24, 2026',
        photo: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400' },
    ],
    savedHomeIds: ['1'],
  },
  'basic@test.com': {
    id: 'u-basic', name: 'Sam Rivera', email: 'basic@test.com', tier: 'basic', state: 'IL',
    offers: [
      { id: '1', address: '2847 N Clark St, Chicago, IL', price: 492000, listPrice: 485000,
        status: 'pending', label: 'Pending review', date: 'May 22, 2026',
        photo: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400' },
      { id: '2', address: '1520 W Wrightwood Ave, Chicago, IL', price: 618000, listPrice: 625000,
        status: 'draft', label: 'Draft', date: 'May 20, 2026',
        photo: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400' },
    ],
    savedHomeIds: ['1', '3'],
  },
  'premium@test.com': {
    id: 'u-premium', name: 'Jordan Taylor', email: 'premium@test.com', tier: 'premium', state: 'IL',
    offers: [
      { id: '1', address: '2847 N Clark St, Chicago, IL', price: 492000, listPrice: 485000,
        status: 'pending', label: 'Pending review', date: 'May 22, 2026',
        photo: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400' },
      { id: '2', address: '1520 W Wrightwood Ave, Chicago, IL', price: 618000, listPrice: 625000,
        status: 'draft', label: 'Draft', date: 'May 20, 2026',
        photo: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400' },
      { id: '3', address: '900 N Michigan Ave, Chicago, IL', price: 380000, listPrice: 395000,
        status: 'rejected', label: 'Not accepted', date: 'May 15, 2026',
        photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400' },
    ],
    savedHomeIds: ['1', '3'],
  },
};

const STORAGE_KEY = 'hod_user';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, state: string) => Promise<void>;
  logout: () => Promise<void>;
  saveHome: (id: string) => void;
  unsaveHome: (id: string) => void;
  setTier: (tier: Tier) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(stored => {
      if (stored) {
        try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
      }
      setLoading(false);
    });
  }, []);

  const persist = async (u: AuthUser | null) => {
    setUser(u);
    if (u) await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const login = async (email: string, password: string) => {
    const key = email.toLowerCase().trim();
    const test = TEST_ACCOUNTS[key];
    if (test && password === 'test123') { await persist(test); return; }
    const raw = await AsyncStorage.getItem('hod_users');
    const users = raw ? JSON.parse(raw) : {};
    const stored = users[key];
    if (stored && stored.password === password) {
      const { password: _, ...u } = stored;
      await persist(u as AuthUser);
      return;
    }
    throw new Error('Invalid email or password');
  };

  const register = async (name: string, email: string, password: string, state: string) => {
    const key = email.toLowerCase().trim();
    if (TEST_ACCOUNTS[key]) throw new Error('This email is reserved for testing');
    const raw = await AsyncStorage.getItem('hod_users');
    const users = raw ? JSON.parse(raw) : {};
    if (users[key]) throw new Error('An account with this email already exists');
    const newUser: AuthUser = {
      id: `u-${Date.now()}`, name: name.trim(), email: key,
      tier: 'free', state, offers: [], savedHomeIds: [],
    };
    users[key] = { ...newUser, password };
    await AsyncStorage.setItem('hod_users', JSON.stringify(users));
    await persist(newUser);
  };

  const logout = async () => persist(null);

  const saveHome = (id: string) => {
    if (!user) return;
    persist({ ...user, savedHomeIds: [...new Set([...user.savedHomeIds, id])] });
  };

  const unsaveHome = (id: string) => {
    if (!user) return;
    persist({ ...user, savedHomeIds: user.savedHomeIds.filter(x => x !== id) });
  };

  const setTier = (tier: Tier) => {
    if (!user) return;
    persist({ ...user, tier });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, saveHome, unsaveHome, setTier }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useTierFeatures() {
  const { user } = useAuth();
  return TIER_FEATURES[user?.tier ?? 'free'];
}
