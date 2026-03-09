
import React from 'react';
import type { TrendAnalysis } from '../types';
import { ShieldCheckIcon } from './common/Icons';

interface CompetitorsViewProps {
  data: TrendAnalysis;
}

const CompetitorsView: React.FC<CompetitorsViewProps> = ({ data }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <ShieldCheckIcon className="w-8 h-8 text-blue-400 mr-4" />
        <div>
            <h2 className="text-2xl font-bold text-white">Competitive Landscape</h2>
            <p className="text-gray-400">Key players and their recent activities for "{data.topic}".</p>
        </div>
      </div>
      
      {data.competitors && data.competitors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.competitors.map((competitor, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col hover:border-blue-500 transition-colors duration-300">
              <h3 className="text-lg font-bold text-blue-400 mb-2">{competitor.name}</h3>
              <p className="text-sm text-gray-300 mb-4 flex-grow">{competitor.summary}</p>
              <div>
                <h4 className="text-sm font-semibold text-gray-200 mb-2">Recent Activity</h4>
                <p className="text-xs text-gray-400 bg-gray-900/50 p-3 rounded-lg border border-gray-700">{competitor.recentActivity}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
            <p className="text-gray-400">No specific competitors were identified for this topic.</p>
        </div>
      )}
    </div>
  );
};

export default CompetitorsView;
