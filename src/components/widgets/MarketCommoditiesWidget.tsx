import React, { useState } from 'react';
import { WidgetInstance } from '../../types/widget';
import { WidgetFrame } from './WidgetFrame';
import { useDashboard } from '../../context/DashboardContext';
import { getThemeClasses } from '../../utils/themeStyles';
import { TrendingUp, TrendingDown, DollarSign, Fuel, Gem, Cpu } from 'lucide-react';

interface Asset {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isUp: boolean;
  category: string;
}

const ASSETS: Asset[] = [
  { symbol: 'BRENT', name: 'Brent Crude Oil (bbl)', price: '$84.42', change: '+2.4%', isUp: true, category: 'ENERGY' },
  { symbol: 'GOLD', name: 'Gold Spot (oz)', price: '$2,840.50', change: '+0.8%', isUp: true, category: 'METALS' },
  { symbol: 'URA', name: 'Uranium Yellowcake (lb)', price: '$92.30', change: '+3.1%', isUp: true, category: 'STRATEGIC' },
  { symbol: 'SOXX', name: 'Semiconductor Index ETF', price: '$238.10', change: '-1.4%', isUp: false, category: 'TECH' },
  { symbol: 'NATGAS', name: 'TTF European Natural Gas', price: '€38.20', change: '+4.2%', isUp: true, category: 'ENERGY' },
  { symbol: 'LITHIUM', name: 'Lithium Carbonate (t)', price: '$14,200', change: '-0.5%', isUp: false, category: 'METALS' },
];

export const MarketCommoditiesWidget: React.FC<{ instance: WidgetInstance; index: number }> = ({ instance, index }) => {
  const { theme, accent } = useDashboard();
  const t = getThemeClasses(theme, accent);
  const [activeTab, setActiveTab] = useState<string>(instance.activeTab || 'STRATEGIC_ASSETS');

  return (
    <WidgetFrame instance={instance} activeTab={activeTab} onTabChange={setActiveTab} index={index}>
      <div className="flex-1 flex flex-col min-h-0 p-3 space-y-3 font-mono text-xs overflow-y-auto">
        <div className="space-y-1.5">
          {ASSETS.map((asset) => (
            <div
              key={asset.symbol}
              className={`p-2 border rounded-xs flex items-center justify-between transition-colors ${
                theme === 'dark' ? 'bg-zinc-950/60 border-zinc-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-xs ${asset.isUp ? 'bg-emerald-950/60 text-emerald-400' : 'bg-rose-950/60 text-rose-400'}`}>
                  {asset.isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <span className="font-bold text-zinc-100 block">{asset.symbol}</span>
                  <span className="text-[10px] text-zinc-400">{asset.name}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-zinc-100 text-xs block">{asset.price}</span>
                <span className={`text-[10px] font-bold ${asset.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {asset.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WidgetFrame>
  );
};
