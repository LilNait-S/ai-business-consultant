
import React, { useState } from 'react';
import type { DiscoveryData } from '../types';

interface DiscoveryFormProps {
  onSubmit: (data: DiscoveryData) => void;
}

const FormField: React.FC<{ id: keyof DiscoveryData; label: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; }> = ({ id, label, placeholder, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
        </label>
        <textarea
            id={id}
            name={id}
            rows={3}
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
        />
    </div>
);


export const DiscoveryForm: React.FC<DiscoveryFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<DiscoveryData>({
    currentSituation: '',
    goals: '',
    resources: '',
    competition: '',
    timeline: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">FASE 1: DISCOVERY</h2>
            <p className="mt-2 text-md text-gray-600 dark:text-gray-400">Provide the core details of your business challenge.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormField id="currentSituation" label="Current Situation" placeholder="e.g., We are a SaaS startup with 10k MRR, but growth has stagnated." value={formData.currentSituation} onChange={handleChange} />
            <FormField id="goals" label="Desired Goals" placeholder="e.g., Reach 50k MRR within 12 months and expand into the European market." value={formData.goals} onChange={handleChange} />
            <FormField id="resources" label="Available Resources & Limitations" placeholder="e.g., Team of 5 developers, 2 marketers. Marketing budget of $5k/month. No sales team." value={formData.resources} onChange={handleChange} />
            <FormField id="competition" label="Competition & Market Positioning" placeholder="e.g., Main competitor is 'Competitor X' who is well-funded. We differentiate on ease of use." value={formData.competition} onChange={handleChange} />
            <FormField id="timeline" label="Timeline & Success Metrics" placeholder="e.g., 18-month plan. Success is measured by user retention rate > 40% and profitability." value={formData.timeline} onChange={handleChange} />
            
            <div className="pt-4 text-center">
                 <button type="submit" className="w-full md:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-transform transform hover:scale-105">
                    Generate Strategic Plan
                 </button>
            </div>
        </form>
    </div>
  );
};
