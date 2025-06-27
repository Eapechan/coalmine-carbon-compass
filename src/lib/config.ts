// Configuration file for API keys and environment variables
export const config = {
  // Gemini AI Configuration
  gemini: {
    apiKey: 'AIzaSyBdohNujUi9hSHMMmvpFcKDUai_cvsLH9A',
    apiUrl: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
    model: 'gemini-1.5-flash',
    maxTokens: 2048,
    temperature: 0.7,
  },
  
  // App Configuration
  app: {
    name: 'CoalMineNetZero',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development',
  },
  
  // Feature Flags
  features: {
    aiEnabled: true,
    notificationsEnabled: true,
    exportEnabled: true,
  }
};

// Validate required configuration
export const validateConfig = () => {
  if (!config.gemini.apiKey && import.meta.env.DEV) {
    console.warn('Gemini API key not found. AI features may not work properly.');
  }
  
  return {
    aiEnabled: config.features.aiEnabled && !!config.gemini.apiKey,
    notificationsEnabled: config.features.notificationsEnabled,
    exportEnabled: config.features.exportEnabled,
  };
};

export default config; 