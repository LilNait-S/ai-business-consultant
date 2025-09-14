
import React, { useState } from 'react';
import type { StrategicPlan, AnalysisSection, StrategicInitiative, RoadmapDetail } from '../types';

interface ResultsDisplayProps {
  plan: StrategicPlan;
  onReset: () => void;
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const SectionCard: React.FC<{ section: AnalysisSection; icon: React.ReactNode }> = ({ section, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-xl font-bold ml-3 text-gray-900 dark:text-white">{section.title}</h3>
    </div>
    <ul className="space-y-3">
      {section.points.map((point, index) => (
        <li key={index} className="flex items-start">
          <CheckIcon className="text-green-500 flex-shrink-0 mt-1 mr-2" />
          <span className="text-gray-700 dark:text-gray-300">{point}</span>
        </li>
      ))}
    </ul>
  </div>
);

const RoadmapAccordion: React.FC<{ initiative: StrategicInitiative }> = ({ initiative }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { details } = initiative;

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <div>
                    <h4 className="font-bold text-lg text-left text-gray-800 dark:text-gray-100">{initiative.title}</h4>
                    <p className="text-sm text-left text-gray-600 dark:text-gray-400 mt-1">{initiative.description}</p>
                </div>
                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DetailItem title="Initiative" content={details.initiative} />
                        <DetailItem title="Timeline" content={details.timeline} />
                        <DetailItem title="Suggested Owner" content={details.owner} />
                        <DetailList title="Key Performance Indicators (KPIs)" items={details.kpis} />
                        <DetailList title="Resources Needed" items={details.resources} />
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailItem: React.FC<{title: string; content: string}> = ({title, content}) => (
    <div>
        <h5 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h5>
        <p className="mt-1 text-gray-800 dark:text-gray-200">{content}</p>
    </div>
);

const DetailList: React.FC<{title: string; items: string[]}> = ({title, items}) => (
    <div>
        <h5 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h5>
        <ul className="mt-1 space-y-1 list-disc list-inside">
            {items.map((item, i) => <li key={i} className="text-gray-800 dark:text-gray-200">{item}</li>)}
        </ul>
    </div>
);


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ plan, onReset }) => {
  const [activeTab, setActiveTab] = useState<'quickWins' | 'strategicInitiatives' | 'transformationalBets'>('quickWins');
  
  const tabs = [
    { id: 'quickWins', label: 'Quick Wins (0-30 Days)', data: plan.strategy.quickWins },
    { id: 'strategicInitiatives', label: 'Strategic Initiatives (1-6 Months)', data: plan.strategy.strategicInitiatives },
    { id: 'transformationalBets', label: 'Transformational Bets (6-18+ Months)', data: plan.strategy.transformationalBets }
  ];

  return (
    <div className="space-y-12">
      {/* Analysis Section */}
      <div>
        <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-900 dark:text-white">FASE 2: ANALYSIS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionCard section={plan.analysis.currentSituation} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5l4 4v10a2 2 0 01-2 2z" /></svg>} />
          <SectionCard section={plan.analysis.gaps} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          <SectionCard section={plan.analysis.opportunities} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>} />
          <SectionCard section={plan.analysis.risks} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
        </div>
      </div>
      
      {/* Strategy & Execution Section */}
      <div>
        <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-900 dark:text-white">FASE 3 & 4: STRATEGY & EXECUTION</h2>
        <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-2 sm:space-x-4 px-2" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`whitespace-nowrap py-4 px-1 sm:px-4 border-b-2 font-medium text-sm transition-colors
                            ${activeTab === tab.id
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                            }`}
                    >
                    {tab.label}
                    </button>
                ))}
                </nav>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                  {tabs.find(t => t.id === activeTab)?.data.map((initiative, index) => (
                     <RoadmapAccordion key={index} initiative={initiative} />
                  ))}
                </div>
            </div>
        </div>
      </div>

      {/* Conclusion */}
      <div className="text-center p-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xl italic font-semibold text-blue-800 dark:text-blue-200">{plan.conclusion}</p>
      </div>

       <div className="text-center mt-12">
            <button
                onClick={onReset}
                className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
                Start a New Analysis
            </button>
        </div>
    </div>
  );
};
