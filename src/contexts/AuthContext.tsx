import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'mine-operator' | 'regulator' | 'admin';
  mineId?: string;
  organization: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const mockUsers = [
  {
    id: '1',
    email: 'operator@coalmine.gov.in',
    password: 'password123',
    name: 'Rajesh Kumar',
    role: 'mine-operator' as const,
    mineId: 'MINE001',
    organization: 'Eastern Coalfields Limited'
  },
  {
    id: '2',
    email: 'regulator@cpcb.gov.in',
    password: 'password123',
    name: 'Dr. Priya Sharma',
    role: 'regulator' as const,
    organization: 'Central Pollution Control Board'
  },
  {
    id: '3',
    email: 'admin@coalmine.gov.in',
    password: 'password123',
    name: 'Administrator',
    role: 'admin' as const,
    organization: 'Ministry of Coal'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('coalmine_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('coalmine_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => 
      u.email === email && 
      u.password === password && 
      u.role === role
    );

    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        mineId: foundUser.mineId,
        organization: foundUser.organization
      };
      
      setUser(userData);
      localStorage.setItem('coalmine_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('coalmine_user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 