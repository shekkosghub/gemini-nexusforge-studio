import React, { useState } from 'react';
import { DollarSign, Copy, Check, Sparkles, TrendingUp, Tag, ShieldCheck, ShoppingCart, Globe, ExternalLink } from 'lucide-react';
import { AddonProject } from '../types/addon';

interface MarketplaceStudioProps {
  project: AddonProject;
  onUpdateProject: (updated: AddonProject) => void;
}

export const MarketplaceStudio: React.FC<MarketplaceStudioProps> = ({
  project,
  onUpdateProject,
}) => {
  const [salesCopy, setSalesCopy] = useState<string>('');
  const [isGeneratingCopy, setIsGeneratingCopy] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [estimatedSalesPerMonth, setEstimatedSalesPerMonth] = useState<number>(45);

  const price = project.marketplaceInfo?.suggestedPriceUSD || 20;
  const grossMonthly = price * estimatedSalesPerMonth;
  const platformFee = grossMonthly * 0.1; // ~10% platform fee
  const netEarnings = grossMonthly - platformFee;

  const handleGenerateCopy = async () => {
    setIsGeneratingCopy(true);
    try {
      const res = await fetch('/api/marketplace-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project }),
      });
      const data = await res.json();
      if (data.copy) {
        setSalesCopy(data.copy);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const handleCopySalesText = () => {
    const textToCopy = salesCopy || `# ${project.marketplaceInfo.title}

${project.summary}

### Key Features:
${project.marketplaceInfo.features.map(f => `• ${f}`).join('\n')}

### Target Audience:
${project.marketplaceInfo.targetAudience}

### Installation Guide:
${project.marketplaceInfo.installationGuide}
`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0f17] border border-[#1e2538] rounded-xl overflow-hidden shadow-xl p-6 space-y-6">
      {/* Top Banner: Marketplace Title & Price Strategy */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1f283c] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-orange-400 font-medium mb-1">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Marketplace Packaging & Sales Strategy</span>
          </div>
          <h2 className="text-lg font-bold text-white font-display">
            {project.marketplaceInfo.title || project.name}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Optimized for BlenderMarket, Gumroad, and ArtStation Storefronts.
          </p>
        </div>

        {/* Pricing Strategy Strip */}
        <div className="flex items-center gap-4 bg-[#141a27] border border-[#232d42] p-3 rounded-lg">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Suggested Price</div>
            <div className="text-xl font-bold text-amber-400 font-mono tabular-nums">
              ${price} <span className="text-xs text-slate-400 font-normal">USD</span>
            </div>
          </div>

          <div className="h-8 w-px bg-[#232d42]" />

          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Projected Monthly Net</div>
            <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
              ${netEarnings.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Estimator & Sales Volume Slider */}
      <div className="p-4 rounded-xl bg-[#111624] border border-[#20293d] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-200">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Revenue Projection Simulator ({estimatedSalesPerMonth} sales/mo)</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 tabular-nums">
            Estimated conversion: 2.8% of product page visitors
          </span>
        </div>

        <input
          type="range"
          min="10"
          max="250"
          step="5"
          value={estimatedSalesPerMonth}
          onChange={(e) => setEstimatedSalesPerMonth(Number(e.target.value))}
          className="w-full accent-amber-500 cursor-pointer"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
          <div className="bg-[#0b0e16] p-2.5 rounded border border-[#1a2234]">
            <span className="text-slate-500 block text-[11px]">Gross Revenue</span>
            <span className="font-mono text-slate-200 font-bold tabular-nums">${grossMonthly.toLocaleString()} USD</span>
          </div>
          <div className="bg-[#0b0e16] p-2.5 rounded border border-[#1a2234]">
            <span className="text-slate-500 block text-[11px]">Platform Royalty / Dev Cut</span>
            <span className="font-mono text-slate-300 font-bold tabular-nums">90% ($ {netEarnings.toLocaleString()})</span>
          </div>
          <div className="bg-[#0b0e16] p-2.5 rounded border border-[#1a2234]">
            <span className="text-slate-500 block text-[11px]">Demand Density</span>
            <span className="text-amber-400 font-medium">High (Few competing direct alternatives)</span>
          </div>
        </div>
      </div>

      {/* Product Taglines & Value Propositions */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-200 block">
          Key Converting Taglines:
        </span>
        <div className="space-y-1.5">
          {project.marketplaceInfo.taglines.map((tagline, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 p-2 rounded bg-[#0f1420] border border-[#1d263a] text-xs text-slate-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
              <span>{tagline}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Target Audience & SEO Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-[#0e121c] border border-[#1c2436] space-y-1.5 text-xs">
          <span className="font-semibold text-slate-200 block">Target Audience:</span>
          <p className="text-slate-400 text-xs leading-relaxed">
            {project.marketplaceInfo.targetAudience}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-[#0e121c] border border-[#1c2436] space-y-1.5 text-xs">
          <span className="font-semibold text-slate-200 block">Marketplace SEO Tags:</span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.marketplaceInfo.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[11px] text-slate-300 bg-[#161c2b] border border-[#252f44] px-2 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Long-Form Sales Pitch & Generator */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Storefront Markdown Sales Page (BlenderMarket / Gumroad)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateCopy}
              disabled={isGeneratingCopy}
              className="px-3 py-1 text-xs text-amber-300 bg-amber-950/40 border border-amber-800/50 hover:bg-amber-900/40 rounded flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Sparkles className={`w-3 h-3 ${isGeneratingCopy ? 'animate-spin' : ''}`} />
              <span>{isGeneratingCopy ? 'Crafting Pitch...' : 'AI Expand Sales Page'}</span>
            </button>

            <button
              onClick={handleCopySalesText}
              className="px-3 py-1 text-xs text-slate-300 hover:text-white bg-[#1a2133] hover:bg-[#232c44] border border-[#27324c] rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-[#090b12] border border-[#1b2336] rounded-xl p-4 font-mono text-xs text-slate-300 max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed">
          {salesCopy || `# ${project.marketplaceInfo.title}

${project.summary}

## The Problem
Creative artists spend over 30% of their working hours on tedious repetitive setups instead of sculpting, painting, and designing.

## The Solution
${project.name} is a high-performance commercial suite designed from the ground up for ${project.platform.toUpperCase()}. It streamlines your pipeline into 1-click automated workflows with non-destructive reversible operations.

### Key Features:
${project.marketplaceInfo.features.map(f => `• ${f}`).join('\n')}

### Target Software Version:
Compatible with ${project.platform.toUpperCase()} 4.x and above.

### What You Get:
• Full Production Addon (.zip ready for installation)
• Complete Source Code & Operators
• Step-by-Step PDF & Markdown Installation Guide
• Free Future Lifetime Updates
`}
        </div>
      </div>
    </div>
  );
};
