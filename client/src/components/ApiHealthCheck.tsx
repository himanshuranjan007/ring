import React, { useEffect, useState } from 'react';
import { checkApiHealth } from '../services/api';
import { AlertCircle, CheckCircle2, ServerCrash } from 'lucide-react';

const CHECK_INTERVAL = 60000; // Check every minute

const ApiHealthCheck: React.FC = () => {
  const [isApiHealthy, setIsApiHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const isHealthy = await checkApiHealth();
      setIsApiHealthy(isHealthy);
    } catch (error) {
      console.error('Error checking API health:', error);
      setIsApiHealthy(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Initial check
    checkHealth();

    // Set up interval for periodic checks
    const intervalId = setInterval(checkHealth, CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  // If still checking for the first time, show nothing
  if (isApiHealthy === null && isChecking) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isApiHealthy ? (
        <div className="flex items-center bg-green-600/20 text-green-400 py-2 px-3 rounded-md shadow-md">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          <span className="text-xs">API Connected</span>
        </div>
      ) : (
        <div className="flex items-center bg-red-600/20 text-red-400 py-2 px-3 rounded-md shadow-md cursor-pointer" onClick={checkHealth}>
          {isChecking ? (
            <AlertCircle className="w-4 h-4 mr-2 animate-pulse" />
          ) : (
            <ServerCrash className="w-4 h-4 mr-2" />
          )}
          <span className="text-xs">API {isChecking ? 'Checking...' : 'Disconnected'}</span>
        </div>
      )}
    </div>
  );
};

export default ApiHealthCheck; 