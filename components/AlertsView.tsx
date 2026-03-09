import React from 'react';
import { BellAlertIcon } from './common/Icons';

const AlertsView: React.FC = () => {
  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-10">

      {/* Header */}
      <section className="text-center py-6">
        <h1 className="text-3xl md:text-4xl font-extralight text-stone-100 tracking-tight mb-3">
          Trend Alerts
        </h1>
        <p className="text-lg text-stone-400 font-light max-w-xl mx-auto">
          Stay ahead of emerging directions and shifts in fashion
        </p>
      </section>

      {/* Alert Configuration */}
      <div className="bg-stone-900/60 p-8 rounded-3xl border border-stone-700/40 space-y-8">

        {/* Topic Input */}
        <div>
          <label htmlFor="keyword" className="block text-sm font-medium text-stone-400 mb-3 tracking-wide">
            Direction to Watch
          </label>
          <input
            type="text"
            id="keyword"
            placeholder="e.g., 'Quiet Luxury' or 'Y2K Revival'"
            className="w-full bg-stone-800/60 border border-stone-600/50 rounded-2xl px-5 py-3.5 text-stone-100 placeholder-stone-500 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 outline-none transition-all font-light"
          />
        </div>

        {/* Notification Triggers */}
        <div>
          <h4 className="text-sm font-medium text-stone-400 mb-4 tracking-wide">Signal Triggers</h4>
          <div className="space-y-3">

            {/* Social Momentum */}
            <div className="flex items-center justify-between bg-pink-950/20 border border-pink-900/30 p-4 rounded-xl">
              <div>
                <span className="text-stone-200 font-light">Social Momentum Spike</span>
                <p className="text-xs text-stone-500 mt-1">Instagram, TikTok, Pinterest activity surge</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {/* New Brand Movement */}
            <div className="flex items-center justify-between bg-stone-800/40 border border-stone-700/40 p-4 rounded-xl">
              <div>
                <span className="text-stone-200 font-light">New Brand Movement</span>
                <p className="text-xs text-stone-500 mt-1">Major house or emerging brand enters direction</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {/* Media Coverage */}
            <div className="flex items-center justify-between bg-violet-950/20 border border-violet-900/30 p-4 rounded-xl">
              <div>
                <span className="text-stone-200 font-light">Fashion Media Coverage</span>
                <p className="text-xs text-stone-500 mt-1">Vogue, WWD, or BoF mentions increase</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {/* Sentiment Shift */}
            <div className="flex items-center justify-between bg-rose-950/20 border border-rose-900/30 p-4 rounded-xl">
              <div>
                <span className="text-stone-200 font-light">Sentiment Direction Change</span>
                <p className="text-xs text-stone-500 mt-1">Significant shift in industry perception</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-stone-700/30 flex justify-end">
          <button className="bg-amber-600/90 text-stone-950 px-8 py-3 rounded-xl font-medium hover:bg-amber-500 transition-colors">
            Save Alert
          </button>
        </div>
      </div>

      {/* Active Alerts */}
      <section className="bg-stone-900/30 rounded-3xl p-8 border border-stone-800/50">
        <h2 className="text-sm font-medium tracking-widest uppercase text-stone-500 mb-6">
          Active Alerts
        </h2>
        <div className="text-center py-8">
          <p className="text-stone-400 font-light">No active alerts yet</p>
          <p className="text-sm text-stone-500 mt-2 font-light">
            Create your first alert to start tracking trend directions
          </p>
        </div>
      </section>

    </div>
  );
};

export default AlertsView;
