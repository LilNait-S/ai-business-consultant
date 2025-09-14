
import React, { useState } from 'react';
import { Header } from './components/Header';
import { DiscoveryForm } from './components/DiscoveryForm';
import { LoadingDisplay } from './components/LoadingDisplay';
import { ResultsDisplay } from './components/ResultsDisplay';
import { generateStrategicPlan } from './services/geminiService';
import type { DiscoveryData, StrategicPlan } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [strategicPlan, setStrategicPlan] = useState<StrategicPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: DiscoveryData) => {
    setIsLoading(true);
    setError(null);
    setStrategicPlan(null);
    try {
      const plan = await generateStrategicPlan(data);
      setStrategicPlan(plan);
    } catch (e) {
      console.error(e);
      setError('Failed to generate strategic plan. Please check the console for more details.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setStrategicPlan(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {!strategicPlan && !isLoading && (
          <DiscoveryForm onSubmit={handleFormSubmit} />
        )}

        {isLoading && <LoadingDisplay />}
        
        {error && (
           <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-500 mb-4">An Error Occurred</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
                onClick={handleReset}
                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                Start Over
            </button>
        </div>
        )}

        {strategicPlan && !isLoading && (
          <ResultsDisplay plan={strategicPlan} onReset={handleReset} />
        )}
      </main>
    </div>
  );
};

export default App;
