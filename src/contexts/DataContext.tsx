import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface EmissionEntry {
  id: string;
  date: string;
  activityType: string;
  quantity: number;
  unit: string;
  co2e: number;
  location?: string;
  notes?: string;
  userId: string;
  mineId?: string;
  createdAt: string;
}

export interface CarbonSinkEntry {
  id: string;
  date: string;
  sinkType: string;
  quantity: number;
  unit: string;
  co2e: number;
  location?: string;
  description?: string;
  userId: string;
  mineId?: string;
  createdAt: string;
}

export interface StrategyEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'planned' | 'in-progress' | 'completed';
  targetReduction: number;
  currentReduction: number;
  startDate: string;
  endDate?: string;
  cost: number;
  roi: number;
  userId: string;
  mineId?: string;
  createdAt: string;
}

interface DataContextType {
  emissions: EmissionEntry[];
  carbonSinks: CarbonSinkEntry[];
  strategies: StrategyEntry[];
  addEmission: (entry: Omit<EmissionEntry, 'id' | 'createdAt'>) => void;
  addCarbonSink: (entry: Omit<CarbonSinkEntry, 'id' | 'createdAt'>) => void;
  addStrategy: (entry: Omit<StrategyEntry, 'id' | 'createdAt'>) => void;
  updateStrategy: (id: string, updates: Partial<StrategyEntry>) => void;
  deleteEmission: (id: string) => void;
  deleteCarbonSink: (id: string) => void;
  deleteStrategy: (id: string) => void;
  getEmissionsByDateRange: (startDate: string, endDate: string) => EmissionEntry[];
  getTotalEmissions: () => number;
  getTotalCarbonSinks: () => number;
  getNetEmissions: () => number;
  getReductionPercentage: () => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock initial data
const initialEmissions: EmissionEntry[] = [
  {
    id: '1',
    date: '2024-01-15',
    activityType: 'Diesel Fuel',
    quantity: 5000,
    unit: 'litres',
    co2e: 13.26,
    location: 'Block A, Pit 2',
    notes: 'Heavy equipment operation',
    userId: '1',
    mineId: 'MINE001',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    date: '2024-01-14',
    activityType: 'Electricity',
    quantity: 8500,
    unit: 'kWh',
    co2e: 6.38,
    location: 'Processing Plant',
    notes: 'Daily operations',
    userId: '1',
    mineId: 'MINE001',
    createdAt: '2024-01-14T10:00:00Z'
  },
  {
    id: '3',
    date: '2024-01-13',
    activityType: 'Vehicle Transport',
    quantity: 2500,
    unit: 'km',
    co2e: 4.15,
    location: 'Transport Fleet',
    notes: 'Coal transportation',
    userId: '1',
    mineId: 'MINE001',
    createdAt: '2024-01-13T10:00:00Z'
  }
];

const initialCarbonSinks: CarbonSinkEntry[] = [
  {
    id: '1',
    date: '2024-01-15',
    sinkType: 'Tree Plantation',
    quantity: 1000,
    unit: 'trees',
    co2e: 2.5,
    location: 'Mine Reclamation Area',
    description: 'Native species plantation',
    userId: '1',
    mineId: 'MINE001',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    date: '2024-01-10',
    sinkType: 'Solar Installation',
    quantity: 500,
    unit: 'kW',
    co2e: 1.2,
    location: 'Mine Office Complex',
    description: 'Solar panel installation',
    userId: '1',
    mineId: 'MINE001',
    createdAt: '2024-01-10T10:00:00Z'
  }
];

const initialStrategies: StrategyEntry[] = [
  {
    id: '1',
    title: 'Solar Power Integration',
    description: 'Install solar panels across mine facilities',
    category: 'Renewable Energy',
    status: 'in-progress',
    targetReduction: 15.0,
    currentReduction: 8.5,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    cost: 2500000,
    roi: 185,
    userId: '1',
    mineId: 'MINE001',
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Electric Vehicle Fleet',
    description: 'Replace diesel vehicles with electric alternatives',
    category: 'Transport',
    status: 'planned',
    targetReduction: 12.0,
    currentReduction: 0,
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    cost: 1800000,
    roi: 142,
    userId: '1',
    mineId: 'MINE001',
    createdAt: '2024-01-01T10:00:00Z'
  }
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [emissions, setEmissions] = useState<EmissionEntry[]>([]);
  const [carbonSinks, setCarbonSinks] = useState<CarbonSinkEntry[]>([]);
  const [strategies, setStrategies] = useState<StrategyEntry[]>([]);

  useEffect(() => {
    // Load data from localStorage or use initial data
    const storedEmissions = localStorage.getItem('coalmine_emissions');
    const storedCarbonSinks = localStorage.getItem('coalmine_carbon_sinks');
    const storedStrategies = localStorage.getItem('coalmine_strategies');

    setEmissions(storedEmissions ? JSON.parse(storedEmissions) : initialEmissions);
    setCarbonSinks(storedCarbonSinks ? JSON.parse(storedCarbonSinks) : initialCarbonSinks);
    setStrategies(storedStrategies ? JSON.parse(storedStrategies) : initialStrategies);
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever it changes
    localStorage.setItem('coalmine_emissions', JSON.stringify(emissions));
  }, [emissions]);

  useEffect(() => {
    localStorage.setItem('coalmine_carbon_sinks', JSON.stringify(carbonSinks));
  }, [carbonSinks]);

  useEffect(() => {
    localStorage.setItem('coalmine_strategies', JSON.stringify(strategies));
  }, [strategies]);

  const addEmission = (entry: Omit<EmissionEntry, 'id' | 'createdAt'>) => {
    const newEntry: EmissionEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setEmissions(prev => [newEntry, ...prev]);
  };

  const addCarbonSink = (entry: Omit<CarbonSinkEntry, 'id' | 'createdAt'>) => {
    const newEntry: CarbonSinkEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setCarbonSinks(prev => [newEntry, ...prev]);
  };

  const addStrategy = (entry: Omit<StrategyEntry, 'id' | 'createdAt'>) => {
    const newEntry: StrategyEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setStrategies(prev => [newEntry, ...prev]);
  };

  const updateStrategy = (id: string, updates: Partial<StrategyEntry>) => {
    setStrategies(prev => prev.map(strategy => 
      strategy.id === id ? { ...strategy, ...updates } : strategy
    ));
  };

  const deleteEmission = (id: string) => {
    setEmissions(prev => prev.filter(emission => emission.id !== id));
  };

  const deleteCarbonSink = (id: string) => {
    setCarbonSinks(prev => prev.filter(sink => sink.id !== id));
  };

  const deleteStrategy = (id: string) => {
    setStrategies(prev => prev.filter(strategy => strategy.id !== id));
  };

  const getEmissionsByDateRange = (startDate: string, endDate: string) => {
    return emissions.filter(emission => 
      emission.date >= startDate && emission.date <= endDate
    );
  };

  const getTotalEmissions = () => {
    return emissions.reduce((total, emission) => total + emission.co2e, 0);
  };

  const getTotalCarbonSinks = () => {
    return carbonSinks.reduce((total, sink) => total + sink.co2e, 0);
  };

  const getNetEmissions = () => {
    return getTotalEmissions() - getTotalCarbonSinks();
  };

  const getReductionPercentage = () => {
    const totalEmissions = getTotalEmissions();
    const carbonSinks = getTotalCarbonSinks();
    if (totalEmissions === 0) return 0;
    return (carbonSinks / totalEmissions) * 100;
  };

  const value: DataContextType = {
    emissions,
    carbonSinks,
    strategies,
    addEmission,
    addCarbonSink,
    addStrategy,
    updateStrategy,
    deleteEmission,
    deleteCarbonSink,
    deleteStrategy,
    getEmissionsByDateRange,
    getTotalEmissions,
    getTotalCarbonSinks,
    getNetEmissions,
    getReductionPercentage
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}; 