import React from 'react';
import { X, TrendingUp, AlertCircle, CheckCircle2, DollarSign, Award, Target } from 'lucide-react';

interface MarketplaceInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarketplaceInsightsModal: React.FC<MarketplaceInsightsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f131e] border border-[#232b3f] rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1f283c] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
              <Award className="w-4 h-4" />
              <span>MARKET INSIGHTS & BLUEPRINTS</span>
            </div>
            <h3 className="text-xl font-bold text-white font-display">
              Why Creative Addons are a "Silent Giant"
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              High demand density, exceptional review velocity, and minimal market saturation.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Opportunity Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[#141926] border border-[#222b3e]">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Demand Density</span>
            <div className="text-2xl font-bold text-amber-400 font-mono mt-1 tabular-nums">480+</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Average verified reviews per top 50 Blender addons vs. under 15 for general utility software.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141926] border border-[#222b3e]">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Willingness to Pay</span>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1 tabular-nums">$20-$65</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Artists happily pay premium prices because a tool that saves 2 hours pays for itself in one freelance gig.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141926] border border-[#222b3e]">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Blender User Base</span>
            <div className="text-2xl font-bold text-blue-400 font-mono mt-1 tabular-nums">3M+</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Active artists using Blender worldwide, with zero subscription fees, freeing budget for addons.
            </p>
          </div>
        </div>

        {/* High-Converting Niches */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
            <Target className="w-4 h-4 text-orange-400" />
            <span>Top-Earning Addon & Resource Categories:</span>
          </span>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-[#111624] border border-[#1d263a] flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">1. Hard-Surface Topology & Seam Automation</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Props, vehicles, and weapon modelers hate manual UV seam cutting. Addons that auto-tag seams by angle or create bevel weights sell continuously for years.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#111624] border border-[#1d263a] flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">2. Procedural Generators (Cables, Pipes, Rocks, Leaves)</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Environment artists need to detail sci-fi corridors and forest scenes in minutes. Curve-based generators are instant best-sellers.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#111624] border border-[#1d263a] flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">3. Procreate Painterly Traditional Media Engines</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Digital artists crave tactile gouache, impasto oils, and analog halftone screentone stamps with genuine paper grain textures.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#131929] to-[#1c1825] border border-[#2b3550] text-xs space-y-2">
          <span className="font-semibold text-slate-100 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span>NexusForge Best Practices for Submission:</span>
          </span>
          <ul className="space-y-1.5 text-slate-300 text-[11px] pl-1">
            <li>• Always export a ready-to-load ZIP with a clean root folder named after the identifier.</li>
            <li>• Include a clear \`README.md\` and \`LICENSE\` file inside the package.</li>
            <li>• Test operators in the Viewport Simulator before publishing to ensure zero UI crashes.</li>
            <li>• Price single utility scripts at $15 - $25, and multi-feature suites at $35 - $60.</li>
          </ul>
        </div>

        {/* Bottom dismiss */}
        <div className="flex justify-end pt-2 border-t border-[#1f283c]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
          >
            Got it, Back to Workbench
          </button>
        </div>
      </div>
    </div>
  );
};
