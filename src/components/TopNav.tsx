import React from 'react';
import { Download, Sparkles, Box } from 'lucide-react';
import { PlatformType } from '../types/addon';

interface TopNavProps {
  currentPlatform: PlatformType;
  onSelectPlatform: (platform: PlatformType) => void;
  onExportZip: () => void;
  isExporting?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentPlatform,
  onSelectPlatform,
  onExportZip,
  isExporting = false,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-[#0e111a] border-b border-[#1f2638] sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <a href="/" className="flex items-center gap-2.5 text-slate-100 whitespace-nowrap shrink-0 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-orange-500/10">
          <Box className="w-4 h-4 text-slate-950 stroke-[2.5]" />
        </div>
        <div className="flex flex-col">
          <span className="font-display font-bold text-base tracking-tight text-white group-hover:text-amber-400 transition-colors">
            NexusForge Studio
          </span>
          <span className="text-[10px] text-slate-500 -mt-0.5 tracking-wider font-mono">
            CREATIVE TOOL ENGINE
          </span>
        </div>
      </a>

      {/* Zone 2: 4 clean single-line platform tabs */}
      <nav className="flex items-center gap-1.5 p-1 bg-[#141926] rounded-lg border border-[#232b3e]">
        <button
          onClick={() => onSelectPlatform('blender')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            currentPlatform === 'blender'
              ? 'bg-[#ea580c] text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2133]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-orange-300" />
          Blender 4.x
        </button>
        <button
          onClick={() => onSelectPlatform('zbrush')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            currentPlatform === 'zbrush'
              ? 'bg-[#2563eb] text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2133]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-300" />
          ZBrush
        </button>
        <button
          onClick={() => onSelectPlatform('procreate')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            currentPlatform === 'procreate'
              ? 'bg-[#8b5cf6] text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2133]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-purple-300" />
          Procreate
        </button>
        <button
          onClick={() => onSelectPlatform('photoshop')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            currentPlatform === 'photoshop'
              ? 'bg-[#0284c7] text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2133]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-300" />
          Photoshop UXP
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onExportZip}
          disabled={isExporting}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg hover:from-amber-300 hover:to-orange-400 transition-all flex items-center gap-2 shadow-lg shadow-orange-500/15 disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          {isExporting ? 'Packaging Archive...' : 'Download .ZIP Package'}
        </button>
      </div>
    </header>
  );
};
